import type { NextApiRequest, NextApiResponse } from 'next'
import type { UrlMetaWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import { unfurl } from '@/lib/hackedUnfurl';
import log from '@/lib/log'
import util from 'util'

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


