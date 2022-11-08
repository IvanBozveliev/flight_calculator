let markers = [];
let pathPositions = [];
let data = [];
let arrData = [];

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    minZoom: 1,
    zoom: 1,
    center: new google.maps.LatLng(0, 0),
    streetViewControl: false,
    mapTypeControl: false,
    mapId: "343434ff23",
  });

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
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
  geocode({ location }, map, marker);
  if (markers.length === 2) {
    if (distance(markers) > 3000) {
      setFlightPath(pathPositions, map);
      document.getElementById("miles").innerHTML =
        `<p>${distance(markers)}</p>` + "<p id='textMiles'> nautical miles</p>";
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

function geocode(location, map, marker) {
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  geocoder.geocode(location).then((response) => {
    const { results } = response;
    if (results[1]) {
      infowindow.setContent(results[1].formatted_address);
      infowindow.open(map, marker);
    }
    results[1]?.formatted_address != undefined
      ? data.push(results[1].formatted_address.split(",")[0])
      : data.push("Unknown");

    if (data.length % 2 == 0) {
      arrData.push(data);
      visualise(arrData);
      data = [];
      arrData = [];
    }
  });
}
function visualise(data) {
  data.map((arr) => {
    let origin = document.createElement("p");
    origin.innerText += `${arr[0]}`;
    let destination = document.createElement("p");
    destination.innerText += `${arr[1]}`;
    let timePerYear = document.createElement("p");
    timePerYear.setAttribute("class", "ptimes");
    timePerYear.innerText += 1;
    let remove = document.createElement("button");
    remove.className = "remove";
    remove.textContent = "Remove";

    document.getElementById("origin").appendChild(origin);
    document.getElementById("destination").appendChild(destination);
    document.getElementById("timePerYear").appendChild(timePerYear);
    document.getElementById("removeBtn").appendChild(remove);
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
  console.log(flights);
  console.log(distance);
  let speed = 480;
  let flyHours = Math.round(distance / speed) * flights;
  document.getElementById("hours").innerHTML =
    flyHours + "<p id='textMiles'> hours</p>";
}
document.getElementById("timePerYear").addEventListener("click", (e) => {
  if (e.target.localName == "p") {
    let flights = (document.getElementsByTagName("p").innerHTML = +e.target
      .innerText++);
    let miles = document.getElementById("miles").childNodes[0].innerText;
    hours(+miles, ++flights);
  }
});

window.initMap = initMap;
