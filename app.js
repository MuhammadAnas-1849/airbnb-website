if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const expressErr = require("./utils/expressErr");
const ListingRoute = require("./routes/listing.js");
const ReviewRoute = require("./routes/review.js");
const UserRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const LocalPassport = require("passport-local");
const passport = require("passport");
const Listing = require("./models/listing.js");
const URL = process.env.MONGO_URL;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(URL);
}

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const store = MongoStore.create({
  mongoUrl: URL,
  crypto: {
    secret: "qwertyuiop",
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("error in mongo session store", err)
})

const sessionOptions = {
  store,
  secret: "qwertyuiop",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/", (req, res) => {
//   res.send("index");
// });
app.use("/listings", ListingRoute);
app.use("/listings/:id/reviews", ReviewRoute);
app.use("/", UserRoute);
app.post("/listings/search", async (req, res) => {
  let searchQuery = req.body.searchQuery.trim();
  let query = await Listing.find({
    select: { $regex: searchQuery, $options: "i" },
  });

  if (searchQuery === "") {
    req.flash("error", "search result doesn't find");
    res.redirect("/listings");
  } else if (query.length == 0) {
    req.flash("error", "search result doesn't find");
    res.redirect("/listings");
  } else {
    console.log(searchQuery);
    let searchResult = await Listing.find({
      select: { $regex: searchQuery, $options: "i" },
    });
    console.log(searchResult);
    res.render("listings/showAll.ejs", { searchResults: searchResult });
  }
});

app.all("*", (req, res, next) => {
  next(new expressErr(400, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some err" } = err;
  res.status(status).render("errors/err.ejs", { err });
});
