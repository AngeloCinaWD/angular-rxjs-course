// custom operator rxjs che permette di loggare secondo un livello di logging predefinito
// è una Higher Order Functions perchè ritorna un'altra funzione
// gli operatori di rxjs funzionano in catena, ricevono un observable source ed emettono un nuovo observable che viene passato all'operatore seguente
// il pipe() si occupa di passare l'observable da un operatore all'altro
// quindi la funzione ritornata dalla funzione debug avrà come parametro un Observable di tipo any

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

// implementiamo un enum per la logiga del loggingLevel
// sono 4 numeri: uno per TRACE, uno per DEBUG, uno INFO ed uno per ERROR
export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

export const debug =
  (loggingLevel: number, message: string) =>
  (sourceObservable: Observable<any>) =>
    // utilizziamo il tap operator per implementare la logica del logging
    // facciamo il console.log del messaggio che passiamo + il valore dell'observable sorgente
    sourceObservable.pipe(
      tap((val) => {
        // compariamo il livello passato all'operatore con il logging level che voglio vedere
        // cioè io posso utilizzare in più parti l'operatore debug e in ognuno passare un logging level
        // vedrò solo quelli che hanno come valore di logging uguale o maggiore a quello settato nella proprietà rxjsLoggingLevel
        // posso chiamare la funzione setRxJsLoggingLevel e decidere quali debug vedere in console
        // con la condizione dell'if in questo modo se setto come logging level TRACE li vedrò tutti
        if (loggingLevel >= rxjsLoggingLevel) {
          console.log(`${message}: `, val);
        }
      })
    );
