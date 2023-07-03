#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");

const categories = [];
const products = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7
const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createAllCategories();
  await createAllProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createAllCategories() {
  console.log("Adding Categories");
  await createCategory("Sports", "Sporting Goods & Equipment");
  await createCategory("Electronics", "Computers, TVs, Phones, etc");
  await createCategory("Toys", "Children's Toys & Games");
}

async function createAllProducts() {
  console.log("Adding Products");
  await Promise.all([
    createProduct(
      "SportPro Basketball",
      "Experience the thrill of the game with the SportPro Basketball. This high-quality basketball is made with durable materials, ensuring excellent grip and bounce. Whether you're playing a friendly match or a competitive game, this basketball is designed to enhance your performance and provide an amazing playing experience.",
      11.99,
      10,
      categories[0],
    ),
    createProduct(
      "EliteStrike Football",
      "Prepare for an exciting match with the EliteStrike Football. Crafted with precision, this top-notch football delivers exceptional durability and superior performance on any field. Its advanced design ensures excellent grip and accurate throws, making it perfect for practice sessions and professional games.",
      14.99,
      8,
      categories[0],
    ),
    createProduct(
      "ProShot Tennis Racket",
      "Elevate your tennis game with the ProShot Tennis Racket. This advanced racket is engineered for power and control, allowing you to dominate the court. With its comfortable grip and excellent maneuverability, you'll experience enhanced precision and agility in every swing.",
      29.99,
      5,
      categories[0],
    ),
    createProduct(
      "TechMaster Laptop",
      "Unleash your productivity and entertainment potential with the TechMaster Laptop. Featuring a sleek design and powerful performance, this laptop is packed with cutting-edge features. The high-resolution display and fast processor ensure smooth multitasking and stunning visuals. With ample storage space and long-lasting battery life, it's the perfect companion for work and play.",
      899.99,
      3,
      categories[1],
    ),
    createProduct(
      "SuperNova Smartphone",
      "Stay connected and organized with the SuperNova Smartphone. Designed with a brilliant display and lightning-fast performance, this smartphone offers a seamless user experience. Capture stunning photos with its advanced camera system and enjoy immersive multimedia with its high-quality audio and visuals. With its sleek design and innovative features, the SuperNova keeps you ahead of the curve.",
      699.99,
      5,
      categories[1],
    ),
    createProduct(
      "RoboBuddy Robot Toy",
      "Ignite your child's imagination with the RoboBuddy Robot Toy. This interactive robot companion is packed with exciting features and educational games. It promotes learning and creativity while providing hours of fun. With its friendly design and intuitive controls, RoboBuddy is the perfect playmate for your little one.",
      39.99,
      10,
      categories[2],
    ),
    createProduct(
      "FunLand Playset",
      "Let your child's imagination run wild with the FunLand Playset. This versatile playset features a combination of slides, swings, and climbing structures, providing endless entertainment. It's made of durable materials and designed with safety in mind. Create unforgettable playtime memories with this fantastic playset.",
      79.99,
      7,
      categories[2],
    ),
    createProduct(
      "LaserBlast Nerf Gun",
      "Gear up for epic battles with the LaserBlast Nerf Gun. This high-performance blaster features rapid-fire action and precision targeting. It comes with adjustable settings for different game modes, ensuring thrilling and competitive play. Get ready to blast away with this exciting Nerf gun!",
      24.99,
      15,
      categories[2],
    ),
  ]);
}

async function createCategory(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added Category: ${name}`);
}

async function createProduct(name, description, price, quantity, category) {
  const productDetail = {
    name: name,
    description: description,
    price: price,
    quantity: quantity,
  };
  if (category != false) productDetail.category = category;

  const product = new Product(productDetail);
  await product.save();
  products.push(product);
  console.log(`Added product: ${name}`);
}
