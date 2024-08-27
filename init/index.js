if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const listing = require("../models/listing");
// const initData = require("./data");

// const initDb = async () => {
//   // await listing.deleteMany({});
//   // initData.data = initData.data.map((obj) => ({
//   //   ...obj,
//   //   owner: "668e62770b9fe980426dc892",
//   // }));
//   await listing.insertMany(initData.data);
//   console.log("data has  initialised");
//   console.log(initData.data);
// };
// initDb();

const data = 
[
  {
    title: "Cozy Beach House",
    select: "house",
    description: "A beautiful beach house with 3 bedrooms and 2 bathrooms",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 200,
    location: "Beach Street",
    country: "USA",
  
    geometry: {
      type: "Point",
      coordinates: [-122.084051, 37.385348]
    }
  },

]

const initDb = async () => {
  await listing.insertMany(data);
  console.log("data has  initialised");
  console.log(data);
};
initDb();


main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
