import express from 'express'
import morgan from 'morgan'
import next from 'next'
import Cookies from 'Cookies'
import crypto from 'crypto'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const csrfCookieName = '_h3y_csrf' // DRY_86325 crsf cookie name. TODO: put this in a non-typescript shared const file?

app
  .prepare()
  .then(() => {
    const server = express()

    server.use(
      morgan('combined', {
        skip: req => {
          return req.path.match(/^\/_+next/) || req.path.match(/favicon\.ico/)
        },
      })
    )

    // ensure client has a crsf cookie. any client who doesn't have one gets
    // assigned one. just a random uuid. POST requests require the api client to
    // include the value of this cookie as part of the body.
    server.use((req, res, next) => {
      const cookies = new Cookies(req, res)
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
      const cookies = new Cookies(req, res)
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
