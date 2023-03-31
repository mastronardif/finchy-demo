

import {Request, Response} from 'express';
import {COURSES, NOTIFICATIONS, QUESTIONS} from "./db-data";



export function getNotification00(req: Request, res: Response) {
  console.log("Get%20Notification data ...");
  setTimeout(() => {
    res.status(200).json(NOTIFICATIONS);
  }, 1000);
}

export function getQuestions(req: Request, res: Response) {
  console.log("ZZRRRetrieving questions data ...");
  setTimeout(() => {
    res.status(200).json(QUESTIONS);
  }, 1000);
}

export function getAllCourses(req: Request, res: Response) {

    console.log("Retrieving courses data ...");

    setTimeout(() => {

      res.status(200).json({payload:Object.values(COURSES)});

    }, 1000);



}


export function getCourseByUrl(req: Request, res: Response) {

    const courseUrl = req.params["courseUrl"];

    const courses:any = Object.values(COURSES);

    const course = courses.find((course: { url: string; }) => course.url == courseUrl);

    setTimeout(() => {

      res.status(200).json(course);

    }, 1000);


}
