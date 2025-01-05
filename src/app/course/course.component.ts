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
  throttle,
  throttleTime,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval, forkJoin } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { debug, RxJsLoggingLevel } from "../common/debug";

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

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`).pipe(
      debug(RxJsLoggingLevel.INFO, "course value")
    );

    // l'operatore rxjs forkJoin() ci permette di inviare chiamate http in parallelo, allo stesso momento, al BE ed effettuare una qualche logica solo quando tutte sono state completate
    // creo 2 observables, uno per il corso ed uno per le sue lezioni
    const courseForkJoin$ = createHttpObservable(
      `/api/courses/${this.courseId}`
    );

    const lessonsForkJoin$ = this.loadLessons("");

    // l'operatore forkJoin() ritorna un observable con una tupla che contiene tutti e 2 i valori degli observables passati
    forkJoin(courseForkJoin$, lessonsForkJoin$).subscribe(
      ([course, lessons]) => {
        console.log(course);
        console.log(lessons);
      }
    );
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),
      debug(RxJsLoggingLevel.INFO, "map value"),
      startWith(""),
      debug(RxJsLoggingLevel.ERROR, "startwith value"),
      // debouncing emette un valore solo quando questo è considerato stabile all'interno di un certo range di tempo
      // quindi se qualcunoscrive molto velocemente nessun valore sarà emesso
      debounceTime(400),
      // throttling riduce l'emissione di valori secondo un tempo stabilito
      // il valore viene emesso secondo l'emissione di un valore di un observable secondario, ad esempio un flusso stabilito con un interval()
      // il throttle garantisce di avere un valore di output, ma non che il valore sia l'ultimo immesso, infatti se immetto un valore e poi ne immetto altri dentro l'intervallo di tempo e non ne immetto pù dopo, avrò solo il primo valore
      // se pèer esempio scrivessi h e poi ello, avrei solo h come valore di ricerca
      // throttle(() => interval(500)),
      // l'operatore rxjs throttleTime() è come il throttle ma crea un inreval internamente, devo solo indicare il tempo
      // throttleTime(500),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );
  }

  loadLessons(search: string): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(
      // tap(console.log),
      map((response) => response["payload"]),
      debug(RxJsLoggingLevel.INFO, "lessons value")
    );
  }
}
