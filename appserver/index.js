const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log(`Received a request.`);
  let response = 'Appserver hello world!'
  res.send(
    `Appserver hello world! current image tag = ${process.env.IMAGE_TAG || 'none'}`
  );
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
