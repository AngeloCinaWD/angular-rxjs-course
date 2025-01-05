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
    // un'altra strategia per gestire gli errori è quella di riprovare la chiamata se la prima fallisce
    const http$ = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      // tap((body) => console.log(body)),
      map((body) => body["payload"]),
      shareReplay(),
      // per ritentare la chiamata dopo un tot di tempo si utilizza l'operatore rxjs retryWhen()
      // questo operatore fa la sottoscrizione all'observable fino a che questo emette un error observable
      // l'error observable è il primo parametro che accetta la callback di retryWhen()
      // se lo riemettiamo immediatamente verrà fatta la nuova sottoscrizione all'observable
      // retryWhen((error) => error)
      // per fare in modo che la chiamata, in caso di errore, venga riprovata ad esempio dopo 2 secondi, bisogna fare in modo che l'observable emesso dal retryWhen() sia ritardato
      // si utilizzano gli operatori rxjs delayWhen() e timer(), il primo fa in modo che l'observable al quale viene applicato sia emesso solo quando un observable della sua callback viene emesso, timer emette un observable dopo un certo tempo
      retryWhen((error) => error.pipe(delayWhen(() => timer(2000))))
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
