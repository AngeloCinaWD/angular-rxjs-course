import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import moment from "moment";
import { from, fromEvent } from "rxjs";
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  standalone: false,
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true }) saveButton: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  // QUESTO METODO IMPLEMENTATO MI PERMETTE DI GESTIRE CHIAMATE HTTP ESEGUITE IN SEQUENZA, NON IN PARALLELO
  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        // inseriamo qui il concatMap e gli diciamo di ottenere un observable da ogni changes ricevuto e concatenarlo a quello precedente
        // il subscribe, quindi l'esecuzione di ogni observable, viene fatta dal concatMap per ogni singolo observable
        concatMap((changes) => this.saveCourse(changes))
      )
      .subscribe((changes) => {
        // creo un metodo per ottenere un oservable
        // const saveCourse$ = from(
        //   fetch(`/api/courses/${this.course.id}`, {
        //     method: "PUT",
        //     body: JSON.stringify(changes),
        //     headers: {
        //       "content-type": "application/json",
        //     },
        //   })
        // );
        // dobbiamo fare quindi in modo che le chiamate vengano effettuate una dopo l'altra ma solo quando quella prima è stata completata
        // utilizziamo la concatenazione degli observables per questo tipo di operazioni
        // l'obiettivo è quello di ottenere un nuovo observable ogni volta che arriva un change dei values del form e concatenarli tutti, in modo che un oservable venga eseguito e completato solo quando quello prima è stato eseguito e completato
        // questa dinamica di trasformare un observable in un altro e concateenarlo viene eseguita egregiamente dall'operator rxjs concatMap()
        // concatMap esegue la sua callback su ogni valore emesso da un observable e restituisce un observable nuovo, una volta eseguita la callback fa la stessa cosa sul secondo value ed il nuovo observable derivato lo concatena a quello precedente. Solo quando l'observable precedente ha completato la sua vita viene emesso il secondo observable derivato.
        // quindi questo non va messo qui ma nel concatMap nel pipe
        // const saveCourse$ = this.saveCourse(changes);
        // saveCourse$.subscribe();
      });
  }

  // metodo che restituisce un observable per una chiamata http
  saveCourse(changes) {
    return from(
      fetch(`/api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {}
}
