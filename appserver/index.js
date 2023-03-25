const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log(`Received a request.`);
  let response = 'Appserver hello world!'
  res.send(
    `Appserver hello world! IMAGE_TAG=${process.env.IMAGE_TAG || ''}, NODE_ENV=${process.env.NODE_ENV || ''}`
  );
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
