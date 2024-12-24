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
import { fromEvent } from "rxjs";
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
    // il filter operator rxjs controlla che un value emesso rispetti o no una condizione se true lo emette se false non lo emette
    this.form.valueChanges.subscribe(console.log);
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {}
}
