import express from 'express'
import morgan from 'morgan'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    server.use(
      morgan('combined', {
        skip: req => {
          return req.path.match(/^\/_next/) || req.path.match(/favicon\.ico/)
        },
      })
    )

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
