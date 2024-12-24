import { Component, OnInit } from "@angular/core";
import { concat, of } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // con la funzione rxjs of() creiamo 2 observables che emetteno 3 valori numerici e poi si completano
    const source1$ = of(1, 2, 3);

    const source2$ = of(4, 5, 6);

    // vogliamo fare in modo che questi 2 observables si concatenino, il primo emetta tutti e 3 i suoi valori e poi vengano emessi gli altri 3 del secondo
    // per farlo utilizziamo la funzione rxjs concat(), a questa indichiamo gli observables che deve concatenare e farà la sottoscrizione ad ognuno di essi
    const result$ = concat(source1$, source2$);

    // posso passare la reference al console.log e mi prende come value da loggare il value emesso dall'observable
    // il concat funziona su observable che si completano, se ad esempio source1$ fosse un interval() source2$ non verrebbe mai concatenato
    result$.subscribe(console.log);
  }
}
