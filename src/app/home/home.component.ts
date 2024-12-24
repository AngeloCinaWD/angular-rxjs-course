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

  //   beginnersCourses: Course[];
  //   advancedCourses: Course[];

  // questo modo di ricavare i dati e passrli alle properties è definibile Imperative Design che non consente una buona scalabilità del codice da scrivere se l'app diventa più complessa, si potrebbero avere situazioni di subscribe innestati e non facilmente gestibili
  // si utilizza quindi un Reactive Design, le proprietà che dichiariamo sono degli observables che vengono passati direttamente al template, cioè noi definiamo uno stream di values ma non lo sottoscriviamo qui nel model ma direttamente nel template tramite pipe di angular async

  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$: Observable<any> = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      map((body) => Object.values(body["payload"]))
    );

    // courses$.subscribe(
    //   // per filtrare i corsi in base alla categoria ed assegnarli ad una delle proprietà posso utilizzare il .filter() method di javascript che mi restituisce un array con solo gli elementi che rispettano determinate regole
    //   (courses) => {
    //     this.beginnersCourses = courses.filter(
    //       (course) => course.category === "BEGINNER"
    //     );
    //     this.advancedCourses = courses.filter(
    //       (course) => course.category === "ADVANCED"
    //     );
    //   },
    //   noop,
    //   () => console.log("completed")
    // );

    // definisco gli observables tramite map operator rxjs direttamente da courses$ che restituiva un array di course e su questo applico il .filter() method
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
