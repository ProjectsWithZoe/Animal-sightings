//map
let lat;
let lng;
let markers = [];
window.onload = function () {
  if (navigator.geolocation) {
    // Automatically get the user's location when the page loads
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    document.getElementById("location").innerHTML =
      "Geolocation is not supported by this browser.";
  }
};

function showPosition(position) {
  // Get latitude and longitude
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  console.log(lat, lng);

  map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

var currentDate = new Date();

var date = currentDate.toLocaleDateString();
var time = currentDate.toLocaleTimeString();

console.log(date, time);

map.on("click", function (e) {
  // Create a popup with an input form for the description
  var popupContent = `
    <input type="text" id="description" placeholder="Sighting" />
    <button onclick="addDescription('${e.latlng.lat}', '${e.latlng.lng}', this)">Add</button>
    <button onclick="cancelPopup()">Cancel</button>
  `;

  var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map);

  // Function to handle the description submission
  window.addDescription = function (lat, lng, button) {
    var description = document.getElementById("description").value;

    if (description) {
      // Create the marker after description is entered
      var marker = L.marker([lat, lng]).addTo(map);
      console.log(lat, lng);

      // Set the description as the marker's popup content
      marker
        .bindPopup(
          `
        <b>Sighting: </b> ${description}
        <br />
        ${date}, ${time}
        <br/>
        <button onclick="deleteMarker(${lat}, ${lng}, this)">Delete</button>
      `
        )
        .openPopup();

      // Optionally, close the popup after adding description
      map.closePopup();
    } else {
      alert("Please enter a description.");
    }
  };

  // Function to handle canceling the popup (closing without adding a description)
  window.cancelPopup = function () {
    map.closePopup();
  };
});

// Function to delete the marker
window.deleteMarker = function (lat, lng, button) {
  // Get the marker from its latitude and longitude (you can store the markers globally for better management)
  var markerToRemove = map.eachLayer(function (layer) {
    if (
      layer instanceof L.Marker &&
      layer.getLatLng().lat === lat &&
      layer.getLatLng().lng === lng
    ) {
      map.removeLayer(layer);
    }
  });
};
