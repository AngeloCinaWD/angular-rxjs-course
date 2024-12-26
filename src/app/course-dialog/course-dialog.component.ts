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
        // per eseguire operazioni asincrone in modo sequenziale abbiamo utilizzato il concatMap, esegue la prima chiamata http ed attende che questa sia completata prima di far partire la seconda
        // concatMap((changes) => this.saveCourse(changes))

        // per eseguire invece chiamate in parallelo utilizziamo il mergeMap operator rxjs
        // in questo modo una chiamata http parte senza aspettare che quella prima sia stata completata, non aspetta che un observable si completi per sottoscriversi al secondo observable
        // l'utilizzo del concatMap è quindi molto importante quando si vogliono eseguire delle operazioni asincrone in modo sequenziale e che quindi venga rispettato un ordine di esecuzione
        mergeMap((changes) => this.saveCourse(changes))
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

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {}
}
