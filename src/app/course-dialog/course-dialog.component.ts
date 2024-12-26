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

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  standalone: false,
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  // con il decoratore @ViewChild creo una reference ad un elemento html
  // in questo caso al button save
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

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap((changes) => this.saveCourse(changes))
        // mergeMap((changes) => this.saveCourse(changes))
      )
      .subscribe((changes) => {});
  }

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

  ngAfterViewInit() {
    // implementiamo un sistema che ci permetta di creare uno stream di values collegati al click del button save
    // utilizziamo la funzione fromEvent rxjs e indichiamo come riferimento l'elemento dom nativo del button save
    // al click di questo button definiamo un observable
    // per effettuare una chiamata http per salvare i valori del form utilizziamo il pipe ed il concatMap, i valori li prendiamo direttamente dal form
    fromEvent(this.saveButton.nativeElement, "click").pipe(
      // l'utilizzo del concatMap in questo caso può non essere corretto perchè se io continuassi a cliccare il button più volte verrebbe inviata una nuova chiamata http verso il BE
      // ma nel caso del button non serve perchè non ci sarebbero cambiamenti nel form, ma verrebbero inviati sempre gli stessi dati
      // concatMap(() => this.saveCourse(this.form.value))

      // invece del concatMap è più giusto utilizzare l'operator rxjs exhaustMap
      // questo ignora nuovi valori emessi mentre l'ultimo valore emesso non è ancora stato completato
      // in questo modo clicando più volte sul button, se non è stata completata la prima chamata http tutti i click durante il suo completamento verranno ignorati
      // solo il click che verrà effettuato dopo che la chiamata è stata completata verrà preso di nuovo in considerazione
      exhaustMap(() => this.saveCourse(this.form.value))
    );
  }

  close() {
    this.dialogRef.close();
  }

  save() {}
}
