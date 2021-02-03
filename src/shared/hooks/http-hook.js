import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // cały hook useHttpClient rerenderuje sie, gdy komponent go używający się rerenderuje. UseRef sprawi, żefragment danych się nie zrerenderuje
  // it stores data acros rerender cycles
  const activeHttpRequests = useRef([]);
  // useRef przechowuje dane w obiekcie, który ma pole current (w tym przypadku, przechowuje tątablicę, która się niezmienia)

  // useCallback, aby ta funckja nigdy się nie utworzyła ponownie, gdy komponent go używający się zrerenderuje
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      // api z przeglądarek:
      const httpAbortCtrl = new AbortController();
      // dodajemy to do active http request
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
          // powyższe łączy AbortController z tym requestem i teraz możemy użyć AbortController aby rozłączyć ten request
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // clean-up function before the next time useEffect runs again
    // lub gdy komponent, która używa tego useEffect (w tym przypadku - komponent, który używa custom hooka) zostaje odmontowany
    return () => {
      // activeHttpRequest.current - tablica AbortControllers
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
      // reequest z którym jest to połączone, zostanie zerwany
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
