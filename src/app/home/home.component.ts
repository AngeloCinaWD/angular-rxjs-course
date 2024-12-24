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
    const http$: Observable<Course[]> = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      // il tap operator rxjs può essere concatenato per produrre side effects tipo un console log o un'assegnazione di valore a qualche proprietà
      tap(() => console.log("call executed")),
      map((body) => body["payload"]),
      // concateno l'operator shareReplay() in modo da evitare multiple chiamate http
      shareReplay()
    );

    // questi 2 observables sono sottoscritti entrambi nel template
    // pur essendo derivati entrambi dallo stesso observable, al momento della sottoscrizione si avranno 2 chimate http verso il backend
    // questo avviene perchè ogni sottoscrizione crea un nuovo stream di values
    // per evitare chiamate http multiple dobbiamo fare in modo che tutte le subscriptions condividano lo stesso stream of value, senza crearne un altro
    // si fa questo utilizzando l'operatore rxjs shareReplay(), sull'observable courses$
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
