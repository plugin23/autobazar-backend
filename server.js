import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const app = express()
var expressWs = require('express-ws')(app)

import { router as carsRouter } from './routes/cars.js'
import { router as usersRouter } from './routes/users.js'

const PORT = process.env.PORT || 8080;

app.use(express.json({limit: '15mb'}));
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);

app.listen(PORT)

/*const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message));
});

const server = app.listen(PORT);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head => {
    wsServer.emit('connection', socket, request);
  });
});*/
