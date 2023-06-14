import type { NextApiRequest, NextApiResponse } from 'next'
import type { UrlMetaWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import { unfurl } from '@/lib/hackedUnfurl';
import log from '@/lib/log'
import util from 'util'
import {v2 as cloudinary} from 'cloudinary'

const cloudinarySecret = process.env.CLOUDINARY_JSON_SECRET ? JSON.parse(process.env.CLOUDINARY_JSON_SECRET) : false

if (cloudinarySecret) {
  cloudinary.config({
  cloud_name: cloudinarySecret.cloud_name,
  api_key: cloudinarySecret.api_key,
  api_secret: cloudinarySecret.api_secret,
  upload_preset: 'linkpreview',
  secure: true,
})
}

// TODO: don't generate it unless the user saves the post?
// TODO: cache/reuse? i think we're making a new one every time?
// TODO: add transforms to restrain the size to a link preview's reasonable limits
const getPermanentCloudinaryUrl = async (imageUrl:string) : Promise<string> => {
  if (!cloudinarySecret) {
    log.error("cant getPermanentCloudinaryUrl, no secret present")
    return imageUrl
  }
  // the purpose of cloudinary urls for link previews is:
  // - meta properties return very short-lived resources or resources that do
  // not work for general internet access and can only be seen by certain
  // clients.
  // - we can also resize and process the image, which we do via the linkpreview
  // upload preset. it gets limited to 300px square, recompressed, etc.
  // - because we don't currently reprocess/update link previews and can't
  // trust the origin to keep the image alive long-term, we have to keep them
  // working in perpetuity.
  // - this is all TBD for better workflow/process/policy.
  if (imageUrl.trim()) {
    console.log("getPermanentCloudinaryUrl", imageUrl)
    return await cloudinary.uploader.upload(imageUrl.trim(),{secure:true})
      .then(result => {
        // example result
        // {
        //   asset_id: '825c89a6f6b6cb44673261131490ab8b',
        //   public_id: 'ltj7jiyfjubf2av9zvge',
        //   version: 1670968497,
        //   version_id: '60772e9308c633b25bb3213abe214594',
        //   signature: '25210ee14cf2ec476356a060423c06c0932c1a1a',
        //   width: 300,
        //   height: 300,
        //   format: 'png',
        //   resource_type: 'image',
        //   created_at: '2022-12-13T21:54:57Z',
        //   tags: [],
        //   bytes: 27888,
        //   type: 'upload',
        //   etag: 'b36c7677ba7773ec401b760101d3e382',
        //   placeholder: false,
        //   url: 'http://res.cloudinary.com/dbpulyvbq/image/upload/v1670968497/ltj7jiyfjubf2av9zvge.png',
        //   secure_url: 'https://res.cloudinary.com/dbpulyvbq/image/upload/v1670968497/ltj7jiyfjubf2av9zvge.png',
        //   folder: '',
        //   access_mode: 'public',
        //   original_filename: 'tmp-95-0sRGU9zPbBNU',
        //   ...
        // }
        if (result && result.url) {
          // TODO why aren't the {secure:true} options working? why do i have
          // to force https via string replace? i've added the option to both
          // the config and upload calls.
          return result.url.replace('http://','https://')
        } else {
          // todo: this sucks, the image might not be ssl
          // if (debug) debug.push(`cloudinary result has no image: ${util.inspect(result,{depth:null,maxStringLength:300})}`)
          return imageUrl
        }
      }).catch((e) => {
        log.error('cloudinary linkpreview image upload error', e)
        // if (debug) debug.push(`cloudinary linkpreview image upload error: ${util.inspect(e,{depth:null,maxStringLength:300})}`)
        // todo: this sucks, the image might not be ssl
        return imageUrl
      })
  } else {
    return ""
  }
}

// the unfurl code has no typing, this is the stuff we care about from the
// results:
type UnfurlResults = {
  open_graph?: { title: string, images?: {secure_url?:string, url?:string}[]  },
  twitter_card: { title: string, images?: {url:string}[]  },
  oEmbed?: { title: string, thumbnails?: {url:string}[]  },
  title?: string,
}

const getUrlMetaWithFetch = async (parsedUrl: URL) : Promise<ApiUrlMeta> => {
  log.serverApi('unfurling', parsedUrl.toString());
  const unfurled = await unfurl(parsedUrl.toString(),{
    follow: 3,
    timeout: 6000,
  }) as UnfurlResults;
  log.serverApi("results:", util.inspect(unfurled,{depth:null,colors:false}))
  const host = parsedUrl.host;
  // for titles, the open graph and other embedded metadata titles tend to be
  // more what we want to see over the html title itself.
  const title =
    unfurled.open_graph?.title ||
    unfurled.twitter_card?.title ||
    unfurled.oEmbed?.title ||
    unfurled.title ||
    host;
  const imageUrl =
    unfurled.open_graph?.images?.[0].secure_url ||
    unfurled.open_graph?.images?.[0].url ||
    unfurled.twitter_card?.images?.[0].url ||
    unfurled.oEmbed?.thumbnails?.[0].url ||
    '';
  const payload : ApiUrlMeta = {
    host: host.trim(),
    title: title.trim(),
    imageUrl: imageUrl.trim(),
  };
  if (payload.host === 'twitter.com' && payload.imageUrl.indexOf('pbs.twimg.com/profile_images') >= 0) {
    // we can get better twitter profile images than the ones twitter returns
    // in the og metadata with a simple find/replace on _normal to remove it.
    // see
    // https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/user-profile-images-and-banners
    payload.imageUrl = payload.imageUrl.replace('_normal.','.')
  }
  payload.imageUrl = await getPermanentCloudinaryUrl(payload.imageUrl) 
  return payload
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getAuthUser(req, res)
  if (!user) {
    // require auth for unfurling
    const wrapper: ErrorWrapper = {
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(401).json(wrapper)
    return
  }
  // this is a POST query so we can use the body for the url for better
  // transport reliability since i'm not sure what kind of querystring length
  // limits we're dealing with. also makes for easier debugging in the console
  // to not have gigantic ugly url params.
  let parsedUrl : URL;
  try {
    parsedUrl = new URL(req.body.url);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new Error('bad proto');
    }
    if (parsedUrl.username || parsedUrl.password) {
      throw new Error('auth on urls not allowed');
    }
  } catch (e) {
    const wrapper: ErrorWrapper = {
      action: 'getUrlMeta',
      status: 400,
      success: false,
      errorId: "ERR_BAD_INPUT",
      errorMsg: "url query parameter is not a valid URL"
    }
    res.status(400).json(wrapper)
    return;
  }
  let urlMeta : ApiUrlMeta
  try {
    urlMeta = await getUrlMetaWithFetch(parsedUrl)
  } catch (e) {
    const wrapper: ErrorWrapper = {
      action: 'getUrlMeta',
      status: 500,
      success: false,
      errorId: "ERR_REMOTE_FETCH_FAILED",
      errorMsg: "could not fetch/parse remote url",
    }
    res.status(500).json(wrapper)
    return;
  }
  const wrapper: UrlMetaWrapper = {
    action: 'newPost',
    status: 200,
    success: true,
    payload: { urlMeta, url: parsedUrl.toString() },
  }
  res.status(200).json(wrapper)
}


