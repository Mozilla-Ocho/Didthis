// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import type { File } from 'formidable'
import fs from 'fs'
import type { Readable } from 'node:stream'

type Data = {
  result: string
}

// Get raw body as string
async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('raw headers:', JSON.stringify(req.rawHeaders))
  // const rawBody = await getRawBody(req);
  // console.log('raw body for this request is:', Buffer.from(rawBody).toString('utf8'));

  // // console.log("req.body:",JSON.stringify(req.body))
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    console.log('fields', fields)
    console.log('files', files)
    await saveFile(files.thefile)
    return res.status(201).json({ result: 'ok' })
  })
  // res.status(200).json({ name: 'upload handler response' })
}

const saveFile = async (file: File | File[]) => {
  // apparently the formidable module can return File or File[] as members of files prop...
  if (Array.isArray(file)) return
  const data = fs.readFileSync(file.filepath)
  const fname = (file.originalFilename || new Date().getTime() + '').replace(
    /[^a-zA-Z0-9\-\_\.]/g,
    ''
  )
  fs.writeFileSync(`./public/${fname}`, data)
  //fs.writeFileSync(`./public/${file.newFilename}`, data);
  await fs.unlinkSync(file.filepath)
  return
}

export const config = {
  api: {
    bodyParser: false,
    // bodyParser: {
    //   sizeLimit: '1gb',
    // },
  },
}
