const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

// SIGNUP-FORM ROUTE & SIGNUP POST ROUTE
router.route("/signup")
.get(userController.signupForm).post(asyncWrap(userController.signup));

// LOGIN-FORM  ROUTE & LOGIN POST ROUTE
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// LOGOUT ROUTE
router.get("/logout", userController.logout);

module.exports = router;
