const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop the users collection completely (removes data AND indexes)
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCollectionExists = collections.some(col => col.name === 'users');
    
    if (userCollectionExists) {
      await mongoose.connection.collection('users').drop();
      console.log('Dropped users collection');
    } else {
      console.log('Users collection does not exist');
    }

    // Now create the User model to recreate the collection with fresh indexes
    const User = require('./models/userModel');
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ phoneNumber: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
    
    console.log('Created fresh indexes');

    await mongoose.disconnect();
    console.log('Database reset complete - ready for new registrations!');
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
};

resetDatabase();
