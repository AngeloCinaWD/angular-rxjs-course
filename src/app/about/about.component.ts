import { Component, OnInit } from "@angular/core";
import { concat, interval, merge, of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const interval1$ = interval(1000);

    const interval2$ = interval1$.pipe(map((val) => val * 10));

    const result$ = merge(interval1$, interval2$);

    result$.subscribe(console.log);
  }
}
