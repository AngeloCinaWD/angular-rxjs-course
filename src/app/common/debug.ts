// custom operator rxjs che permette di loggare secondo un livello di logging predefinito
// è una Higher Order Functions perchè ritorna un'altra funzione
// gli operatori di rxjs funzionano in catena, ricevono un observable source ed emettono un nuovo observable che viene passato all'operatore seguente
// quindi la funzione ritornata dalla funzione debug avrà come parametro un Observable di tipo any

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export const debug =
  (loggingLevel: number, message: string) =>
  (sourceObservable: Observable<any>) =>
    // utilizziamo il tap operator per implementare la logica del logging
    // facciamo il console.log del messaggio che passiamo + il valore dell'observable sorgente
    sourceObservable.pipe(
      tap((val) => {
        console.log(`${message}: ${val}`);
      })
    );
