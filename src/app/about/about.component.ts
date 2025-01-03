import { Component, OnInit } from "@angular/core";
import { concat, interval, merge, of } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // const interval1$ = interval(1000);
    // const interval2$ = interval1$.pipe(map((val) => val * 10));
    // const result$ = merge(interval1$, interval2$);
    // result$.subscribe(console.log);

    // definiamo un observable interval e mostriamo un valore ogni secondo
    const interval1$ = interval(1000);

    // non vogliamo più ricevere valori dopo 5 secondi
    // dobbiamo creare una reference alla subscription
    const sub = interval1$.subscribe(console.log);

    // e chiamare il metodo unsubscribe() della reference sub
    setTimeout(() => sub.unsubscribe(), 5000);

    const courses$ = createHttpObservable("/api/courses");

    const subscriptionCourses = courses$.subscribe(console.log);

    // effettuo l'unsubscribe con delay 0, avrò in console una chiamata cancellata
    setTimeout(() => subscriptionCourses.unsubscribe(), 0);
  }
}
