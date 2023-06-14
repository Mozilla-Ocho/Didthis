/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck 


/*
 *
 * this is a version of
 * https://github.com/jacktuck/unfurl/blob/v6.1.0/src/index.ts
 *
 * that i have modified in the following ways:
 * - added unfurlFromHtmlContent() that takes an html payload instead of
 *   fetching the html. we feed this the output of the zyte api call.
 * - removed the typescript annotations so it will compile as a regular
 *   appserver module.
 * - modified slightly to work as a direct es module import without any
 *   transpilation (he and iconv imports syntax changed etc)
 * - brought in some imported modules as direct code, like the 'schema'
 *   constant, UnexpectedError, etc.
 *
 */
import { URL } from "url";
import { Parser } from "htmlparser2";
import fetch from "node-fetch";
import he from "he";
const he_decode = he.decode
import icvl from "iconv-lite";
const iconv_decode = icvl.decode

const schema = new Map([
  ["twitter:card", { entry: "twitter_card", name: "card", type: "string" }],
  ["twitter:url", { entry: "twitter_card", name: "url", type: "url" }],
  ["twitter:site", { entry: "twitter_card", name: "site", type: "string" }],
  [
    "twitter:creator",
    { entry: "twitter_card", name: "creator", type: "string" },
  ],
  [
    "twitter:creator:id",
    { entry: "twitter_card", name: "creator_id", type: "string" },
  ],
  ["twitter:title", { entry: "twitter_card", name: "title", type: "string" }],
  [
    "twitter:description",
    { entry: "twitter_card", name: "description", type: "string" },
  ],
  [
    "twitter:image",
    { entry: "twitter_card", name: "url", parent: "images", type: "url" },
  ],
  [
    "twitter:image:src",
    { entry: "twitter_card", name: "url", parent: "images", type: "url" },
  ],
  [
    "twitter:image:alt",
    { entry: "twitter_card", name: "alt", parent: "images", type: "string" },
  ],
  [
    "twitter:player",
    { entry: "twitter_card", name: "url", parent: "players", type: "string" },
  ],
  [
    "twitter:player:stream",
    {
      entry: "twitter_card",
      name: "stream",
      parent: "players",
      type: "string",
    },
  ],
  [
    "twitter:player:width",
    { entry: "twitter_card", name: "width", parent: "players", type: "number" },
  ],
  [
    "twitter:player:height",
    {
      entry: "twitter_card",
      name: "height",
      parent: "players",
      type: "number",
    },
  ],
  [
    "twitter:app:id:iphone",
    {
      entry: "twitter_card",
      name: "id",
      parent: "apps",
      category: "iphone",
      type: "string",
    },
  ],
  [
    "twitter:app:name:iphone",
    {
      entry: "twitter_card",
      name: "name",
      parent: "apps",
      category: "iphone",
      type: "string",
    },
  ],
  [
    "twitter:app:url:iphone",
    {
      entry: "twitter_card",
      name: "url",
      parent: "apps",
      category: "iphone",
      type: "string",
    },
  ],
  [
    "twitter:app:id:ipad",
    {
      entry: "twitter_card",
      name: "id",
      parent: "apps",
      category: "ipad",
      type: "string",
    },
  ],
  [
    "twitter:app:name:ipad",
    {
      entry: "twitter_card",
      name: "name",
      parent: "apps",
      category: "ipad",
      type: "string",
    },
  ],
  [
    "twitter:app:url:ipad",
    {
      entry: "twitter_card",
      name: "url",
      parent: "apps",
      category: "ipad",
      type: "string",
    },
  ],
  [
    "twitter:app:id:googleplay",
    {
      entry: "twitter_card",
      name: "id",
      parent: "apps",
      category: "googleplay",
      type: "string",
    },
  ],
  [
    "twitter:app:name:googleplay",
    {
      entry: "twitter_card",
      name: "name",
      parent: "apps",
      category: "googleplay",
      type: "string",
    },
  ],
  [
    "twitter:app:url:googleplay",
    {
      entry: "twitter_card",
      name: "url",
      parent: "apps",
      category: "googleplay",
      type: "string",
    },
  ],
  ["og:title", { entry: "open_graph", name: "title", type: "string" }],
  ["og:type", { entry: "open_graph", name: "type", type: "string" }],
  [
    "og:image",
    { entry: "open_graph", name: "url", parent: "images", type: "url" },
  ],
  [
    "og:image:url",
    { entry: "open_graph", name: "url", parent: "images", type: "url" },
  ],
  [
    "og:image:secure_url",
    { entry: "open_graph", name: "secure_url", parent: "images", type: "url" },
  ],
  [
    "og:image:width",
    { entry: "open_graph", name: "width", parent: "images", type: "number" },
  ],
  [
    "og:image:height",
    { entry: "open_graph", name: "height", parent: "images", type: "number" },
  ],
  [
    "og:image:alt",
    { entry: "open_graph", name: "alt", parent: "images", type: "string" },
  ],
  [
    "og:image:type",
    { entry: "open_graph", name: "type", parent: "images", type: "string" },
  ],
  ["og:url", { entry: "open_graph", name: "url", type: "url" }],
  [
    "og:audio",
    { entry: "open_graph", name: "url", parent: "audio", type: "url" },
  ],
  [
    "og:audio:url",
    { entry: "open_graph", name: "url", parent: "audio", type: "url" },
  ],
  [
    "og:audio:secure_url",
    { entry: "open_graph", name: "secure_url", parent: "audio", type: "url" },
  ],
  [
    "og:audio:type",
    { entry: "open_graph", name: "type", parent: "audio", type: "string" },
  ],
  [
    "og:description",
    { entry: "open_graph", name: "description", type: "string" },
  ],
  [
    "og:determiner",
    { entry: "open_graph", name: "determiner", type: "string" },
  ],
  ["og:locale", { entry: "open_graph", name: "locale", type: "string" }],
  [
    "og:locale:alternate",
    { entry: "open_graph", name: "locale_alt", type: "string" },
  ],
  ["og:site_name", { entry: "open_graph", name: "site_name", type: "string" }],
  [
    "og:video",
    { entry: "open_graph", name: "url", parent: "videos", type: "url" },
  ],
  [
    "og:video:url",
    { entry: "open_graph", name: "url", parent: "videos", type: "url" },
  ],
  [
    "og:video:secure_url",
    {
      entry: "open_graph",
      name: "secure_url",
      parent: "videos",
      type: "string",
    },
  ],
  [
    "og:video:width",
    { entry: "open_graph", name: "width", parent: "videos", type: "number" },
  ],
  [
    "og:video:height",
    { entry: "open_graph", name: "height", parent: "videos", type: "number" },
  ],
  [
    "og:video:type",
    { entry: "open_graph", name: "type", parent: "videos", type: "string" },
  ],
  [
    "og:video:tag",
    { entry: "open_graph", name: "tag", parent: "videos", type: "string" },
  ],
  [
    "article:published_time",
    {
      entry: "open_graph",
      name: "published_time",
      parent: "articles",
      type: "string",
    },
  ],
  [
    "article:modified_time",
    {
      entry: "open_graph",
      name: "modified_time",
      parent: "articles",
      type: "string",
    },
  ],
  [
    "article:expiration_time",
    {
      entry: "open_graph",
      name: "expiration_time",
      parent: "articles",
      type: "string",
    },
  ],
  [
    "article:author",
    { entry: "open_graph", name: "author", parent: "articles", type: "string" },
  ],
  [
    "article:section",
    {
      entry: "open_graph",
      name: "section",
      parent: "articles",
      type: "string",
    },
  ],
  [
    "article:tag",
    { entry: "open_graph", name: "tag", parent: "articles", type: "string" },
  ],
  // oEmbed: is prepended to these fields so that it does not interfere with root title or description
  ["oEmbed:type", { entry: "oEmbed", name: "type", type: "string" }],
  ["oEmbed:version", { entry: "oEmbed", name: "version", type: "string" }],
  ["oEmbed:title", { entry: "oEmbed", name: "title", type: "string" }],
  [
    "oEmbed:author_name",
    { entry: "oEmbed", name: "author_name", type: "string" },
  ],
  ["oEmbed:author_url", { entry: "oEmbed", name: "author_url", type: "url" }],
  [
    "oEmbed:provider_name",
    { entry: "oEmbed", name: "provider_name", type: "string" },
  ],
  [
    "oEmbed:provider_url",
    { entry: "oEmbed", name: "provider_url", type: "string" },
  ],
  ["oEmbed:cache_age", { entry: "oEmbed", name: "cache_age", type: "string" }],
  [
    "oEmbed:thumbnail_url",
    { entry: "oEmbed", name: "url", parent: "thumbnails", type: "url" },
  ],
  [
    "oEmbed:thumbnail_width",
    { entry: "oEmbed", name: "width", parent: "thumbnails", type: "number" },
  ],
  [
    "oEmbed:thumbnail_height",
    { entry: "oEmbed", name: "height", parent: "thumbnails", type: "number" },
  ],
  ["oEmbed:url", { entry: "oEmbed", name: "url", type: "url" }],
  ["oEmbed:html", { entry: "oEmbed", name: "html", type: "string" }],
  ["oEmbed:width", { entry: "oEmbed", name: "width", type: "number" }],
  ["oEmbed:height", { entry: "oEmbed", name: "height", type: "number" }],
]);

