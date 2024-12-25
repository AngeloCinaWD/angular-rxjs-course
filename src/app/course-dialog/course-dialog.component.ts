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
  // una proprietà di tipo FormGroup ha a disposizione alcuni metodi e prorietà, tra le quali valueChanges che è un Observable che tiene in memoria tutte le proprietà del form ed i loro valori ed emette un oggetto con questi dati ogni volta che qualcosa cambia
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

  ngOnInit() {
    // implementazione di un sistema di autosave data dele form verso il BE in background, ogni volta che l'utente modifica i dati nel form
    // utile ad esempio se l'utente lascia la pagina senza salvare quello che ha editato
    // il filter operator rxjs controlla che un value emesso rispetti o no una condizione se true lo emette se false non lo emette
    // utilizzando il booleano restituito dal controllo della validtà del form io psso filtrare i dati da mandare al backend ed essere sicuro che i dati vengano inviati e salvati nel BE solo se validi
    // se la compilazione del form è corretta la condizione nel filter è TRUE (this.form.valid è TRUE) e i valori vengono emessi ed arrivano al subscribe, se invece qualcosa non è compilato per bene e this.form.valid è FALSE non viene emesso niente
    this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe((changes) => {
        console.log(changes);
        console.log(this.form.valid);
        // implementazione della chiamata al BE per salvare i dati senza utilizzo degli observables
        // il fetch restituisce una promise che va gestita tramite metodi .then() o .catch() per gli errori
        // gestiamo la promise come se fosse un observable utilizzando la function rxjs from() che crea un observable da una promise, o da un array ed altro
        // salviamo tutto in una const, quindi senza il subscribe a questa non avverrà nulla, ho solo creato il blueprint per il flusso dei valori
        const saveCourse$ = from(
          fetch(`/api/courses/${this.course.id}`, {
            method: "PUT",
            body: JSON.stringify(changes),
            headers: {
              "content-type": "application/json",
            },
          })
        );
        // per effettuare la chiamata http e salvare i dati dovrei fare il subscribe, in questo modo però avrei dei subscribe annidati e questo è qualcosa da evitare con rxjs, è un anti-pattern
        // inoltre in questo modo si ha un altro problema: ogni volta che cambio qualcosa in un campo del form, ad esempio ogni volta che digito un carattere nella descrizione, parte una chiamata verso il BE, ne partono tante tutte insieme e non si sa quale viene completata o in che oridne, questo porterebbe a non avere la certezza che il valore salvato sia l'ultimo valido
        // dobbiamo fare quindi in modo che le chiamate vengano effettuate una dopo l'altra ma solo quando quella prima è stata completata
        saveCourse$.subscribe();
      });
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {}
}
