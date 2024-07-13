// const express = require("express");
// const app = express();
// const path = require("path");
// const session = require("express-session");
// const flash = require("connect-flash");
// const Listing = require("../models/listing");

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

// const sessionOptions = {
//   secret: "qwertyuiop",
//   resave: false,
//   saveUninitialized: true,
// };

// app.use(session(sessionOptions));
// app.use(flash());
// app.use((req, res, next)=>{
//     res.locals.msg=req.flash("success");
//     res.locals.err=req.flash("error");
//     next();
// });

// app.get("/register", (req, res) => {
//   let { name = "michael" } = req.query;
//   req.session.name = name;
//   if(name==="michael"){
//     req.flash("error", "user not register");
//   }else{
//       req.flash("success", "user registerd successfully");
//   }
//   res.send("hello");
// });

// app.get("/hello", (req, res) => {
//   res.render("hello", { name: req.session.name });
// });
