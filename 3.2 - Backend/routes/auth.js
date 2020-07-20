var express = require("express");
var router = express.Router();
const DButils = require("../modules/DButils");
const bcrypt = require("bcrypt");

// Registeration to the website. Using valiadate library to enforce required rules
router.post("/Register", async (req, res, next) => {
  try {
    const users = await DButils.getUserFromUsers(req.body.username);
    if (users.length != 0) throw { status: 409, message: "Username taken" };

    let userDetails = getUserDetails(req);

    DButils.addNewUser(userDetails);

    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

// Login to the website
router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    let users = await DButils.getUserFromUsers(req.body.username);
    if (users.length == 0)
      throw { status: 404, message: "Username doesn't exist" };

    let user = users[0];

    // check if password is correct
    if (!bcrypt.compareSync(req.body.password, user.hash_password)) {
      throw { status: 401, message: "Authentication failed" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    res.status(200).send({ message: "Successfully authenticated" });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

// Helper function - extract user details out of request
function getUserDetails(req) {
  const { username, firstName, lastName, country, email, image } = req.body;

  let hash_password = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.bcrypt_saltRounds)
  );

  return {
    username: username,
    firstName: firstName,
    lastName: lastName,
    country: country,
    hash_password: hash_password,
    email: email,
    image: image,
  };
}

module.exports = router;
