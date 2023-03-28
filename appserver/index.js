const express = require('express');
const app = express();
const escapeHtml = require('escape-html')
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

app.get('/', async (req, res) => {
  console.log(`Received a request.`);
  
  let queryResult
  // if (process.env.FLAG_USE_DB === 'true') {
  //   try {
  //     queryResult =  await prisma.DummyRecord.findMany()
  //   } catch(e) {
  //     queryResult = {"error":e,"message":e.message}
  //   }
  // } else {
  //   queryResult = "db flag is disabled"
  // }
  queryResult = "prisma problems"

  res.send(
    `<html><body>
      <h1>Appserver hello world</h1>
      <p>some env vars:</p>
      <p>NODE_ENV=${escapeHtml(process.env.NODE_ENV || '(none)')}</p>
      <p>IMAGE_TAG=${escapeHtml(process.env.IMAGE_TAG || '(none)')}</p>
      <p>a db query:</p>
      <p>${escapeHtml(JSON.stringify(queryResult))}</p>
     </body></html>
    `
  );
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
