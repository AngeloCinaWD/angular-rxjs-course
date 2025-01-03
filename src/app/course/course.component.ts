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

  // direct reference to input field
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

  ngAfterViewInit() {
    // otteniamo uno stream di value tramite fromEvent() con reference all'input ElementRef
    // ad ogni inserimento nell'input element verrà emesso un valore con il valore digitato
    // fromEvent(this.input.nativeElement, "keyup")
    //   .pipe(map((event) => event["target"].value))
    //   .subscribe(console.log);
    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(map((event) => event.target.value))
    //   .subscribe(console.log);

    // per evitare che vengano effettuate troppe chiamate (o chiamate con valori uguali) verso iol BE si utilizza il debounceTime operator di rxjs
    // a questo operatore viene passato un tempo in millisecondi di delay, in questo tempo viene stabilito se un valore emesso è stabile, cioè se non viene emesso un nuovo valore durante il tempo di delay indicato il valore viene considerato stabile e viene emesso come output dal debounceTime
    // viene messo nell'output l'ultimo value emesso nell'intervallo di tempo indicato
    // indichiamo come valore di delay per stabilre se un value è stabile o no 400 millisecondi
    // l'operatore rxjs distinctUntilChanged() ci permette invece di non emettere valori uguali
    fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map((event) => event.target.value),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(console.log);
  }
}
