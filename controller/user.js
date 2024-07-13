const User = require("../models/user.js");

// SIGNUP CODE
module.exports.signupForm = (req, res) => {
  res.render("user/signup.ejs");
};

// SIGNUP POST CODE
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome To Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/SignUp");
  }
};

// LOGIN-FORM  CODE
module.exports.loginForm = (req, res) => {
  res.render("user/login.ejs");
};

// LOGIN POST CODE
module.exports.login = (req, res) => {
  let { username } = req.body;
  req.flash("success", "Welcome To Wanderlust", username);
  console.log(res.locals.redirectUrl);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// LOGOUT CODE
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next();
    } else {
      req.flash("success", "You are logged out !");
      res.redirect("/listings");
    }
  });
};
