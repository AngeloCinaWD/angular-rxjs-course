import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval, timer } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // // se volessi combinare i 3 streams e ad esempio al click dopo 3 secondi avviare il count potrei annidare una nell'altra le callback
    // document.addEventListener("click", (event) => {
    //   console.log("al click:");

    //   setTimeout(() => {
    //     console.log("dopo 3 secondi si avvia il counter");

    //     let counter = 0;

    //     setInterval(() => {
    //       console.log(counter);
    //       counter++;
    //     }, 1000);
    //   }, 3000);
    // });

    // invece di fare questo potremmo utilizzare la libreria RxJs (Reactive Extension for JavaScript) che ci permette di lavorare coi flussi di dati
    // ci permette di evitare la callback hell di javascript
    // utilizziamo un Observable della libreria creato tramite la funzione rxjs interval()
    // questo non è un observable è una dichiarazione di observable, settiamo il tempo ogni quanto deve emettere un valore, emetterà ad esempio un numero ogni 1000 millisecondi, per avviare lo stream di valori abbiamo bisogno di instanziare l'observable, sottoscrivendosi ad esso
    // salviamo questa dichiarazione di observable in una const, il $ alla fine del nome è una convenzione per indicare che quella variabile è un observable, in questo caso un observable di tipo number
    const interval$ = interval(1000);

    // quello che abbiamo salvato è un blueprint di un observable di tipo number
    // possiamo infatti sottoscriverci ad esso più volte e per ogni sottoscrizione ottenere un flusso diverso di valori

    // interval$.subscribe((value) => console.log("stream 1 => " + value));
    // interval$.subscribe((value) => console.log("stream 2 => " + value));

    // la function timer di rxjs permette di dichiarare un observable che emette un valore numerico partendo con un ritardo
    // il primo parametro è dopo quanto iniziare ad emettere, il secondo ogni quanto emettere
    const timer$ = timer(3000, 1000);

    // timer$.subscribe((value) => console.log("stream 3 => " + value));

    // la funzione rxjs fromEvent ci restituisce un blueprint per un observable che emette un valore in risposta ad un evento, ad esempio al click in un punto dello schermo

    const click$ = fromEvent(document, "click");

    click$.subscribe((event) => console.log(event));

    // un Observable è un blueprint per un flusso di dati
    // possiamo ottenere istanze concrete di questi observables chiamando il metodo subscribe su di esso
    // il primo parametro che passiamo a questo metodo è la callback da eseguire quando va tutto bene e possiamo gestire il value emesso
    // il secondo parametro è la callback da eseguire in caso di errore durante il flusso di dati
    // il terzo parametro è la callback da eseguire quando un observable termina di emettere il flusso di dati, quando è completato
    // l'error o il completamento sono esclusivi l'uno dell'altro
    click$.subscribe(
      (event) => console.log(event),
      (err) => console.log(err),
      () => console.log("completed")
    );

    // per annullare la sottoscrizione ad un observable devo salvare in una variabile la sottoscrizione e poi la posso annullare richiamando il metodo unsuscribe()

    const subscription = interval$.subscribe((number) => console.log(number));

    setTimeout(() => subscription.unsubscribe(), 5000);
  }
}
