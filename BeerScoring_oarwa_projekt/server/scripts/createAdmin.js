const { connectDb, disconnectDb } = require('./db');
const User = require('../models/User');

function getArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length).trim() : '';
}

async function main() {
  const email = getArg('email') || process.env.ADMIN_EMAIL;
  const username = getArg('username') || process.env.ADMIN_USERNAME || 'admin';
  const password = getArg('password') || process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error('Missing admin email. Use --email=you@example.com or ADMIN_EMAIL in .env.');
  }

  const connection = await connectDb();
  console.log(`Connected to database: ${connection.name}`);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.role = 'admin';

    if (password) {
      existingUser.password = password;
    }

    await existingUser.save();
    console.log(`Admin access granted to existing user: ${email}`);
    return;
  }

  if (!password) {
    throw new Error('User does not exist yet. Provide --password=... or ADMIN_PASSWORD to create the first admin.');
  }

  await User.create({
    username,
    email,
    password,
    role: 'admin',
  });

  console.log(`Created first admin user: ${email}`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(disconnectDb);
