import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as dotenv from 'dotenv';
import * as firebase from 'firebase';
import * as koaBody from 'koa-body';

import { authRoutes, storeRoutes, unprotectedRoutes } from './routes';

import { config } from './config';
import render from './render';

dotenv.config();
const session = require('koa-session');
const serve = require('koa-static');
const koaValidator = require('koa-async-validator');
const koaSwagger = require('koa2-swagger-ui');
// const koaBunyanLogger = require('koa-bunyan-logger');
const firebaseConfig = {
  apiKey: 'AIzaSyA43_uAjE1wJe5w-AXg_xJNW20h7D0st4E',
  authDomain: 'vendorportal.firebaseapp.com',
  databaseURL: 'https://vendorportal.firebaseio.com',
  projectId: 'vendorportal',
  storageBucket: 'vendorportal.appspot.com',
  messagingSenderId: '222462781467',
  appId: '1:222462781467:web:04903106a4e1164a82b0be',
  measurementId: 'G-R7SXQ40ZMC'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = new Koa();
app.keys = ['abc'];
app.context.firebase = firebase;

app.use(session(app));
app.use(render);
app.use(koaBody());
app.use(koaValidator());
app.use(cors());
// app.use(koaBunyanLogger(logger));
// app.use(koaBunyanLogger.requestLogger());
// app.use(koaBunyanLogger.timeContext());
app.use(authRoutes);
app.use(storeRoutes);
app.use(unprotectedRoutes);
app.use(serve('public'));
app.use(
  koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      url: '/swagger.yml'
    }
  })
);

export const server = app.listen(config.port);

console.log(`Server running on port ${config.port}`);
