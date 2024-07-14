const express = require('express'); 
const http = require('http');
const path = require('path');
const cors = require('cors');
const app = express();
const socket = require('socket.io');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const orderRouter = require("./routes/orderRoute");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const server = http.createServer(app);
const socketServer = http.createServer();
const port = process.env.PORT || 3000;
const serverPort = process.env.Port || 3001;
global.io = socket(socketServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

require('./socket').init();

app.set("view engine", "ejs");
dotenv.config({ path: "./config.env" });
app.use(express.static(path.join(__dirname, "static")));

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// mongoose.connect('mongodb://localhost:27017')

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() =>
    // console.log(mongoose.connections),
    console.log("DB connection successful!")
  ) .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

//ROUTES
app.use("/api", orderRouter);
app.use("/api/user", userRouter);

// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));

app.get('/', (req, res) => {
    return res.sendFile("./public/index.html");
})

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

server.listen( port, () => {
    console.log('listening on server*: 3000');
});

socketServer.listen( serverPort, () => {
    console.info(`Socket server started on 3001`);
});

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server !!!`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;