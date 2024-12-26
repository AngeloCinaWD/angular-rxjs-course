import { Component, OnInit } from "@angular/core";
import { concat, interval, merge, of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  // l'operator merge di rxjs è utile quando si vuole prendere più observables e sottoscriversi ad ognuno di essi
  // è ideale per eseguire operazioni asincrone in parallelo
  // abbiamo ad esempio 2 observable che emettono valori, il merge prende il primo valore emesso e lo mette in un nuovo observable, viene emesso un secondo valore e viene aggiunto al nuovo observable e così via, indipendentemente da quale observable di partenza viene emesso
  // il risultato sarà un nuovo observable contenente tutti i valori emessi dagli observables mergiati, in ordine di emissione
  // questo observable si completerà solo quando tutti gli observables sorgente si sono completati
  ngOnInit() {
    // creiamo ad esempio 2 blueprint per 2 observable
    // il primo è un observable derivato da un interval che emette un valore ogni secondo
    const interval1$ = interval(1000);

    // il secondo è un observable derivato dal primo, che tramite map operator applica una semplice moltiplicazione del valore emesso dal primo per 10
    const interval2$ = interval1$.pipe(map((val) => val * 10));

    // tramite il merge dei 2 observable ne creiamo uno che emetterà prima il valore del primo observable e poi il valore per 10 del secondo observable
    const result$ = merge(interval1$, interval2$);

    // logghiamo in console il result$ sottoscrivendolo
    // il merge è utile per eseguire operazioni in parallelo
    result$.subscribe(console.log);
  }
}
