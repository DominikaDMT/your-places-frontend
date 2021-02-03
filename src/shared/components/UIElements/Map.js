import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = (props) => {
  // useRef - dwa sposoby użycia:
  // - reference, pointer, real DOM node
  // - tworzenie zmiennych, które przeżyją renderowanie i zachowają swoje wartości

  const mapRef = useRef();
  // poniżej div został połączony z tą zmienną

  const { center, zoom } = props;
  // powyżej - zdestrukturyzowanie, aby przekazać to do tablizy zależności w useEffect, zamiast całych propsów, które mogą zmieniać się częściej niż te dwa

  // bez useEffect nie byłoby jeszcze połączenia z divem
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });
    // przekazujemy pointer na element, gdzie chcemy gstawić mapę, nie uzywać document.query

    // marker - przekazujemy obiekt z argumentami, drugi wskauzje na obiekt, który stworzyliśmy

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
