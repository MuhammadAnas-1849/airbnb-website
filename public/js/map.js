
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: List.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 15 // starting zoom
});



const marker1 = new mapboxgl.Marker({color:"red"})
.setLngLat(List.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h5>${List.location}</h5> <p>Exact Location provided after booking</p>`)
.setMaxWidth("300px")
.addTo(map))
.addTo(map);
