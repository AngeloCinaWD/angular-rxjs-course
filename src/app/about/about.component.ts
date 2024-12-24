import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval, noop, Observable, timer } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // per creare un Observable si utilizza il metodo .create() dell'oggetto Observable
    // vogliamo creare un Observable che emetta come valore i courses fetchati dal backend
    // salviamo in una const
    // al metodo create passiamo come parametro una funzione che va a descrivere il comportamento dell'observable
    // per implementare un Observable utilizziamo l'observer e descriviamo nei metodi di questo cosa deve essere fatto in caso di successo quindi emissione del dato (.next()), di errore (.error()) e di completamento (.complete())
    const http$ = Observable.create((observer) => {
      // implemento la chiamata http col metodo fetch() di js che mi ritorna una promise e quindi per fare qualcosa con questa promise ho bisogno del metodo .then()
      fetch("/api/courses")
        // utilizzo il metodo .json dell'oggetto Response che mi restituisce un'altra promise con il body della response, quindi con i dati
        .then((response) => response.json())
        // qui vado ad implentare i metodi dell'observer per descrivere cosa deve fare l'Observable quando sottoscritto
        .then((body) => {
          // emette il body
          observer.next(body);
          // col complete indico che una volta emesso il valore l'Observable non emetta più altri valori
          observer.complete();
        })
        // col .catch intercetto un errore fatale, tipo disconnessione di rete, server error, nella catena delle promise
        .catch((error) => {
          observer.error(error);
        });
    });

    // fetch("/api/courses")
    //   .then((response) => response.json())
    //   .then((body) => console.log(body.payload));

    // per far funzionare l'Observable che ho appena creato mi devo sottoscrivere
    // al posto di una callback da eseguire posso passare la funzione rxjs noop che indica di non fare niente, come ad esempio in caso di errore
    // con l'rxjs operator map indico che mi deve emettere solo la proprietà .payload del body della response
    http$.pipe(map((body) => body["payload"])).subscribe(
      (payload) => console.log(payload),
      noop,
      () => console.log("completed")
    );

    // il vantaggio di utilizzare un observable al posto della promise ottenuta dal fetch è che in questo modo si possono utilizzare tutta una serie di rxjs operators che rendono semplice la gestione dei dati e mi permettono di combinare i dati con una serie di eventi
  }
}
