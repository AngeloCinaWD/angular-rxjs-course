import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
  // utilizzando il metodo create() dell'object Observable creiamo un observable andando a definire l'observer
  // c'è una netta definizione dell'observer, definiamo noi cosa emettere, come completare l'observable e come intervenire in caso di errore
  //ci sono però situazioni dove non è conveniente creare un observable in questo modo
  // in questi casi si utilizzano i Subject rxjs
  // un Subject è allo stesso tempo un observable ed un observer
  return Observable.create((observer) => {
    const controller = new AbortController();

    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
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

    return () => controller.abort();
  });
}
