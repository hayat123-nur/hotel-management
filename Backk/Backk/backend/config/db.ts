import mongoose, { ConnectOptions } from 'mongoose';

/**
 * Connect to MongoDB Atlas database
 * Handles connection errors and retries
 */
const connectDB = async (): Promise<void> => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        } as ConnectOptions);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err: Error) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        mongoose.connection.on('connected', () => {
            console.log('🔗 MongoDB connection established');
        });

    } catch (error) {
        const err = error as Error;
        console.error('❌ MongoDB connection failed:', err.message);
        console.error('Stack trace:', err.stack);

        // Retry connection after delay
        console.log('🔄 Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
