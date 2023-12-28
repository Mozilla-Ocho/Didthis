import express from 'express'
import morgan from 'morgan'
import next from 'next'
import Cookies from 'cookies'
import crypto from 'crypto'
import proxy from 'express-http-proxy'
import fs from 'fs'

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

const csrfCookieName = '_h3y_csrf' // DRY_86325 crsf cookie name. TODO: put this in a non-typescript shared const file?

const bucketsCookieName = '_bkt' // DRY_19565 bucket cookie name

app
  .prepare()
  .then(() => {
    const server = express()

    if (
      process.env.NEXT_PUBLIC_ENV_NAME === 'prod' ||
      process.env.NEXT_PUBLIC_ENV_NAME === 'nonprod'
    ) {
      server.set('trust proxy', true)
    }

    server.use(
      morgan('combined', {
        skip: req => {
          return req.path.match(/^\/_+next/) || req.path.match(/favicon\.ico/)
        },
      })
    )

    server.use((req, res, next) => {
      if (req.hostname.match(/didthat\.app/)) {
        res.status(404).send('404 Page Not Found')
      } else {
        next()
      }
    })

    const amplitudeProxy = express.Router()
    amplitudeProxy.use(
      '/amplitude', // DRY_61169
      proxy('https://api2.amplitude.com/', {
        proxyReqPathResolver: function () {
          return '/2/httpapi'
        },
        proxyReqBodyDecorator: function (bodyContent) {
          const json =
            bodyContent instanceof Buffer
              ? bodyContent.toString('utf-8')
              : bodyContent
          if (process.env.NODE_ENV === 'development') {
            try {
              const parsed = JSON.parse(json)
              let evtLog = ''
              parsed["events"].map(e => {
                evtLog = evtLog + [
                  e.time,
                  e.user_id || '-',
                  e.event_type,
                  JSON.stringify(e.event_properties || {})
                ].join(' ') + '\n'
              })
              console.log(`amplitude events:\n${evtLog}`)
              fs.appendFile('dev-tracking-events-log', evtLog, () =>{})
            } catch(e) {
              // console.log(e)
            }
          }
          return bodyContent
        },
      })
    )
    server.use(amplitudeProxy)

    // ensure client has a crsf cookie. any client who doesn't have one gets
    // assigned one. just a random uuid. POST requests require the api client to
    // include the value of this cookie as part of the body.
    server.use((req, res, next) => {
      const cookies = new Cookies(req, res, {
        // we have to force the cookie lib to believe the connection is secure.
        // the appserver is non-tls and behind a tls terminating proxy.
        // x-forwarded-proto is https but the library doesn't know to trust that.
        secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
      })
      const csrfCookie = cookies.get(csrfCookieName) || ''
      if (!csrfCookie) {
        const options = {
          // no expires/maxAge, make it a session-lifetime cookie and they'll get a
          // new one next time they visit.
          // also, it's not httpOnly because the api client in the browser needs to
          // be able to read it.
          httpOnly: false,
          sameSite: 'Lax',
          secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
        }
        cookies.set(csrfCookieName, crypto.randomUUID(), options)
      }
      next()
    })

    // ensure csrf query param matches csrf cookie on write requests
    server.use((req, res, next) => {
      const cookies = new Cookies(req, res, {
        secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
      })
      const csrfCookie = cookies.get(csrfCookieName) || ''
      const csrfParam = req.query.csrf
        ? Array.isArray(req.query.csrf)
          ? req.query.csrf[0]
          : req.query.csrf
        : ''
      let requireCsrf =
        req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'
      if (req.path.match(/^\/amplitude/)) {
        // XXX update to actual amplitude proxy path
        requireCsrf = false
      }
      if (req.path.match(/^\/api\/getMe/)) {
        // TODO find a way to configure this in the API page handler?
        requireCsrf = false
      }
      if (req.path.match(/^\/api\/sessionLoginWithAppleId/)) {
        // TODO find a way to configure this in the API page handler?
        requireCsrf = false
      }
      if (requireCsrf && (!csrfParam || csrfParam !== csrfCookie)) {
        // all write requests must have a non-empty csrf body param, and a csrf
        // cookie, and they must match.
        const wrapper = {
          action: 'authentication',
          status: 403,
          success: false,
          errorId: 'ERR_CSRF_TOKEN',
          errorMsg: 'csrf token validation failed',
        }
        res.status(wrapper.status).json(wrapper)
      } else {
        next()
      }
    })

    // ensure client has a bucket cookie. we use this to bucket the user into
    // tests (e.g. landing page copy variants). it's a key/value bag stored in
    // querystring format in the cookie. also because we need it on the first
    // request (homepage), we stash the parsed object into the request so that
    // getServerSideProps can send it to the store.
    server.use((req, res, next) => {
      const cookies = new Cookies(req, res, {
        secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
      })
      const bucketsCookieStr = cookies.get(bucketsCookieName) || ''
      const currentVersion = 1
      const testBucket = {version: currentVersion, value: 0}
      let [version,value] = bucketsCookieStr.split('-')
      version = parseInt(version, 10)
      value = parseInt(value, 10)
      if (Number.isInteger(version) &&
        version > 0 &&
        version <= currentVersion &&
        Number.isInteger(value)) {
        testBucket.version = version
        testBucket.value = value
      } else {
        const intArray = new Uint32Array(1)
        crypto.getRandomValues(intArray)
        testBucket.value = intArray[0]
      }
      if (req.query.bkt) {
        testBucket.version = currentVersion
        testBucket.value = parseInt(req.query.bkt, 10) || 0
      }
      const options = {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        // not httpOnly because the client needs to be able to read it.
        httpOnly: false,
        sameSite: 'Lax',
        secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
      }
      const newContentStr = testBucket.version+'-'+testBucket.value
      if (newContentStr !== bucketsCookieStr) {
        // console.log('set bucket cookie', newContentStr)
        cookies.set(bucketsCookieName, newContentStr, options)
      }
      req._testBucket = testBucket
      next()
    })

    server.all('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(process.env.PORT, () => {
      console.log('> server listening on ' + process.env.PORT)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
