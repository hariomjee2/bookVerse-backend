"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
// Set a longer timeout for tests
jest.setTimeout(30000);
// Connect to test database before running tests
beforeAll(async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/bookverse-test?authSource=admin';
        console.log('Connecting to:', mongoUri.replace(/:[^:@]+@/, ':****@'));
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: false
        });
        console.log(' Connected to test database');
    }
    catch (err) {
        console.error(' Failed to connect to test database:', err.message);
        console.error('Make sure MongoDB is running with: docker run -d --name bookverse-mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0');
        process.exit(1);
    }
});
// Clean up and disconnect after tests
afterAll(async () => {
    try {
        // Force close any pending connections first
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Drop database
        if (mongoose_1.default.connection.db) {
            await mongoose_1.default.connection.db.dropDatabase();
            console.log('Database cleaned');
        }
        // Disconnect
        await mongoose_1.default.disconnect();
        console.log('Disconnected from test database');
    }
    catch (err) {
        console.error('Error during cleanup:', err.message);
        // Force exit to avoid hanging
        process.exit(0);
    }
});
