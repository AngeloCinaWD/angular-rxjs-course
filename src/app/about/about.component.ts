import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, concat, interval, merge, of, Subject } from "rxjs";
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
    series1$.subscribe((val) => console.log("early subscription: " + val));
    subject.next(1);
    subject.next(2);
    subject.next(3);

    // faccio una sottoscrizione a series1$ dopo che ha emesso i valori, in console non vedo niente
    // vedo solo i valori emessi dopo la subscription
    setTimeout(() => {
      series1$.subscribe((val) => console.log("late subscription: " + val));
      subject.next(4);
    }, 3000);

    // i subject sono molto utili quando altri metodi per creare observables non sono convenienti: from(), fromEvent(), of() etc
    // nel caso si voglia utilizzare un Subject per creare un observable è meglio utilizzare un BehaviorSubject
    // questo tipo di subject permette la gestione di iscrizioni tardive
    // cioè nel caso del Subject se faccio la sottoscrizione prima all'observable e poi inizio ad emettere valori li avrò nella subscription, se effettuo una subscription dopo che il Subject ha emesso i valori non ricevo nulla perchè il Subject non permette di accedere ai valori precedentemente emessi
    // di solito con una sottoscrizione ad un observable si vuole ricevere l'ultimo valore emesso
    // il BehaviorSubject ha come obiettivo quello di fornire ad un subscriber sempre qualcosa, anche se la sottoscrizione avviene dopo che ha emesso il value
    // per questo permette di definire un valore iniziale di default che viene sempre fornito ai subscribers al momento della subscription

    const behaviorSubject = new BehaviorSubject(0);

    const behaviorSubjectObservable$ = behaviorSubject.asObservable();

    behaviorSubjectObservable$.subscribe((val) =>
      console.log("early sub behavior: " + val)
    );

    behaviorSubject.next(1);

    // se la sottoscrizione avviene dopo l'emissione di un valore che è dopo quello di default, verrà passato al subscriber l'ultimo valore emesso
    // se faccio una sottoscrizione tardiva troverò in console il valore 1
    setTimeout(
      () =>
        behaviorSubjectObservable$.subscribe((val) =>
          console.log("late sub behavior: " + val)
        ),
      5000
    );

    // una cosa IMPORTANTE DA RICORDARE è che le sottoscrizioni tardive ricevono il valore di default o funzionano solo se non viene completato prima il BehaviorSubject

    const behavior2 = new BehaviorSubject("valore di default");

    const beha2obs = behavior2.asObservable();

    beha2obs.subscribe(console.log);

    behavior2.next("valore nuovo");

    behavior2.complete();

    beha2obs.subscribe((val) =>
      console.log("questa la vedo solo se commento il .complete(): " + val)
    );
  }
}
