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
const categoryRouter = require("./routes/categoryRoutes");
const kotRouter = require("./routes/kotRoutes");
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

mongoose.connect('mongodb://localhost:27017');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

//ROUTES
app.use("/api", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/kot", kotRouter);

app.use(express.static(path.resolve("./public")));

app.get('/', (req, res) => {
    return res.sendFile("./public/index.html");
})

server.listen( port, () => {
    console.log('listening on server*: 3000');
});

socketServer.listen( serverPort, () => {
    console.info(`Socket server started on 3001`);
});

app.use(globalErrorHandler);

module.exports = app;