const express = require("express");
const route = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");

route.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

route.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const result = await User.register(newUser, password);
      console.log(result);
      req.flash("success", "Welcome To Wanderlust");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/SignUp");
    }
  })
);

route.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let { username } = req.body;
    req.flash("success", "Welcome To Wanderlust", username);
    res.redirect("/listings");
  }
);

route.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next();
    } else {
      req.flash("success", "You are logged out !");
      res.redirect("/listings");
    }
  });
});

module.exports = route;
