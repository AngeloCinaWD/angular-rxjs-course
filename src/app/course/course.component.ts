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
  courseId: string;

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    // const searchLessons$ = fromEvent<any>(
    //   this.input.nativeElement,
    //   "keyup"
    // ).pipe(
    //   map((event) => event.target.value),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap((search) => this.loadLessons(search))
    // );

    // const initialLessons$ = this.loadLessons();

    // this.lessons$ = concat(initialLessons$, searchLessons$);

    // tramite il concat() concateniamo 2 observables, le lezioni del coro sono all'inizio tutte e poi sono quelle secondo il filtro di ricerca
    // possiamo utilizzare l'operatore rxjs startWith() per eliminare la logica dei 2 observables
    // questo operatore ha come obiettivo quello di fornire un valore iniziale ad un observable
    // nella logica scritta prima l'observable searchLessons$ è un array di lezioni filtrate secondo un valore immesso nell'input, tramite startWith indichiamo che il primo valore che va utilizzato per la ricerca sia stringa vuota
    // in questo modo avremo tutte le lezioni all'inizio senza filtraggio
    // anche se non viene inserito niente verrà effettuata la chiamata http con valore di filtraggio ''
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );
  }

  // loadLessons(search: string = ""): Observable<Lesson[]> {
  //   return createHttpObservable(
  //     `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
  //   ).pipe(
  //     // tap(console.log),
  //     map((response) => response["payload"])
  //   );
  // }
  loadLessons(search: string): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(
      // tap(console.log),
      map((response) => response["payload"])
    );
  }
}
