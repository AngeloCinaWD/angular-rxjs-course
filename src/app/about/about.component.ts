import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // un concetto fondamentale alla base di RxJs è quello dello Streams
    // un esempio di streams è l'ascolto di un evento
    // diciamo per esempio che mettiamo l'intero document in ascolto dell'evento click, ogni volta che clicco all'interno della pagina avrò in console un oggetto type click con delle proprietà, viene emesso al click un valore, ogni volta che clicco ne sarà uno diverso con determinate proprietà, questo è un flusso di valori, stream of values
    document.addEventListener("click", (event) => {
      console.log(event);
    });
    // stessa cosa utilizzando un setInterval, ottengo un altro stream of values. Questo è uno stream che emette un valore ogni secondo
    let counter = 0;

    setInterval(() => {
      console.log(counter);
      counter++;
    }, 1000);

    // setTimeout emette uno stream con un solo valore dopo un determinato tempo e si completa
    // è molto simile ad una request http, fa una cosa e si completa con la differenza che non ha un error
    setTimeout(() => {
      console.log("finished");
    }, 3000);

    // quando uno stream è completato vuol dire che non emetterà più nessun value
    // l'addEventListener ed il setInterval non si completano mai, emettono sempre un nuovo valore, setTimeout si completa dopo aver emesso il suo valore
  }
}
