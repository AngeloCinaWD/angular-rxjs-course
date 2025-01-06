import { Component, OnInit } from "@angular/core";
import { concat, interval, merge, of, Subject } from "rxjs";
import { map } from "rxjs/operators";
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
    // creiamo un Subject rxjs
    const subject = new Subject();

    // se guardiamo le API del subject appena creato troviamo gli stessi metodi che avevamo per il parametro observer dell'Observable.create(), abbiamo infatti il .error(), .next(), il .complete()
    // subject.complete();
    // subject.error();
    // subject.next();
    // ed anche i metodi di un observable, ad esempio il .pipe()
    // subject.pipe();

    // è buona prassi non rendere accessibile dall'esterno il subject, ma lavorarlo dall'interno e non dare la possibilità di modificare il suo comportamento dall'esterno
    // è possibile derivare un observable da un subject, legandolo ad esso, quindi intervenendo sul subject andrò ad avere ad esempio un nuovo valore emesso dall'observable che sarà invece public
    const series1$ = subject.asObservable();

    // questo significa che se tramite .next() dico al subject di emettere un valore, questo valore sarà emesso anche dall'observable
    // il subscribe con log lo metto subito, prima dei next del subject, avrò solo 3 log in console perchè ad un Subject non è possibile attribuire un valore iniziale
    series1$.subscribe(console.log);
    subject.next(1);
    subject.next(2);
    subject.next(3);
  }
}
