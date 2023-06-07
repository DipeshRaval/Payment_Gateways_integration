const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require("express-session");

const path = require("path");

const instance = new Razorpay({
  key_id: "rzp_test_RbqG66e5Y7kKvZ",
  key_secret: "3Z85W9omZDcbVaQ6Kz6kRvaV",
});

app.use(
  session({
    secret: "my-secret-ket-232423234234234234",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const flash = require("connect-flash");
app.use(flash());

dotenv.config({ path: __dirname + "/.env" });
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

// const instance = new Razorpay({
//   key_id: process.env.KEY_ID,
//   key_secret: process.env.KEY_SECRATE,
// });

// for the flash
app.use(function (req, res, next) {
  const data = req.flash();
  res.locals.messages = data;
  next();
});

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/order/:item/:amount", async (req, res) => {
  let orderObj = {};
  const options = {
    amount: +req.params.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  let vc = await instance.orders.create(options, function (err, order) {
    // console.log(order);
    orderObj = order;
  });

  return res.render("payment", {
    amount: req.params.amount,
    order_id: orderObj.id,
    item: req.params.item,
  });
});

app.post("/donePayment", (req, res) => {
  req.flash("success", "Succesfully payment done");
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`server listening at port - ${port}`);
});

console.log("Author : Dipesh Raval");
