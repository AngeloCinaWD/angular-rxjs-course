import { Request, Response } from "express";
import { COURSES } from "./db-data";

export function getAllCourses(req: Request, res: Response) {
  // modifichiamo il codice per avere una response con error o buona
  // Math.random() restituisce un numero decimale uguale o maggiore di 0 e minore di 1
  //   const error = Math.random() >= 0.5;

  //   if (error) {
  //     console.log("ERROR loading courses!");
  //     res.status(500).json({ message: "random error occurred." });
  //   } else {
  setTimeout(() => {
    res.status(200).json({ payload: Object.values(COURSES) });
  }, 200);
}
// }

export function getCourseById(req: Request, res: Response) {
  const courseId = req.params["id"];

  const courses: any = Object.values(COURSES);

  const course = courses.find((course) => course.id == courseId);

  res.status(200).json(course);
}
