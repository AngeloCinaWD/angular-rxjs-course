import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  standalone: false,
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params["id"];

    // definiamo l'observable course$ andando ad effettuare una call http passando l'id del corso
    // il course$ viene sottoscritto direttamente nel template tramite pipe async
    this.course$ = createHttpObservable(`/api/courses/${courseId}`);

    // definiamo l'observable lessons$ che sarà un array di lezioni che fanno parte del corso che mostriamo
    // è una lista iniziale che poi potremo filtrare tramite Search Typeahead
    this.lessons$ = createHttpObservable(
      `/api/lessons?courseId=${courseId}&pageSize=100`
    ).pipe(
      tap(console.log),
      map((response) => response["payload"])
    );
  }

  ngAfterViewInit() {}
}
