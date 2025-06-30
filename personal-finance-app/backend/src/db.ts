import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    try {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
        console.log('✅ Conectado a MongoDB');
    } catch (err) {
        console.error('❌ Error conectando a MongoDB:', err);
        process.exit(1);
    }
}
