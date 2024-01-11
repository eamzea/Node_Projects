// routes/auth-routes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/User");
const Room = require("../models/Room");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/rooms",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/private", ensureAuthenticated, (req, res) => {
  res.render("private", { user: req.user });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

router.get("/rooms", ensureAuthenticated, (req, res, next) => {
  Room.find({ owner: req.user._id }, (err, myRooms) => {
    if (err) {
      return next(err);
    }

    res.render("rooms/index", { rooms: myRooms });
  });
});

router.post("/rooms", ensureAuthenticated, (req, res, next) => {
  const newRoom = new Room({
    name: req.body.name,
    desc: req.body.desc,
    owner: req.user._id // <-- we add the user ID
  });

  newRoom.save(err => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/rooms");
    }
  });
});

router.get("/rooms/delete/:id", hasRoom(), (req, res, next) => {
  console.log("del");
  Room.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/rooms"))
    .catch(() => res.redirect("/rooms"));
});

function hasRoom() {
  console.log("room");
  return function(req, res, next) {
    console.log("mid");
    Room.findById(req.params.id).then(room => {
      if (
        req.isAuthenticated() &&
        (room.owner === req.user._id || req.user.role === "ADMIN")
      ) {
        return next();
      } else {
        res.redirect("/login");
      }
    });
  };
}

router.get("/rooms/allrooms", checkRoles("ADMIN"), (req, res, next) => {
  Room.find()
    .then(rooms => res.render("rooms/index", { rooms }))
    .catch(() => res.redirect("/rooms"));
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

router.get("/auth/slack", passport.authenticate("slack"));
router.get(
  "/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/private",
    failureRedirect: "/" // here you would navigate to the classic login page
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/private",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

router.get(
  "/auth/outlook",
  passport.authenticate("windowslive", {
    scope: ["openid", "profile", "offline_access"]
  })
);

router.get(
  "/auth/outlook/callback",
  passport.authenticate("windowslive", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/private");
  }
);

router.get("/auth/amazon", passport.authenticate("amazon"));

router.get(
  "/auth/amazon/callback",
  passport.authenticate("amazon", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/private");
  }
);

module.exports = router;
