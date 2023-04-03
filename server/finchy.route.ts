

import {Request, Response} from 'express';
import {COURSES, FINCHYAPIS, NOTIFICATIONS, QUESTIONS} from "./db-data";
import axios from 'axios';

export function switchMe(req: Request, res: Response) {
  console.log('\t switchMe');
  console.log(req.path);
  console.log( '\n\t .BODY....   ', req.body);
  console.log(req.params);

  // set SQL api id.

  const apiUrlRegex = /^\/[a-zA-Z0-9_-]*\/API\/RBCOA\/(.*)/;
  const apiUrlMatch = req.path.match(apiUrlRegex);
  if (apiUrlMatch) {
    console.log('\n\t **** ', apiUrlMatch[1]);
  }
  let path = apiUrlMatch?.[1] || '';
  // remove noise.
  //path = decodeURIComponent(path).replace(/\s/g, "");
  path = decodeURIComponent(path)
  Syntax: switch (
    path // TO DO: make this a lookup functioin.
  ) {
    case 'Get Notification': {
      return getNotification(req, res);
      break;
    }
    case 'CallFinchy': {
      return CallFinchy(req, res);
      break;
    }
    default: {
      req.body = {
        id: path, //'GetUserByToken',
        params: req.body.params,
       // params: ['f4005093cc1ffc3e5d13fd213b7b1819a1f36e0f'],
      };

      return CallFinchy(req, res);
      //return res.status(200).json({ NOTIFICATIONS: 'fuck you' });
      break;
    }
  }
}

export function getNotification(req: Request, res: Response) {
  console.log("Get%20Notification data ...");
  setTimeout(() => {
    res.status(200).json(NOTIFICATIONS);
  }, 1000);
}

const finchyApis = FINCHYAPIS;
async function CallFinchy(req: any, res: { status: any; json: (arg0: any) => void; }) {
  const params = req.body;
  console.log('req.body= ', req.body);
  console.log('req.metho= ', req.method);
 // const url = 'http://localhost:3000/finchy/help';
 const url = "http://localhost:3000/finchy/executequery";
  //const url = "http://localhost:3000/finchy/executeCQL";
  //const url = "http://localhost:3000/finchy/savedqueries";

  //const data = { name: 'John Doe', email: 'john.doe@example.com' };

  try {
    const data = req.body;
    const fn = ( req.body == 'GET') ? axios.get : axios.post;
    //const response = await axios.get(url, data);
    const response = await fn(url, data);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}


async function getTestBed00(
  req: any,
  res: {
    status: any;
    json: (arg0: any) => void;
  }
) {
  try {
    const response = await axios.post('http://localhost:3000/finchy/help');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

export async function GetGroupsCurrentUserBelongsTo(
  req: any,
  res: {
    status: any;
    json: (arg0: any) => void;
  }
) {
  try {
    const response = await axios.post('http://localhost:3000/finchy/help');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}



