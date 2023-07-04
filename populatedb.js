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
  await createCategory("Home Decor", "Decorative Items for Your Home");
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
    createProduct(
      "ProFit Soccer Ball",
      "Take your soccer skills to the next level with the ProFit Soccer Ball. This high-quality ball is designed for optimal performance and durability. Its superior construction ensures excellent control and precision during gameplay. Whether you're practicing or competing, the ProFit Soccer Ball is your go-to choice.",
      16.99,
      12,
      categories[0],
    ),
    createProduct(
      "TechWiz Gaming Mouse",
      "Enhance your gaming experience with the TechWiz Gaming Mouse. Engineered for precision and comfort, this mouse offers exceptional control and responsiveness. Its ergonomic design and customizable features make it a perfect fit for gamers of all levels. Get ready to level up your gaming skills with the TechWiz Gaming Mouse.",
      49.99,
      6,
      categories[1],
    ),
    createProduct(
      "AdventureExplorer Outdoor Set",
      "Encourage outdoor exploration with the AdventureExplorer Outdoor Set. This comprehensive set includes essential gear for outdoor adventures, such as a compass, flashlight, and binoculars. It's designed to spark curiosity and provide hands-on learning experiences in nature. Equip your young explorer with the AdventureExplorer Outdoor Set.",
      34.99,
      9,
      categories[2],
    ),
    createProduct(
      "FitPro Dumbbell Set",
      "Build strength and tone your muscles with the FitPro Dumbbell Set. This set includes a range of dumbbell weights that allow you to customize your workout. The durable construction and comfortable grip ensure a safe and effective exercise routine. Take your fitness journey to the next level with the FitPro Dumbbell Set.",
      49.99,
      8,
      categories[0],
    ),
    createProduct(
      "SmartGear Smartwatch",
      "Stay connected and track your fitness goals with the SmartGear Smartwatch. This sleek and stylish smartwatch offers a range of features, including heart rate monitoring, step tracking, and smartphone notifications. With its intuitive interface and long-lasting battery life, it's the perfect companion for your active lifestyle.",
      129.99,
      4,
      categories[1],
    ),
    createProduct(
      "CreativeBuilder Building Blocks",
      "Unleash your creativity with the CreativeBuilder Building Blocks set. This set includes a variety of colorful blocks that can be assembled into endless shapes and structures. It promotes fine motor skills, spatial awareness, and imaginative play. Let your imagination soar with the CreativeBuilder Building Blocks.",
      19.99,
      15,
      categories[2],
    ),
    createProduct(
      "CozyHome Throw Blanket",
      "Wrap yourself in warmth and comfort with the CozyHome Throw Blanket. This soft and luxurious blanket is perfect for cozying up on chilly evenings. With its stylish design and high-quality materials, it adds a touch of elegance to any home decor.",
      39.99,
      10,
      categories[3],
    ),
    createProduct(
      "AromaSense Essential Oil Diffuser",
      "Create a soothing atmosphere with the AromaSense Essential Oil Diffuser. This diffuser uses ultrasonic technology to disperse a fine mist of essential oils, filling your space with delightful aromas. It features adjustable settings and LED lighting for a personalized and relaxing experience.",
      29.99,
      8,
      categories[3],
    ),
    createProduct(
      "ZenGarden Meditation Kit",
      "Find peace and serenity with the ZenGarden Meditation Kit. This kit includes a miniature zen garden, a set of meditation stones, and a wooden rake. It provides a calming and meditative experience, helping you achieve a state of tranquility and mindfulness.",
      24.99,
      5,
      categories[3],
    ),
    createProduct(
      "ElegantCandles Scented Candle Set",
      "Set the mood and create a cozy ambiance with the ElegantCandles Scented Candle Set. This set includes a collection of beautifully scented candles in various sizes and fragrances. It's the perfect addition to any home decor, enhancing relaxation and creating a warm and inviting atmosphere.",
      19.99,
      12,
      categories[3],
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
