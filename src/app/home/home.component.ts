import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  // dichiaro 2 properties che conterranno Course in base alla categpria del corso, per mostrali nei tab del template di HomeComponent

  beginnersCourses: Course[];
  advancedCourses: Course[];

  constructor() {}

  ngOnInit() {
    const http$: Observable<any> = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      map((body) => Object.values(body["payload"]))
    );

    courses$.subscribe(
      // per filtrare i corsi in base alla categoria ed assegnarli ad una delle proprietà posso utilizzare il .filter() method di javascript che mi restituisce un array con solo gli elementi che rispettano determinate regole
      (courses) => {
        this.beginnersCourses = courses.filter(
          (course) => course.category === "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          (course) => course.category === "ADVANCED"
        );
      },
      noop,
      () => console.log("completed")
    );
  }
}
