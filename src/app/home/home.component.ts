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
  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    // per gestire gli errori in RxJs creiamo un errore volutamente nella response di questa API
    const http$ = createHttpObservable("/api/courses");

    // const courses$: Observable<Course[]> = http$.pipe(
    //   // tap((body) => console.log(body)),
    //   map((body) => body["payload"]),
    //   shareReplay(),
    //   // per gestire un errore possiamo utilizzare l'operatore rxjs catchError()
    //   // questo operatore ha come primo parametro l'errore ritornato e la sua callback genera un observable alternativo
    //   // è un catch error and replace observable to use for the component
    //   // non triggera come spiegato nella lezione 26, non funziona perchè l'observer.error nella funzione createHttpObservable non triggera
    //   catchError((err) => {
    //     console.log(err);
    //     return of([
    //       {
    //         id: 0,
    //         description: "RxJs In Practice Course",
    //         iconUrl:
    //           "https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png",
    //         courseListIcon:
    //           "https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png",
    //         longDescription:
    //           "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
    //         category: "BEGINNER",
    //         lessonsCount: 10,
    //       },
    //     ]);
    //   })
    // );

    const courses$: Observable<Course[]> = http$.pipe(
      // tap((body) => console.log(body)),
      map((body) => body["payload"]),
      shareReplay(),
      // per gestire un errore possiamo utilizzare l'operatore rxjs catchError()
      // questo operatore ha come primo parametro l'errore ritornato e la sua callback genera un observable alternativo
      // è un catch error and replace observable to use for the component
      // non triggera come spiegato nella lezione 26, non funziona perchè l'observer.error nella funzione createHttpObservable non triggera
      catchError((err) => {
        console.log(err);
        return of([
          {
            id: 0,
            description: "RxJs In Practice Course",
            iconUrl:
              "https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png",
            courseListIcon:
              "https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png",
            longDescription:
              "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
            category: "BEGINNER",
            lessonsCount: 10,
          },
        ]);
      })
    );

    this.beginnersCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }
}
