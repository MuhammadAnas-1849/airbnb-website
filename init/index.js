const mongoose = require("mongoose");
const listing = require("../models/listing");
const initData = require("./data");

const initDb = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "668e62770b9fe980426dc892",
  }));
  await listing.insertMany(initData.data);
  console.log("data has  initialised");
  console.log(initData.data);
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
