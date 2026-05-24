const { connectDb, disconnectDb } = require('./db');
const Beer = require('../models/Beer');

const beers = [
  {
    name: 'Pale Ale',
    description: 'Balanced pale ale with citrus hops, light malt sweetness, and a clean finish.',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Dry Stout',
    description: 'Roasty dark stout with coffee notes, firm bitterness, and a smooth body.',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Wheat Beer',
    description: 'Refreshing wheat beer with soft grain flavor, light fruit aroma, and gentle carbonation.',
    image: 'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?auto=format&fit=crop&w=900&q=80',
  },
];

async function main() {
  const connection = await connectDb();
  console.log(`Connected to database: ${connection.name}`);

  for (const beer of beers) {
    await Beer.updateOne(
      { name: beer.name },
      { $setOnInsert: beer },
      { upsert: true }
    );
  }

  console.log(`Seeded ${beers.length} beers.`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(disconnectDb);
