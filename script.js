//map
let lat;
let lng;
let markers = [];
let currentDate = new Date();
let date = currentDate.toLocaleDateString();
let time = currentDate.toLocaleTimeString();

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

  addMapClickListener();
}

function addMapClickListener() {
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
  });
}

function addDescription(lat, lng) {
  // Function to handle the description submission
  var description = document.getElementById("description").value;

  if (description) {
    // Create the marker after description is entered
    var marker = L.marker([lat, lng]).addTo(map);
    markers.push(marker);
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
}

// Function to handle canceling the popup (closing without adding a description)
function cancelPopup() {
  map.closePopup();
}

// Function to delete the marker
function deleteMarker(lat, lng) {
  markers.forEach(function (marker, index) {
    if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
      map.removeLayer(marker);
      markers.splice(index, 1);
    }
  });
}
