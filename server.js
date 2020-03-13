const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const app = express();

app.use(express.static(path.resolve(__dirname, "client", "public")));
app.use(helmet());

const server = app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

const io = socketio(server);


