require("dotenv").config();
//#region express configures
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cors = require("cors");
const session = require("client-sessions");

//App settings and config
const app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET || "abc", // the encryption key
    duration: 60 * 1000, // expired after 60 sec
    activeDuration: 60 * 1000, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
    cookie: {
      httpOnly: false
    }
  })
);
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

var port = process.env.PORT || "3030";

//check if the server alive
app.get("/alive", (req, res) => {
  res.send("Alive!!");
});

const user = require("./routes/user");
const recipes = require("./routes/recipes");
const auth = require("./routes/auth");
const { cookie } = require("express-validator");

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//Routing
app.get("/", (req, res) => res.send("welcome"));
app.use("/user", user);
app.use("/recipes", recipes);
app.use("/auth", auth);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});
