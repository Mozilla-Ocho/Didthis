const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log(`Received a request.`);
  res.send(
    `Appserver hello world!`
  );
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
