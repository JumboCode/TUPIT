export default function handler(req, res) {
  res.status(200).json({ payload: process.env.HELLO });
}
