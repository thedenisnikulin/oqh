import express, { RequestHandler } from 'express';
import Server from './Server';
import AbstractController from './AbstractController';
const sequelize = require('../models/index').sequelize;

const app: express.Application = express();

const controllers: Array<AbstractController> = [
    'some controller'
];

const middlewares: Array<RequestHandler> = [
    require('cors'),
    require('body-parser')
]

const server: Server = new Server(app, sequelize, parseInt(<string>process.env.PORT));

server.loadControllers(controllers);
server.loadMiddlewares(middlewares);
server.initDatabase()
server.run();

