import { Observable } from "rxjs";

// per annullare una chiamata http effettuata tramite fetch() possiamo utilizzare l'object AbortController
export function createHttpObservable(url: string) {
  return Observable.create((observer) => {
    // istanzio un AbortController
    const controller = new AbortController();
    // questo ha una proprietà chiamata signal che emette un valore booleano, se true la chiamata viene interrotta dal browser
    const signal = controller.signal;

    // la proprietà viene passata in un oggetto di configurazione come secondo parametro del metodo fetch (dove gestisco il method, il body, l'headers etc))
    fetch(url, { signal })
      .then((response) => {
        // se c'è una response dobbiamo gestire l'errore qui
        // utilizziamo la property ok
        // se questa è true ritorniamo la response
        if (response.ok) {
          return response.json();
        }
        // altrimenti utilizziamo l'observer.error
        else {
          observer.error(`Request failed with status code: ${response.status}`);
        }
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      // questo catch funziona solo se si ha un fatal error, come assenza di rete o errore di dns, qualcosa che non può essere gestito dal browser
      .catch((error) => {
        observer.error(error);
      });

    // per interrompere la chiamata http dobbiamo chiamare il metodo .abort() del controller che abbiamo creato
    // per farlo ritorniamo una funzione dall'observable che abbiamo creato qui e che ritorniamo dalla funzione createHttpObservable() che stiamo esportando qui
    // questa funzione verrà chiamata quando chiamimo il .unsubscribe() sulla subscription a questa funzione
    // proviamo in about.component.ts
    return () => controller.abort();
  });
}
