import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { config } from '../config/env.js';

async function cleanDuplicates() {
  console.log('🧹 Starting duplicate task cleanup...');
  await mongoose.connect(config.mongoUri);

  const tasks = await Task.find({}).sort({ updatedAt: -1, createdAt: -1 });
  const seen = new Set();
  const idsToDelete = [];

  tasks.forEach((t) => {
    const key = `${t.userId.toString()}_${t.dayNumber}_${t.title}_${t.description}`;
    if (seen.has(key)) {
      idsToDelete.push(t._id);
    } else {
      seen.add(key);
    }
  });

  console.log(`Found ${idsToDelete.length} duplicate task documents.`);
  if (idsToDelete.length > 0) {
    const result = await Task.deleteMany({ _id: { $in: idsToDelete } });
    console.log(`✅ Successfully deleted ${result.deletedCount} duplicate task documents.`);
  } else {
    console.log('✨ Database is clean. No duplicates found.');
  }

  await mongoose.disconnect();
}

cleanDuplicates().catch((err) => {
  console.error('❌ Error during cleanup:', err);
  process.exit(1);
});
