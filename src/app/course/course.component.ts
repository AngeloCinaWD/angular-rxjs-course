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

  // direct reference to input field
  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // questa variabile va spostata da qui, si crea una property courseId, in modo da essere accessibile in tutto il componente e la valorizziamo qui
    this.courseId = this.route.snapshot.params["id"];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

    // l'observable lessons$ ci dà tutte le lezioni relative ad un determinato corso
    // spostiamo il codice della chiamata in una funzione loadLessons
    // this.lessons$ = createHttpObservable(
    //   `/api/lessons?courseId=${courseId}&pageSize=100`
    // ).pipe(
    //   tap(console.log),
    //   map((response) => response["payload"])
    // );
    // per mostrae le lezioni filtrate abbiamo bisogno di concatenare 2 observable: il primo è quello con tutte le lezioni non filtrate restituite dal method loadLessons() ed il secondo quello restituito quando si inserisce un valore nell'input
    // per farlo non inizializziamo il valore di lessons$ qui, ma lo facciamo nell'ngAfterViewInit
    // this.lessons$ = this.loadLessons();
  }

  // per utilizzare lo stream di valori emess dal'input come filtro per le lezioni, dobbiamo effettuare delle chiamate verso il BE aggiungendo un query parameter per il filtraggio
  ngAfterViewInit() {
    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(
    //     map((event) => event.target.value),
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     // per trasformare il valore emesso dall'observable creato col fromEvent in una chiamata al BE utilizziamo un operatore rxjs
    //     // se utilizzassimo ad esempio il concatMap otterremmo una serie di chiamate in sequenza ad ogni valore inserito dall'utente
    //     // quello che però vogliamo noi è che se parte una chiamata, quando viene inserito un nuovo valore, la chiamata che è in corso venga cancellata e venga effettuata quella col nuovo valore, in modo da non effettuare tutte le chiamate una dopo l'altra al BE
    //     // l'operatore rxjs che ci pèermette di fare questo è lo switchMap(), questo ci permette di eseguire una callback su ogni valore emesso da un observable, ma se l'emissione di un nuovo valore avviene mentre la callback non è terminata sul valore precedente allora viene interrotta l'esecuzione e viene iniziata l'esecuzione della callback sul nuovo valore emesso
    //     // questi operatori creano un nuovo observable dal valore che stanno lavorando, quindi si sottoscrivono ad esso, lo switchMap() nel momento in cui finisce l'esecuzione della callback o la interrompe per iniziare su un altro valore, effettua l'unsubscribe dall'observable
    //     // con l'abortcontroller nella funzione createHttpObservable al momento dell'unsubscribe avviene l'annullamento della request http ed è quello che vogliamo fare noi
    //     switchMap((search) => this.loadLessons(search))
    //   )
    //   .subscribe(console.log);

    // this.lessons$ = this.loadLessons();

    // per concatenare 2 observable abbiamo bisogno di crearli e poi concatenarli, quindi togliamo il subscribe al fromEvent() e lo salviamo invece in una variabile
    const searchLessons$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      map((event) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );

    // un altro observable è per tutte le lezioni iniziali, senza filtro
    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  // creiamo una funzione loadLessons che ci dà tutte le lezioni
  // questa riceve come parametro una stringa da utilizzare come filtro di ricerca fra i titoli delle lezioni
  // ha come valore di default empty string
  loadLessons(search: string = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(
      tap(console.log),
      map((response) => response["payload"])
    );
  }
}
