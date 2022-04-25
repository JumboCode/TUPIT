import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  region: process.env.S3_UPLOAD_REGION,
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  signatureVersion: 'v4',
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

const getUploadUrl = async (name: string, type: string) => {
  const fileParams = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: name,
    Expires: 600,
    ContentType: type,
    ACL: 'public-read',
  };

  return await s3.getSignedUrlPromise('putObject', fileParams);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST method (for now)
  if (req.method != 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    if (req.method == 'POST') {
      let { name, type } = JSON.parse(req.body);
      let url = await getUploadUrl(name, type);
      console.log(url);

      res.status(200).json({ url: url });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};
