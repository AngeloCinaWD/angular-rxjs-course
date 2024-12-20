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
    // se volessi combinare i 3 streams e ad esempio al click dopo 3 secondi avviare il count potrei annidare una nell'altra le callback
    document.addEventListener("click", (event) => {
      console.log("al click:");

      setTimeout(() => {
        console.log("dopo 3 secondi si avvia il counter");

        let counter = 0;

        setInterval(() => {
          console.log(counter);
          counter++;
        }, 1000);
      }, 3000);
    });

    // invece di fare questo potremmo utilizzare la libreria RxJs (Reactive Extension for JavaScript) che ci permette di lavorare coi flussi di dati
    // ci permette di evitare il callback hell di javascript
  }
}