const keys = Array.from(schema.keys());

class UnexpectedError extends Error {
  static EXPECTED_HTML = {
    message:
      'Wrong content type header - "text/html" or "application/xhtml+xml" was expected',
    name: "WRONG_CONTENT_TYPE",
  };

  static BAD_OPTIONS = {
    message: "Bad options (see Opts), options must be an Object",
    name: "BAD_OPTIONS",
  };

  static BAD_HTTP_STATUS = {
    message: "Error in http request (http status not OK)",
    name: "BAD_HTTP_STATUS",
  };

  constructor(errorType) {
    super(errorType.message);

    this.name = errorType.name;
    this.stack = new Error().stack;
    this.info = errorType.info;
  }
}

const defaultHeaders = {
  Accept: "text/html, application/xhtml+xml",
  "User-Agent": "facebookexternalhit",
};

function unfurl(url, opts) {
  if (opts === undefined) {
    opts = {};
  }

  if (opts.constructor.name !== "Object") {
    throw new UnexpectedError(UnexpectedError.BAD_OPTIONS);
  }

  typeof opts.oembed === "boolean" || (opts.oembed = true);
  typeof opts.compress === "boolean" || (opts.compress = true);
  typeof opts.headers === "object" || (opts.headers = defaultHeaders);

  Number.isInteger(opts.follow) || (opts.follow = 50);
  Number.isInteger(opts.timeout) || (opts.timeout = 0);
  Number.isInteger(opts.size) || (opts.size = 0);

  return getPage(url, opts)
    .then(getMetadata(url, opts))
    .then(getRemoteMetadata(url))
    .then(parse(url));
}

