const express = require("express");
const router = express.Router();
const {generateUserToken, decodeToken} = require('../utilities/jwt-utils');
const {getUsersList, registerUser, loginUser} = require('./users.service');

router.get("/", async (req, res) => {
  try {
    let jwtUser = decodeToken(req)
    const user = await getUsersList(jwtUser.id)
    res.status(200).json(user)
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" })
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body)
    req.io.sockets.emit("users", user.username)
    const token = await generateUserToken(user)
    res.status(200).json({
      success: true,
      token: "Bearer " + token,
      name: user.name,
      username: user.username,
      userId: user._id
    });
  } catch (err) {
    res.status(400).json(err)
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await loginUser(req.body)
    const token = await generateUserToken(user)
    res.status(200).json({
      success: true,
      token: "Bearer " + token,
      name: user.name,
      username: user.username,
      userId: user._id,
    })
  } catch (err) {
    res.status(401).json(err)
  }
});

module.exports = router;
