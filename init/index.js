const mongoose = require("mongoose");
const listing = require("../models/listing");
const initData = require("./data");



const initDb= async ()=> {
  await listing.deleteMany({});
  await listing.insertMany(initData.data);
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
  await mongoose.connect("mongodb://127.0.0.1:27017/website");
}

