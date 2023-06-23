import type { NextApiRequest, NextApiResponse } from 'next'
import type { UrlMetaWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import { unfurl, unfurlFromHtmlContent } from '@/lib/hackedUnfurl';
import log from '@/lib/log'
import util from 'util'
import {v2 as cloudinary} from 'cloudinary'
import profileUtils from '@/lib/profileUtils'

const getParseB64Json = (str:string | undefined) : POJO | false => {
  // console.log("debug str:",str)
  if (!str || !str.trim()) return false
  if (typeof window !== 'undefined') {
    // console.log("debug atob:",window.atob(str))
    return JSON.parse(window.atob(str)) as POJO
  } else {
    // console.log("debug buffer decoded:",Buffer.from(str, 'base64').toString('utf8'))
    return JSON.parse(Buffer.from(str, 'base64').toString('utf8')) as POJO
  }
}

type CloudinarySecret = {
  cloud_name: string,
  api_key: string,
  api_secret: string,
  upload_preset: string,
}
// console.log("debug CLOUDINARY_JSON_SECRET_B64:",JSON.stringify(process.env.CLOUDINARY_JSON_SECRET_B64))
const cloudinarySecret = getParseB64Json(process.env.CLOUDINARY_JSON_SECRET_B64) as CloudinarySecret | false

if (cloudinarySecret) {
  cloudinary.config({
  cloud_name: cloudinarySecret.cloud_name,
  api_key: cloudinarySecret.api_key,
  api_secret: cloudinarySecret.api_secret,
  upload_preset: 'linkpreview',
  secure: true,
})
}

type CldResp = {
  imageUrl: string,
  imageMeta?: CldImageMetaUrl
}

// TODO: don't generate it unless the user saves the post?
// TODO: cache/reuse? i think we're making a new one every time?
// TODO: add transforms to restrain the size to a link preview's reasonable limits
const getPermanentCloudinaryUrl = async (imageUrl:string) : Promise<CldResp> => {
  if (!cloudinarySecret) {
    log.error("cant getPermanentCloudinaryUrl, no secret present")
    return {imageUrl}
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
        if (result && result.secure_url) {
          return {imageUrl: result.secure_url, imageMeta: {...result, metaOrigin:'urlMeta'} as CldImageMetaUrl}
        } else if (result && result.url) {
          return {imageUrl: result.url.replace('http://','https://'), imageMeta: {...result, metaOrigin:'urlMeta'} as CldImageMetaUrl}
        } else {
          // todo: this sucks, the image might not be ssl
          // if (debug) debug.push(`cloudinary result has no image: ${util.inspect(result,{depth:null,maxStringLength:300})}`)
          return {imageUrl}
        }
      }).catch((e) => {
        log.error('cloudinary linkpreview image upload error', e)
        // if (debug) debug.push(`cloudinary linkpreview image upload error: ${util.inspect(e,{depth:null,maxStringLength:300})}`)
        // todo: this sucks, the image might not be ssl
        return {imageUrl}
      })
  } else {
    return {imageUrl:""}
  }
}

