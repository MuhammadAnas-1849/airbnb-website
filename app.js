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
const flash = require("connect-flash");
const User = require("./models/user.js");
const LocalPassport = require("passport-local");
const passport = require("passport");


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
  await mongoose.connect("mongodb://127.0.0.1:27017/website");
}

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const sessionOptions = {
  secret: "qwertyuiop",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 + 24 + 60 + 60 + 1000,
    maxAge: 7 + 24 + 60 + 60 + 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("index");
});

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

app.use("/listings", ListingRoute);
app.use("/listings/:id/reviews", ReviewRoute);
app.use("/", UserRoute);

app.all("*", (req, res, next) => {
  next(new expressErr(400, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some err" } = err;
  res.status(status).render("errors/err.ejs", { err });
});
