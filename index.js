let markers = [];
let pathPositions = [];

function initMap() {
  const uluru = { lat: -25.344, lng: 131.031 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
    streetViewControl: false,
  });

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
    // geocode({ location: event.latLng }, map);
  });
}

function addMarker(location, map) {
  let marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  marker.setMap(map);
  markers.push(marker);
  pathPositions.push(marker.position);

  if (markers.length === 2) {
    if (distance(markers) > 3000) {
      setFlightPath(pathPositions, map);
      document.getElementById("miles").innerHTML =
        distance(markers) + "<p id='textMiles'> nautical miles</p>";
      hours(distance(markers), 1);
    } else {
      markers.map((marker) => marker.setMap(null));
      markers = [];
      document.getElementById("miles").innerHTML =
        "<p id='errorText'>You should select minimum 3000 miles distance</p>";
      document.getElementById("hours").innerHTML =
        "<p id='errorText'>-----</p>";
    }

    markers = [];
    pathPositions = [];
  }
}

function geocode(location, map) {
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  geocoder.geocode(location).then((response) => {
    const { results } = response;
    console.log(results);
    console.log(results[1].formatted_address);

    infowindow.setContent(results[1].formatted_address);
    infowindow.open(map);
  });
}

function setFlightPath(positions, map) {
  let flightPath = new google.maps.Polyline({
    path: positions,
    strokeColor: "#ff0208",
    strokeOpacity: 1.0,
    geodesic: true,
    strokeWeight: 5,
  });
  flightPath.setMap(map);
}

function distance(data) {
  if (data.length !== 0) {
    let mk1 = data[0].position;
    let mk2 = data[1].position;

    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.lat() * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2.lat() * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng() - mk1.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    var d =
      2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
              Math.cos(rlat2) *
              Math.sin(difflon / 2) *
              Math.sin(difflon / 2)
        )
      );
    return d.toFixed(2);
  }
}

function hours(distance, flights) {
  let speed = 480;
  let flyHours = (distance / speed) * flights;
  document.getElementById("hours").innerHTML =
    Math.round(flyHours) + "<p id='textMiles'> hours</p>";
}

window.initMap = initMap;
