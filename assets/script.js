// Upon page load, get the users location
// if location services is enabled, it will show a map of their area
// if location services are not enabled, it will show a generic map with a box that will allow them to 1 of 12 states
// Next, the user will input their zip code
// CHECK: does google take zip code as a parameter or do we need to convert zip to lat/lon
// We'll store the users location as lat/lon in a global variable
// We'll take the users lat/lon and input it into the COVID api/url
// The COVID api will return testing locations around that lat/lon

// important for being able to use foundation js functions
$(document).foundation();

//test COVID api
let covidApiKey = "K39YR7g51qETSXocQ0uyEDBxgxXWFZSILwgtqcrNaP8";
let covidAppId = "ikc0ro0Fv33Mt3V90p6Y";

let userLat;
let userLon;
let covidResponseData = {}; //initialize empty object that we will fill up with covid response data.
let testLocations = [];
let markers = []; //set markers to be an empty array to fill with all the marker info

// get current location
function mapMaker() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    styles: mapStyleColors,
  });
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();

  // Add Get Tested button and position it at the bottom
  const locationBottomBtn = document.createElement("button");
  locationBottomBtn.textContent = "Get Tested";
  locationBottomBtn.classList.add("button");
  locationBottomBtn.dataset.open = "my-modal";
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
    locationBottomBtn
  );

  const showCurrentLocation = document.getElementById("my-location");
  showCurrentLocation.addEventListener("click", () => {
    if (navigator.geolocation) {
      //close the modal when popup appears to ask user to share location
      $(".reveal").foundation("close");
      // console.log("test", $(".reveal"));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("current position", pos);

          userLat = pos.lat;
          userLon = pos.lng;
          // console.log("current user lat/lng " + userLat + userLon);
          map.setCenter(pos);
          //mark current location on map
          var marker = new google.maps.Marker({
            map: map,
            position: pos,
          });
          getCovidData();
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation

      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
  getCovidData();
}

function getCovidData() {
  $.ajax({
    url:
      "https://discover.search.hereapi.com/v1/discover?apikey=" +
      covidApiKey +
      "&q=Covid&at=" +
      userLat +
      "," +
      userLon +
      "&limit=10",
    method: "GET",
  }).then(function (response) {
    console.log(response);
    testLocations = response.items;
    console.log("i am getting covid data from address");
    renderMarkers(testLocations);
  });
}
function renderMarkers(testLocations) {
  console.log("function is running to render markers");
  console.log(testLocations);

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: userLat, lng: userLon },
    zoom: 8,
    styles: mapStyleColors,
  });

  for (let i = 0; i < testLocations.length; i++) {
    //create a local object for each pair of lat/lon coordinates, pulled from the response data at iterative index
    var locations = {
      lat: testLocations[i].position["lat"],
      lng: testLocations[i].position["lng"],
    };

    console.log(locations);
    console.log(testLocations[i].title);

    //create a new marker google maps marker for each testing site's location object
    markers[i] = new google.maps.Marker({
      position: locations,
      map: map,
      title: testLocations[i].title,
      custom_property: testLocations[i].contacts[0].www[0]["value"],
    });

    //every time a marker is rendered, add event listener, listening for clicks on any of the markers.
    markers[i].addListener(
      //when marker click happens
      "click",
      //show an info window
      function () {
        let details = new google.maps.InfoWindow({
          content: this.title + "\n" + this.custom_property,
        });
        details.open(map, this);
      }
    );
  }
}

//Initialize and add the map

let map, infoWindow, geocoder;

//function to handle display lat and lon from address
function codeAddress(address) {
  geocoder.geocode({ address: address }, function (results, status) {
    userLat = results[0].geometry.location.lat();
    userLon = results[0].geometry.location.lng();
    console.log("lat/lng from function" + userLat + userLon);
    if (status == google.maps.GeocoderStatus.OK) {
      //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
    getCovidData();
  });
  $(".reveal").foundation("close");
}

$("#state-location").on("click", function () {
  var address = $("#state").val();
  codeAddress(address);
});

$("#zip-location").on("click", function () {
  var address = $("#zip").val();
  codeAddress(address);
});

const mapStyleColors = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
      {
        color: "#f49f53",
      },
    ],
  },
  {
    featureType: "landscape",
    stylers: [
      {
        color: "#f9ddc5",
      },
      {
        lightness: -7,
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 43,
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        color: "#645c20",
      },
      {
        lightness: 38,
      },
    ],
  },
  {
    featureType: "water",
    stylers: [
      {
        color: "#1994bf",
      },
      {
        saturation: -69,
      },
      {
        gamma: 0.99,
      },
      {
        lightness: 43,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#f19f53",
      },
      {
        weight: 1.3,
      },
      {
        visibility: "on",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "poi.business",
  },
  {
    featureType: "poi.park",
    stylers: [
      {
        color: "#645c20",
      },
      {
        lightness: 39,
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        color: "#a95521",
      },
      {
        lightness: 35,
      },
    ],
  },
  {},
  {
    featureType: "poi.medical",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 38,
      },
      {
        visibility: "off",
      },
    ],
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {
    elementType: "labels",
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      {
        color: "#9e5916",
      },
      {
        lightness: 32,
      },
    ],
  },
  {},
  {
    featureType: "poi.government",
    stylers: [
      {
        color: "#9e5916",
      },
      {
        lightness: 46,
      },
    ],
  },
  {
    featureType: "transit.station",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 22,
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        lightness: 38,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#f19f53",
      },
      {
        lightness: -10,
      },
    ],
  },
  {},
  {},
  {},
];
