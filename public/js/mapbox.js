export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZXJpY25kdW5ndXRzZSIsImEiOiJja3JrZmo2eDMwMm8wMm9ub2liaHB6cjZhIn0.xWa4JtW97rNz7Qy55uMI-Q';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ericndungutse/ckrkulnuy9mw018phz8dsbpmj',
    //   center: [-118.113491, 34.111745],
    //   zoom: 8,
    scrollZoom: false,
  });

  // Area that will be displayed on the map
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create a Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add Popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
