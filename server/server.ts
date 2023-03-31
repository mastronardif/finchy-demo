

import * as express from 'express';
import {Application} from "express";
import * as cors from 'cors';

//import *  as cors from 'cors';
import { getNotification, switchMe } from "./finchy.route";
import { getAllCourses, getCourseByUrl, getQuestions} from "./get-courses.route";
//import {searchLessons} from "./search-lessons.route";
import {loginUser} from "./auth.route";
import {saveCourse} from "./save-course.route";
import {createCourse} from './create-course.route';
import {deleteCourse} from './delete-course.route';
import { QUESTIONS } from './db-data';

const bodyParser = require('body-parser');

const API_URL= "'http://localhost:4200/'";
//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: API_URL,
  preflightContinue: false,
};

// var corsOptions = {
//   origin: 'http://localhost:4200/',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


const app: Application = express();
// app.use(cors); /* NEW */
//use cors middleware
//app.use(cors(corsOptions));
app.use(cors(options));

app.use(bodyParser.json());

// app.get('/fuck', (req, res) => {
//   res.send('Hello from A!')
// })
// app.post('/api/SDK%20Demo/Get%20Questions', cors(corsOptions), (req, res) => {
//   res.status(200).json(QUESTIONS);
// })

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
//const allowedOrigins = ['http://localhost:4200', 'http://localhost:9000'];

// const options: cors.CorsOptions = {
//   origin: allowedOrigins
// };
//get router
// var router = express.Router();
// //use cors middleware
// router.use(cors(options));
// //use cors middleware
// //router.use(cors(options));

// //add your routes

// //enable pre-flight
// //router.options('*', cors(options));

// router.post('/fuck', (req, res) => {
//   res.send('Birds home page')
// })

// // define the about route
// router.get('/about', (req, res) => {
//   res.send('About birds')
// })

// module.exports = route

// app.route('/api/login').post(loginUser);

app.use((req, res, next) => {
  console.log( '\n\t 11111  ', req.path);
  console.log( '\n\t body   ', req.body);
  console.log( '\n\t params   ', req.params);


  const apiUrl =  "/API/RBCOA/";
  //const apiUrlRegex = /^\/[a-zA-Z0-9_-]*\/API\/RBCOA\//;
  const apiUrlRegex = /^\/[a-zA-Z0-9_-]*\/API\/RBCOA\/(.*)/;
  const apiUrlMatch = req.path.match(apiUrlRegex);
  if (apiUrlMatch) {
   return switchMe(req, res);
  }
  next();
});

// app.route('/api/courses').get(getAllCourses);
app.route('/api/SDK%20Demo/Get%20Questions').post(getQuestions);
//app.route('/finchy/API/RBCOA/SDK%20Demo/Get%20Questions').post(getQuestions);
////app.route('/finchy/API/RBCOA/Get%20Notification').post(getNotification);

// app.route('/api/course').post(createCourse);
// app.route('/api/course/:id').put(saveCourse);
// app.route('/api/course/:id').delete(deleteCourse);
// app.route('/api/courses/:courseUrl').get(getCourseByUrl);
//app.route('/api/lessons').get(searchLessons);

//enable pre-flight
//app.route.options('*', cors(options));


const httpServer:any = app.listen(9000, () => {
    console.log("HTTP REST API Server running at http://localhost:" + httpServer.address().port);
});




