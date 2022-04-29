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
  // Get a signed url to upload this file to
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
  // Allow only POST and DELETE methods
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    if (req.method == 'POST') {
      let { name, type } = JSON.parse(req.body);
      let url = await getUploadUrl(name, type);

      res.status(200).json({ url: url });
    } else if (req.method == 'DELETE') {
      let { key } = JSON.parse(req.body);

      const params: S3.DeleteObjectRequest = {
        Bucket: process.env.S3_UPLOAD_BUCKET,
        Key: key,
      };

      s3.deleteObject(params, (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({ message: err });
        }
      });

      res.status(200).end();
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};
