import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Rubik&display=optional" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script async src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
      </body>
    </Html>
  )
}
