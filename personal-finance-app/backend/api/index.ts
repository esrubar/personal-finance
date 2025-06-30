import serverless from 'serverless-http';
import app from '../src/app';
import { connectDB } from '../src/db';

let isConnected = false;

const serverlessHandler = serverless(app);

export default async function handler(req: any, res: any) {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
    return serverlessHandler(req, res);
}
