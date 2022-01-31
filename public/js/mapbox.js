export const displayMap = (locations)=>{
  mapboxgl.accessToken = 'pk.eyJ1IjoibW9oYW1tYWQtYWxpLXNodXZvIiwiYSI6ImNreWpzN2ozZDJwYjAycG84ZTRmaG8wajYifQ.RjHHldyFUCt-SIMnUMqNpw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mohammad-ali-shuvo/ckykbxfizlsun14rue8xn2wii',
    scrollZoom:false
    // center:[-118.113491,34.111745],
    // zoom:10,
    // interactive: false //map e mouse niye scroll kora jabe na fixed thakbe
  });
  const bounds = new mapboxgl.LngLatBounds();
  
  locations.forEach(loc=>{
    //create our custom marker 
    const el = document.createElement('div');
    el.className = 'marker';
    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom' //marker image tar bottom part ta exact gps location e thakbe chaile center o kora jai but looks better on bottom
  
    }).setLngLat(loc.coordinates).addTo(map);
  
    //Add to Popup 
    new mapboxgl.Popup({
  offset:30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map)
    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  })
  map.fitBounds(bounds,{
    padding:{
     top:200,
     bottom:150,
     left:100,
     right:100
    }
   });
}