const getHtmlFromZyte = async (parsedUrl: URL) : Promise<string> => {
  try {
    let apiUrl = 'https://0lmgbb3i-splash.scrapinghub.com/render.json'
    const qs = new URLSearchParams({
      url: parsedUrl.toString(),
      timeout: '5', // zyte doesn't seem to respect this timeout?
      // this wait param is weak sauce. but w/o it twitter doesn't work. how long
      // to wait *depends* on how long the page takes. unreliable w/o clear
      // critera. what if any particular javascript-driven SPA bootup request
      // happens to take longer than this? we will not know anything was wrong
      // but will present a bad result to our user.
      wait: '0.5',
      html: '1',
      // width: '300',
      // height: '300',
      // viewport: '1200x1200',
      // images: '1',
      // png: '1',
      // http2: '1',
    }).toString();
    apiUrl = apiUrl + '?' + qs.toString()
    const headers = new Headers();
    const username = process.env.ZYTE_SPLASH_USERNAME;
    const password = '';
    const authString = `${username}:${password}`
    headers.set('Authorization', 'Basic ' + Buffer.from(authString, 'utf8').toString('base64'));
    headers.set('Accept', 'application/json')
    const config = {
      method: 'GET',
      headers,
      timeout: 6000,
    };
    const res = await fetch(apiUrl, config);
    const text = await res.text();
    const splashData = JSON.parse(text);
    log.unfurl("zyteresponse:", util.inspect(splashData,{depth:null,maxStringLength:300}))
    if (!splashData || !splashData.html) {
      // if (debug) debug.push(`no html found in splash data`)
      // if (debug) debug.push("splash response was:", util.inspect(splashData,{depth:null,maxStringLength:300}))
      throw new Error('no html found in splash data')
    }
    return splashData.html
  } catch(e) {
    log.error("error in zyte fetch", e)
    // if (debug) debug.push(`error in zyte fetch: ${util.inspect(e,{depth:null,maxStringLength:300})}`)
    return ''
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

const massageResults = (unfurled: UnfurlResults | false, parsedUrl: URL) : ApiUrlMeta | false => {
  // take the unfurl output and collapse it to our simple three-field api
  // payload format using some best-guess heuristics.
  if (!unfurled) return false
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
  const payload = {
    host: host.trim(),
    title: title.trim(),
    imageUrl: imageUrl.trim(),
  } as ApiUrlMeta;
  if (payload.host === 'twitter.com' && payload.imageUrl.indexOf('pbs.twimg.com/profile_images') >= 0) {
    // we can get better twitter profile images than the ones twitter returns
    // in the og metadata with a simple find/replace on _normal to remove it.
    // see
    // https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/user-profile-images-and-banners
    payload.imageUrl = payload.imageUrl.replace('_normal.','.')
  }
  return payload
}

const getUnfurledWithFetch = async (parsedUrl: URL) : Promise<UnfurlResults | false> => {
  log.serverApi('unfurling', parsedUrl.toString());
  try {
    const unfurled = await unfurl(parsedUrl.toString(),{
      follow: 3,
      timeout: 6000,
    }) as UnfurlResults;
    log.serverApi("results:", util.inspect(unfurled,{depth:null,colors:false}))
    return unfurled
  } catch(e) {
    return false
  }
}

const getUnfurledFromHtml = async (html:string, parsedUrl:URL) : Promise<UnfurlResults | false> => {
  if (!html.trim()) return false
  try {
    const unfurled = await unfurlFromHtmlContent({html, url: parsedUrl.toString(), opts:{}}) as UnfurlResults
    // log.unfurl("results:", util.inspect(unfurled,{depth:null,colors:false}))
    return unfurled
  } catch(e) {
    log.unfurl("unfurl from html failed:",e)
    // if (debug) debug.push(`unfurl from html failed: ${util.inspect(e,{depth:null,maxStringLength:300})}`)
    return false
  }
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
  const parsedUrl = profileUtils.getParsedUrl(req.body.url)
  if (!parsedUrl) {
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
  // fetch directly from our server via unfurl, and ask zyte to fetch the html
  // for a page. the html from zyte's headless browser scraping can sometimes
  // produce better results than a direct html fetch.
  const doUnfurl = getUnfurledWithFetch(parsedUrl)
  const doZyte = getHtmlFromZyte(parsedUrl).then((html) => getUnfurledFromHtml(html, parsedUrl))
  const [viaUnfurl,viaZyte] = await Promise.all([doUnfurl,doZyte])
  const massagedUnfurl = massageResults(viaUnfurl, parsedUrl)
  const massagedZyte = massageResults(viaZyte, parsedUrl)
  log.unfurl("massagedUnfurl:",massagedUnfurl)
  log.unfurl("massagedZyte:",massagedZyte)
  // if zyte returned an image, let's prefer it
  if (massagedZyte && massagedZyte.imageUrl) {
    const cldResp = await getPermanentCloudinaryUrl(massagedZyte.imageUrl)
    massagedZyte.imageUrl = cldResp.imageUrl
    massagedZyte.imageMeta = cldResp.imageMeta
    const wrapper: UrlMetaWrapper = {
      action: 'getUrlMeta',
      status: 200,
      success: true,
      payload: { urlMeta: massagedZyte, url: parsedUrl.toString() },
    }
    res.status(200).json(wrapper)
    return;
  }
  // otherwise if unfurl returned ANY results, we'll use that, since zyte's
  // crawlers get blocked by facebook and our own ip is safer.
  if (massagedUnfurl) {
    if (massagedUnfurl.imageUrl) {
      const cldResp = await getPermanentCloudinaryUrl(massagedUnfurl.imageUrl)
      massagedUnfurl.imageUrl = cldResp.imageUrl
      massagedUnfurl.imageMeta = cldResp.imageMeta
    }
    const wrapper: UrlMetaWrapper = {
      action: 'getUrlMeta',
      status: 200,
      success: true,
      payload: { urlMeta: massagedUnfurl, url: parsedUrl.toString() },
    }
    res.status(200).json(wrapper)
    return;
  }
  // if we have any zyte data but none for unfurl, use zyte
  if (massagedZyte) {
    const wrapper: UrlMetaWrapper = {
      action: 'getUrlMeta',
      status: 200,
      success: true,
      payload: { urlMeta: massagedZyte, url: parsedUrl.toString() },
    }
    res.status(200).json(wrapper)
    return;
  }
  // neither worked
  const wrapper: ErrorWrapper = {
    action: 'getUrlMeta',
    status: 500,
    success: false,
    errorId: "ERR_REMOTE_FETCH_FAILED",
    errorMsg: "could not fetch remote url",
  }
  res.status(500).json(wrapper)
  return;
}

