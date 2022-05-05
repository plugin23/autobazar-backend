import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import {router as carsRouter} from './routes/cars.js'
import {router as usersRouter} from './routes/users.js'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const app = express()

const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message, isBinary) {
      console.log(message.toString(), isBinary);
      wss.client(function client() {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });
  });

app.use(express.json({limit: '15mb'}));
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);

app.listen(PORT)
