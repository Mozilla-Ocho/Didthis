import { html, TemplateContent } from '../utils/html'

export type Props = {
  title?: string
}

export default function (
  { title = 'Didthis Export' }: Props,
  content: TemplateContent
) {
  return html`<!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="./assets/index.css" />
        <script src="./assets/index.js"></script>
      </head>
      <body>
        <article class="main">
          <header>
            <nav>
              <a href="./index.html"><img src="./assets/images/didthis_wordmark_light.svg" alt="Didthis" /></a>
            </nav>
          </header>
          ${content}
        </article>
      </body>
    </html> `
}
