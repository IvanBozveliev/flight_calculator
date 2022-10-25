let markers = [];
let data = [];

function initMap() {
  const uluru = { lat: -25.344, lng: 131.031 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
    streetViewControl: false,
  });
  const infowindow = new google.maps.InfoWindow();

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
    // geocode({ location: event.latLng });
  });
}

function addMarker(location, map) {
  let marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  marker.setMap(map);
  markers.push(marker.position);

  if (markers.length === 2) {
    setFlightPath(markers, map);
    document.getElementById("miles").innerText =
      distance(markers) + " nautical miles";
    data.push(markers);
    markers = [];
  }
}

function geocode(location) {
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  geocoder.geocode(location).then((response) => {
    const { results } = response;
    console.log(results);
    console.log(data);
    console.log(results[1].formatted_address);
    console.log(distance(data));
    // if (data.length % 2 == 0) {
    //   distance(data);
    // }
    infowindow.setContent(results[1].formatted_address);
    infowindow.open(map);
  });
}

function distance(data) {
  if (data.length !== 0) {
    let mk1 = data[0];
    let mk2 = data[1];

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

function setFlightPath(markers, map) {
  // var lineSymbol = {
  //   path: "M100,200 C100,100 400,100 400,200",
  //   strokeOpacity: 1,
  //   scale: 4,
  // };

  var lineSymbol = {
    path: "M100 200C100 100 400 100 400 200",
    strokeOpacity: 1,
    scale: 4,
  };

  markers.map(() => {
    let flightPath = new google.maps.Polyline({
      path: markers,
      strokeColor: "#ff0208",
      strokeOpacity: 1.0,
      geodesic: true,
      strokeWeight: 5,
      icons: [
        {
          icon: lineSymbol,
        },
      ],
    });

    flightPath.setMap(map);
  });
}

window.initMap = initMap;
