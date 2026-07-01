// Seed script: populates the database with the default Student Store products
// (and one demo user). Run it with:
//
//   npm run seed
//
// Prices are stored in cents (see the Decisions Log in planning.md).

const bcrypt = require("bcrypt")
const prisma = require("../db")
const { BCRYPT_WORK_FACTOR } = require("../config")

const products = [
  {
    name: "Rice Krispies",
    category: "food",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/RKTsquares.jpg",
    description: "Delicious corn-based rice grains melted together with marshmallows into a square-like shape.",
    price: 99,
  },
  {
    name: "Flamin Hot Cheetos",
    category: "food",
    image_url: "https://static.openfoodfacts.org/images/products/896/400/009/0879/front_en.14.full.jpg",
    description: "No one knows exactly what is in the powder that covers these snacks, but wow is it amazing!",
    price: 150,
  },
  {
    name: "Cinnamon Rolls",
    category: "food",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Johns_Inc_Cinnamon_Rolls.jpg",
    description: "Basically just cake for breakfast, but whos complaining?",
    price: 299,
  },
  {
    name: "Coconut Water",
    category: "food",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/ONE_Pure_Coconut_Water.jpeg/900px-ONE_Pure_Coconut_Water.jpeg",
    description: "Somehow incredibly hydrating, while also not really being water.",
    price: 325,
  },
  {
    name: "Fruit Medley",
    category: "food",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Fruits.png",
    description: "More fruit than you know what to do with!",
    price: 750,
  },
  {
    name: "Bar Code Shirts",
    category: "clothing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Barcode_wikipedia_shirt.svg",
    description: "So you can scan yourself in the checkout aisle.",
    price: 1999,
  },
  {
    name: "Striped Socks",
    category: "clothing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Bulk_tube_socks.png",
    description: "Because the dryer ate most of your socks and it never hurts to have another clean pair.",
    price: 499,
  },
  {
    name: "Knitted Beanie",
    category: "clothing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Blue_knit-cap_beanie_by_RobertLender.jpeg",
    description: "Keeps your head absurdly warm while the rest of your body freezes.",
    price: 1999,
  },
  {
    name: "Pullover Sweater",
    category: "clothing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Jumper_altered_PsCSJPG10.jpg",
    description: "At $14.99, can you really afford NOT to buy this?",
    price: 1499,
  },
  {
    name: "Alpaca Wool Scarf",
    category: "clothing",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Alpaca_wool_scarf.JPG/800px-Alpaca_wool_scarf.JPG",
    description: "Legends say that the Alpaca knitted this scarf from its own fur.",
    price: 3499,
  },
  {
    name: "Matching Rings",
    category: "accessories",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Wedding_rings.jpg/800px-Wedding_rings.jpg",
    description: "Ball out and get one for each finger!",
    price: 20000,
  },
  {
    name: "Apple Watch",
    category: "accessories",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Apple_Watch.jpg/800px-Apple_Watch.jpg",
    description: "Why check your phone all the time when you can check your watch all the time?",
    price: 39999,
  },
  {
    name: "Copper Bracelet",
    category: "accessories",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Copper_bracelet_04.jpg",
    description:
      "Compliment this accessory with a batter and some wire and you have yourself a portable charger right on your wrist!",
    price: 7000,
  },
  {
    name: "Keyboard",
    category: "tech",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Apple-wireless-keyboard.jpg/800px-Apple-wireless-keyboard.jpg",
    description: "A wireless keyboard for your computer! Because who doesn't like walking around while they type up an essay?",
    price: 11000,
  },
  {
    name: "Mouse from 1998",
    category: "tech",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Mouse_Microsoft_PS2.jpg",
    description:
      'Check out this fancy Microsoft mouse that was in use right before the dot com bubble crash of the 2000s! It\'s a collectors\' item that still works great. Brings back that "on the verge of the world collapsing" feeling.',
    price: 1998,
  },
  {
    name: "Smart Glasses",
    category: "tech",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Google_Glass_photo.JPG/330px-Google_Glass_photo.JPG",
    description: "Have the internet mounted to your face, and get the added benefit of looking silly all the time!",
    price: 99999,
  },
]

async function main() {
  console.log("Seeding database...")

  // Start from a clean slate so re-running the seed is idempotent. Order
  // matters because of foreign keys: remove children before parents.
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  await prisma.product.createMany({ data: products })
  console.log(`Inserted ${products.length} products.`)

  // A demo customer so you can place orders from the frontend right away.
  const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR)
  await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "student@codepath.org",
      password: hashedPassword,
      is_admin: false,
    },
  })
  console.log("Inserted demo user: student@codepath.org / password")

  console.log("Seeding complete!")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
