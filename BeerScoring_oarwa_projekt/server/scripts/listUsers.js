const { connectDb, disconnectDb } = require('./db');
const User = require('../models/User');

async function main() {
  const connection = await connectDb();
  console.log(`Connected to database: ${connection.name}`);

  const users = await User.find()
    .select('username email role createdAt')
    .sort({ email: 1 })
    .lean();

  if (users.length === 0) {
    console.log('No users found.');
    return;
  }

  console.table(users.map((user) => ({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  })));
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(disconnectDb);