function unfurlFromHtmlContent({html, url, opts}) {
  if (opts === undefined) {
    opts = {};
  }

  if (opts.constructor.name !== "Object") {
    throw new UnexpectedError(UnexpectedError.BAD_OPTIONS);
  }

  typeof opts.oembed === "boolean" || (opts.oembed = true);
  typeof opts.compress === "boolean" || (opts.compress = true);
  typeof opts.headers === "object" || (opts.headers = defaultHeaders);

  Number.isInteger(opts.follow) || (opts.follow = 50);
  Number.isInteger(opts.timeout) || (opts.timeout = 0);
  Number.isInteger(opts.size) || (opts.size = 0);

  return Promise.resolve(html)
    .then(getMetadata(url, opts))
    .then(getRemoteMetadata(url))
    .then(parse(url));
}

async function getPage(url, opts) {
  // console.log("getPage",url,opts)
  const res = await (opts.fetch
    ? opts.fetch(url)
    : fetch(new URL(url), {
        headers: opts.headers,
        size: opts.size,
        follow: opts.follow,
        timeout: opts.timeout,
      }));
  // console.log("getPage res",res)

  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("Content-Type");
  const contentLength = res.headers.get("Content-Length");

  if (res.status !== 200) {
    throw new UnexpectedError({
      ...UnexpectedError.BAD_HTTP_STATUS,
      info: {
        url,
        httpStatus: res.status,
      },
    });
  }

  if (/text\/html|application\/xhtml+xml/.test(contentType) === false) {
    throw new UnexpectedError({
      ...UnexpectedError.EXPECTED_HTML,
      info: {
        url,
        contentType,
        contentLength,
      },
    });
  }

  // no charset in content type, peek at response body for at most 1024 bytes
  const str = buf.slice(0, 1024).toString();
  let rg;

  if (contentType) {
    rg = /charset=([^;]*)/i.exec(contentType);
  }

  // html 5
  if (!rg && str) {
    rg = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
  }

  // html 4
  if (!rg && str) {
    rg = /<meta.+?content=["'].+;\s?charset=(.+?)["']/i.exec(str);
  }

  // found charset
  if (rg) {
    const supported = [
      "CP932",
      "CP936",
      "CP949",
      "CP950",
      "GB2312",
      "GBK",
      "GB18030",
      "BIG5",
      "SHIFT_JIS",
      "EUC-JP",
    ];
    const charset = rg.pop().toUpperCase();

    if (supported.includes(charset)) {
      return iconv_decode(buf, charset).toString();
    }
  }

  return buf.toString();
}

function getRemoteMetadata(url) {
  return async function ({ oembed, metadata }) {
    if (!oembed) {
      return metadata;
    }

    const target = new URL(he_decode(oembed.href), url);

    let res = await fetch(target.href);
    let contentType = res.headers.get("Content-Type");
    const status = res.status;

    if (status === 403 && target.protocol === "http:") {
      // try again using HTTPS
      target.protocol = "https:";

      res = await fetch(target.href);
      contentType = res.headers.get("Content-Type");
    }

    let ret;

    if (
      oembed.type === "application/json+oembed" &&
      /application\/json/.test(contentType)
    ) {
      ret = await res.json();
    } else if (
      oembed.type === "text/xml+oembed" &&
      /(text|application)\/xml/.test(contentType)
    ) {
      const data = (await res.text())
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<");

      const content = {};

      const parserContext = { text: "" };

      ret = await new Promise((resolve) => {
        const parser = new Parser(
          {
            oncdataend: () => {
              if (
                !content.html &&
                parserContext.text.trim().startsWith("<") &&
                parserContext.text.trim().endsWith(">")
              ) {
                content.html = parserContext.text.trim();
              }
            },
            // eslint-disable-next-line
            onopentag: function (name, attribs) {
              if (parserContext.isHtml) {
                if (!content.html) {
                  content.html = "";
                }

                content.html += `<${name} `;
                content.html += Object.keys(attribs)
                  .reduce(
                    (str, k) =>
                      str +
                      (attribs[k] ? `${k}="${attribs[k]}"` : `${k}`) +
                      " ",
                    ""
                  )
                  .trim();
                content.html += ">";
              }

              if (name === "html") {
                parserContext.isHtml = true;
              }

              parserContext.tagName = name;
            },
            ontext: function (text) {
              parserContext.text += text;
            },
            onclosetag: function (tagname) {
              if (tagname === "oembed") {
                return;
              }

              if (tagname === "html") {
                parserContext.isHtml = false;
                return;
              }

              if (parserContext.isHtml) {
                content.html += parserContext.text.trim();
                content.html += `</${tagname}>`;
              }

              content[tagname] = parserContext.text.trim();

              parserContext.tagName = "";
              parserContext.text = "";
            },
            onend: function () {
              resolve(content);
            },
          },
          {
            recognizeCDATA: true,
          }
        );

        parser.write(data);
        parser.end();
      });
    }

    if (!ret) {
      return metadata;
    }

    const oEmbedMetadata = Object.keys(ret)
      .map((k) => ["oEmbed:" + k, ret[k]])
      .filter(([k]) => keys.includes(String(k)));

    metadata.push(...oEmbedMetadata);
    return metadata;
  };
}

function getMetadata(url, opts) {
  return function (text) {
    const metadata = [];
    const parserContext = { text: "" };

    let oembed;
    let distanceFromRoot = 0;

    return new Promise((resolve) => {
      const parser = new Parser({
        onend: function () {
          if (parserContext.favicon === undefined) {
            metadata.push(["favicon", new URL("/favicon.ico", url).href]);
          } else {
            metadata.push([
              "favicon",
              new URL(parserContext.favicon, url).href,
            ]);
          }

          resolve({ oembed, metadata });
        },

        onopentagname: function (tag) {
          parserContext.tagName = tag;
        },

        ontext: function (text) {
          if (parserContext.tagName === "title") {
            // makes sure we haven't already seen the title
            if (parserContext.title !== null) {
              if (parserContext.title === undefined) {
                parserContext.title = "";
              }

              parserContext.title += text;
            }
          }
        },

        onopentag: function (
          tagname,
          attribs
        ) {
          distanceFromRoot++;

          if (opts.oembed && attribs.href) {
            // handle XML and JSON with a preference towards JSON since its more efficient for us
            if (
              tagname === "link" &&
              (attribs.type === "text/xml+oembed" ||
                attribs.type === "application/json+oembed")
            ) {
              if (!oembed || oembed.type === "text/xml+oembed") {
                // prefer json
                oembed = attribs;
              }
            }
          }
          if (
            tagname === "link" &&
            attribs.href &&
            (attribs.rel === "icon" || attribs.rel === "shortcut icon")
          ) {
            parserContext.favicon = attribs.href;
          }

          let pair;

          if (tagname === "meta") {
            if (attribs.name === "description" && attribs.content) {
              pair = ["description", attribs.content];
            } else if (attribs.name === "author" && attribs.content) {
              pair = ["author", attribs.content];
            } else if (attribs.name === "keywords" && attribs.content) {
              const keywords = attribs.content
                .replace(/^[,\s]{1,}|[,\s]{1,}$/g, "") // gets rid of trailing space or sommas
                .split(/,{1,}\s{0,}/); // splits on 1+ commas followed by 0+ spaces

              pair = ["keywords", keywords];
            } else if (attribs.property && keys.includes(attribs.property)) {
              const content = attribs.content || attribs.value;
              pair = [attribs.property, content];
            } else if (attribs.name && keys.includes(attribs.name)) {
              const content = attribs.content || attribs.value;
              pair = [attribs.name, content];
            }
          }

          if (pair) {
            metadata.push(pair);
          }
        },

        onclosetag: function (tag) {
          distanceFromRoot--;
          parserContext.tagName = "";

          if (distanceFromRoot <= 2 && tag === "title") {
            metadata.push(["title", parserContext.title]);
            parserContext.title = "";
          }

          // We want to parse as little as possible so finish once we see </head>
          // if we have not seen a title tag within the head, we scan the entire
          // document instead
          if (tag === "head" && parserContext.title) {
            parser.reset();
          }
        },
      });

      parser.write(text);
      parser.end();
    });
  };
}

function parse(url) {
  return function (metadata) {
    // eslint-disable-next-line
    const parsed = {};
    const ogVideoTags = [];
    const articleTags = [];

    let lastParent;

    for (const meta of metadata) {
      const metaKey = meta[0];
      let metaValue = meta[1];

      const item = schema.get(metaKey);

      // decoding html entities
      if (typeof metaValue === "string") {
        metaValue = he_decode(he_decode(metaValue.toString()));
      } else if (Array.isArray(metaValue)) {
        metaValue = metaValue.map((val) => he_decode(he_decode(val)));
      }

      if (!item) {
        parsed[metaKey] = metaValue;
        continue;
      }

      // special case for video tags which we want to map to each video object
      if (metaKey === "og:video:tag") {
        ogVideoTags.push(metaValue);
        continue;
      }
      if (metaKey === "article:tag") {
        articleTags.push(metaValue);
        continue;
      }

      if (item.type === "number") {
        metaValue = parseInt(metaValue, 10);
      } else if (item.type === "url" && metaValue) {
        metaValue = new URL(metaValue, url).href;
      }

      if (parsed[item.entry] === undefined) {
        parsed[item.entry] = {};
      }

      let target = parsed[item.entry];

      if (item.parent) {
        if (item.category) {
          if (!target[item.parent]) {
            target[item.parent] = {};
          }

          if (!target[item.parent][item.category]) {
            target[item.parent][item.category] = {};
          }

          target = target[item.parent][item.category];
        } else {
          if (Array.isArray(target[item.parent]) === false) {
            target[item.parent] = [];
          }

          if (!target[item.parent][target[item.parent].length - 1]) {
            target[item.parent].push({});
          } else if (
            (!lastParent || item.parent === lastParent) &&
            target[item.parent][target[item.parent].length - 1] &&
            target[item.parent][target[item.parent].length - 1][item.name]
          ) {
            target[item.parent].push({});
          }

          lastParent = item.parent;
          target = target[item.parent][target[item.parent].length - 1];
        }
      }

      // some fields map to the same name so once nicwe have one stick with it
      target[item.name] || (target[item.name] = metaValue);
    }

    if (ogVideoTags.length && parsed.open_graph.videos) {
      parsed.open_graph.videos = parsed.open_graph.videos.map((obj) => ({
        ...obj,
        tags: ogVideoTags,
      }));
    }
    if (articleTags.length && parsed.open_graph.articles) {
      parsed.open_graph.articles = parsed.open_graph.articles.map((obj) => ({
        ...obj,
        tags: articleTags,
      }));
    }

    return parsed;
  };
}

export { unfurl, unfurlFromHtmlContent };


