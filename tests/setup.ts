import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set a longer timeout for tests
jest.setTimeout(30000);

// Connect to test database before running tests
beforeAll(async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/bookverse-test?authSource=admin';
    console.log('Connecting to:', mongoUri.replace(/:[^:@]+@/, ':****@'));

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: false
    } as Parameters<typeof mongoose.connect>[1]);
    console.log(' Connected to test database');
  } catch (err: any) {
    console.error(' Failed to connect to test database:', err.message);
    console.error(
      'Make sure MongoDB is running with: docker run -d --name bookverse-mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0'
    );
    process.exit(1);
  }
});

// Clean up and disconnect after tests
afterAll(async () => {
  try {
    // Force close any pending connections first
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Drop database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('Database cleaned');
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from test database');
  } catch (err: any) {
    console.error('Error during cleanup:', err.message);
    // Force exit to avoid hanging
    process.exit(0);
  }
});
