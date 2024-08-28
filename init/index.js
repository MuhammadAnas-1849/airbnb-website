const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://muhammadanaswanderlust_49:F40LUAZs7ywGK1Vk@wanderlustcluster.avjst.mongodb.net/?retryWrites=true&w=majority&appName=WanderLustCluster";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

  async function main() {
    await mongoose.connect(MONGO_URL);
  }

  const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "66cead7b5640ce3e9c17aa5e",
      geometry: {
        type: 'Point', // or whatever type is required
        // Other geometry fields...
      },
      select: true, // or whatever value is required
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  };
  initDB();
  
// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: "66cead7b5640ce3e9c17aa5e",
//   }));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
