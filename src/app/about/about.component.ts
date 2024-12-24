import { Component, OnInit } from "@angular/core";
import { noop, Observable } from "rxjs";
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
    const http$ = Observable.create((observer) => {
      fetch("/api/courses")
        .then((response) => response.json())
        .then((body) => {
          observer.next(body);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });

    http$.pipe(map((body) => body["payload"])).subscribe(
      (payload) => console.log(payload),
      noop,
      () => console.log("completed")
    );
  }
}
