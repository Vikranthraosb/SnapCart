var source = {
    lat: 12.336674442341952,
    long: 76.61873552677781
};

var dest = {
    lat: 12.305785596563537,
    long: 76.65512739648618
};

// var map = L.map('map').setView([source.lat, source.long], );
// L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: "&copy; Web Weavers" }).addTo(map);

// var taxiIcon = L.icon({
//     iconUrl: 'img/del.png',
//     iconSize: [70, 70]
// });

// var marker = L.marker([source.lat, source.long], { icon: taxiIcon }).addTo(map);



// your_script.js (continued)

// L.Routing.control({
//   waypoints: [
//     L.latLng(source.lat, source.long), // Start point
//     L.latLng(dest.lat, dest.long)  // End point
//   ],
//   routeWhileDragging: true
// }).addTo(map);




var map = L.map('map').setView([12.3217, 76.6413], 13); // Adjust the initial map view

mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Leaflet &copy; ' + mapLink + ', contribution', maxZoom: 18 }).addTo(map);

var taxiIcon = L.icon({
iconUrl: 'img/del.png',
iconSize: [70, 70]
});

var marker = L.marker([12.336674442341952, 76.61873552677781], { icon: taxiIcon }).addTo(map);

// Function to set and display routes
// function setAndDisplayRoutes() {
//     L.Routing.control({
//         waypoints: [
//             L.latLng(12.336674442341952, 76.61873552677781),
//             L.latLng(12.305785596563537, 76.65512739648618)
//         ]
//     }).on('routesfound', function (e) {
//         var routes = e.routes;
//         console.log(routes);


//     }).addTo(map);
// }

// // Set and display routes on page load
// setAndDisplayRoutes();


// //Add source marker with popup
//         var sourceMarker = L.marker([source.lat, source.long], { icon: taxiIcon }).addTo(map)
//             .bindPopup('<b>Source Waypoint</b><br>Lat: ' + source.lat + '<br>Long: ' + source.long)
//             .openPopup();

//         // Add destination marker with popup
//         var destMarker = L.marker([dest.lat, dest.long], { icon: taxiIcon }).addTo(map)
//             .bindPopup('<b>Destination Waypoint</b><br>Lat: ' + dest.lat + '<br>Long: ' + dest.long)
//             .openPopup();




function setAndDisplayRoutes() {
L.Routing.control({
    waypoints: [
        L.latLng(source.lat, source.long),
        L.latLng(dest.lat, dest.long)
    ],
    routeWhileDragging: false
    
}).addTo(map);
}

// Set and display fixed routes on page load
setAndDisplayRoutes();

var deliveryBoyCoordinates = { latitude: 0, longitude: 0 };

function getDeliveryBoyCoordinates() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            deliveryBoyCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            updateMap(deliveryBoyCoordinates);
        },
        (error) => {
            console.error("Error getting coordinates:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

function updateMap(coordinates) {
    console.log("Updating map with coordinates:", coordinates);

    marker.setLatLng([coordinates.latitude, coordinates.longitude]);
    map.setView([coordinates.latitude, coordinates.longitude], map.getZoom());

    console.log(`Updated delivery boy's coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
}

getDeliveryBoyCoordinates();
const intervalId = setInterval(getDeliveryBoyCoordinates, 20000);

L.control.fullscreen().addTo(map);
