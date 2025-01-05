import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  finalize,
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

    const courses$: Observable<Course[]> = http$.pipe(
      // tap((body) => console.log(body)),
      map((body) => body["payload"]),
      shareReplay(),
      catchError((err) => {
        console.log(err);
        // return of([
        //   {
        //     id: 0,
        //     description: "RxJs In Practice Course",
        //     iconUrl:
        //       "https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png",
        //     courseListIcon:
        //       "https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png",
        //     longDescription:
        //       "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
        //     category: "BEGINNER",
        //     lessonsCount: 10,
        //   },
        // ]);
        // invece di ritornare un observable alternativo posso ritornare l'operatore rxjs throwError che non emette nessun valore ma triggera il gestore di errori di angular in console, con l'errore di default che angular fornisce
        return throwError(err);
      }),
      // per eseguire una logica di pulizia (clean up logic) si può utilizzare l'operatore rxjs finalize()
      // che questo effettua una callback che viene invocata in 2 casi: o quando l'observable è completato o quando va in errore
      finalize(() => console.log("finalize is executed"))
      // sia il catchError() che il finalize() vengono eseguiti 2 volte perchè si trovano dopo lo shareReplay() e courses$ ha 2 subscription
      // se si vuole lanciare l'errore e finalizzare una sola volta, questi 2 operatori vanno spostati prima dello shareReplay()
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
