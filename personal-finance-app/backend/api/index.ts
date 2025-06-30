import serverless from 'serverless-http';
import app from '../src/app';
import { connectDB } from '../src/db';

let isConnected = false;
const handler = serverless(app);

export default async function (req: any, res: any) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('❌ Error conectando a MongoDB:', err);
      return res.status(500).json({ error: 'Error conectando a MongoDB' });
    }
  }
  return handler(req, res);
}
