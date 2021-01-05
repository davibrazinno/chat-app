const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const User = require("../models/User");

const getUser = (userId) => {
  let id = mongoose.Types.ObjectId(userId);
  return new Promise((resolve, reject) => {
    User.aggregate()
        .match({_id: {$not: {$eq: id}}})
        .project({
          password: 0,
          __v: 0,
          date: 0,
        })
        .exec((err, users) => {
          if (err) {
            reject(err);
          } else {
            resolve(users);
          }
        });
  })
}

const registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(userData);
    // Check validation
    if (!isValid) {
      reject(errors);
    }
    User.findOne({ username: userData.username }).then((user) => {
      if (user) {
        reject({ message: "Username already exists" });
      } else {
        const newUser = new User({
          name: userData.name,
          username: userData.username,
          password: userData.password,
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then((user) => {
                  resolve(user)
                })
                .catch((err) => reject(err));
          });
        });
      }
    });
  })
}

const loginUser = (userData) => {
  return new Promise((resolve, reject) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(userData);
    // Check validation
    if (!isValid) {
      reject(errors);
    }
    const username = userData.username;
    const password = userData.password;
    // Find user by username
    User.findOne({ username }).then((user) => {
      // Check if user exists
      if (!user) {
        reject({ usernamenotfound: "Username not found" });
      }
      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          resolve(user);
        } else {
          reject({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  })
}

module.exports = {
  getUser,
  registerUser,
  loginUser
}
