const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

let indexRouter = require('./router/index.js')
let usersRouter = require('./router/users.js')
let goodsRouter = require('./router/goods.js')

const app = express();

app.engine('html', require('express-art-template'))

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter)
app.use('/goods', goodsRouter)

app.listen(3030, () => {
  console.log("Your application is running at port 3030...");
});
