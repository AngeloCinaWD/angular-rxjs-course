import { Component, OnInit } from "@angular/core";
import { noop, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // creo una funzione che mi restituisce un'observable passandogli un url da fetchare
    // creo la funzione createHttpObservable() nel file util.ts e la esporto in modo da poterla riutilizzare in qualsiasi part6e dell'app
    // const http$: Observable<any> = Observable.create((observer) => {
    //   fetch("/api/courses")
    //     .then((response) => response.json())
    //     .then((body) => {
    //       observer.next(body);
    //       observer.complete();
    //     })
    //     .catch((error) => {
    //       observer.error(error);
    //     });
    // });
    const http$: Observable<any> = createHttpObservable("/api/courses");

    // l'observable http$ emette un value che è un oggetto contenente una proprietà payload che ha come valore un array di course
    // otteniamo un altro observable che emetta come value solo l'array di course
    // per farlo utilizziamo l'operatore rxjs map() che applica una funzione di callback all'observable originale e ne crea uno che emetterà come valore il valore originale trasformato con la callback di map()
    // per ottenere un observable da un altro utilizziamo la funzione rxjs .pipe() che ci permette di concatenare tutti gli operatori rxjs che vogliamo
    // in questo caso posso anche non utilizzarlo ma Object.values mi restituisce un array con i values delle properties di un oggetto
    const courses$: Observable<Course[]> = http$.pipe(
      map((body) => Object.values(body["payload"]))
    );

    courses$.subscribe(
      (courses) => console.log(courses),
      noop,
      () => console.log("completed")
    );
  }
}
