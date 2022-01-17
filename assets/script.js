// Upon page load, get the users location
// if location services is enabled, it will show a map of their area
// if location services are not enabled, it will show a generic map with a box that will allow them to 1 of 12 states
// Next, the user will input their zip code
// CHECK: does google take zip code as a parameter or do we need to convert zip to lat/lon
// We'll store the users location as lat/lon in a global variable
// We'll take the users lat/lon and input it into the COVID api/url
// The COVID api will return testing locations around that lat/lon

// Initialize Foundation framework to be interactive and perfomrm js functions
$(document).foundation();

//this binds the Parsley library to the form
$("#form").parsley();

$("#side-form").parsley();
$(".loading-container").hide();




//test COVID api
let covidApiKey = "K39YR7g51qETSXocQ0uyEDBxgxXWFZSILwgtqcrNaP8";
let covidAppId = "ikc0ro0Fv33Mt3V90p6Y";

let userLat;
let userLon;
let covidResponseData = {}; //initialize empty object that we will fill up with covid response data.
let testLocations = [];
let markers = []; //set markers to be an empty array to fill with all the marker info
let pastAddress = []; //empty array that we will fill with past addresses

//Map stying from Snazzy Maps
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

//Initialize and add the map
let map, infoWindow, geocoder;

// GET CURRENT LOCATION & DRAW MAP
function mapMaker() {
  //This function is called from the script tag in the html via Google Maps API's callback function
  //As soon as the data is retrived, Google Maps API will call this function.

  //Render placeholder map that will show on page load
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    styles: mapStyleColors,
  });
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();

  //RENDER INITIAL SEARCH BUTTON
  const locationBottomBtn = document.createElement("div"); //displaying a div with an image for a button
  locationBottomBtn.innerHTML =
    '<img src="assets/images/test-graphic.png" class="testing-img" width="150px" height="150px">';
  locationBottomBtn.setAttribute("id", "get-tested-button"); //add class for addition styling in css
  locationBottomBtn.classList.add("div");
  locationBottomBtn.dataset.open = "my-modal";
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
    locationBottomBtn //clicking on div will open the search modal
  );

  const showCurrentLocation = document.getElementById("my-location");
  showCurrentLocation.addEventListener("click", () => {
    $(".loading-container").show(); //show loading spinner while fetching results
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
          //console.log("current position", pos);

          userLat = pos.lat;
          userLon = pos.lng;

          // console.log("current user lat/lng " + userLat + userLon);
          map.setCenter(pos);
          //mark current location on map

          var marker = new google.maps.Marker({
            map: map,
            position: pos,
            animation: google.maps.Animation.DROP,
          });

          getCovidData();
          $(".loading-container").hide(); ////hide loading spinner while displaying results
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

  //CHECK URL FOR SEARCH QUERY,
  //once the map is loaded, see if there is a search query from a side page
  checkQueryURL();
}

//If geolocation fails
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  // hide spinner when geolocation location service failed
  $(".loading-container").hide();
  infoWindow.open(map);
  getCovidData();
}

//API CALL to get COVID data
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
    testLocations = response.items;
    displayLocationList(testLocations);
    renderMarkers(testLocations);
  });
}

//RENDER LIST  - Feed the COVID Data to a function to display the sidebar list of locations
function displayLocationList(testLocations) {
  $("#box").show();
  let htmlTags = ``;

  //loop through the site location and add a div filled with info for each site
  for (let i = 0; i < testLocations.length; i++) {
    htmlTags += `            
      <div class="site-info">
        <p class="title"><strong> ${
          testLocations[i]?.title?.split(":")[1] || "no title"
        }</strong></p>
        <p class="phone-number"> ${
          testLocations[i]?.contacts?.[0]?.phone?.[0].value || "no phone number"
        }</p>
      </div>`;
  }
  $("#site-info-wrapper").html(htmlTags);
}

//RENDER MARKERS Feed COVID data to goople map object to draw markers & info windows
function renderMarkers(testLocations) {
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

    //create a new marker google maps marker for each testing site's location object
    markers[i] = new google.maps.Marker({
      position: locations,
      map: map,
      animation: google.maps.Animation.DROP,
    });
    // var bounceMarker = markers[i];
    // marker.addListener("click", toggleBounce);
    //every time a marker is rendered, add event listener, listening for clicks on any of the markers.
    markers[i].addListener(
      //when marker click happens
      "click",
      //show an info window
      function () {
        console.log(" i here is", i);
        var linkTitle = testLocations[i].title.split(":")[1]; //remove COVID from test location title
        var linkHref = testLocations[i].contacts[0].www[0]["value"];

        // close any open infoWindow
        if (infoWindow) {
          infoWindow.close();
        }

        infoWindow = new google.maps.InfoWindow({
          content: `<a target="blank" href=" ${linkHref} ">  ${linkTitle} </a>`,
        });

        // only dispaly the infoWindow on click for that marker
        infoWindow.open(map, this);

        toggleBounce(i);
      }
    );
  }
}

// add bounce animation to each marker on map
function toggleBounce(bounceMarkerIndex) {
  for (i = 0; i < markers.length; i++) {
    markers[i].setAnimation(null);
    if (i === bounceMarkerIndex) {
      markers[i].setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}

//GET ADDRESS - function to get lat and lon from address input
function codeAddress(address) {
  geocoder.geocode({ address: address }, function (results, status) {
    //get user Coordinates from address and store them
    userLat = results[0].geometry.location.lat();
    userLon = results[0].geometry.location.lng();

    console.log("function running to get address");
    console.log(address);

    if (status == google.maps.GeocoderStatus.OK) {
      //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
      });

      // once we have location, call up API
      getCovidData();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
  $(".reveal").foundation("close");
}

function storeAddress(address) {
  //store any addresses the user has searched for in local storage

  pastAddress.push(address);

  //console.log(pastAddress);
  localStorage.setItem("locations", JSON.stringify(pastAddress));
}

function displayNewLocation(address) {
  $("#past-locations").show();

  let button = $("<button/>", {
    //CREATE a new button
    text: address, //FILL new button
    class: "saved-location-button",
    click: function () {
      codeAddress(address);
    },
  });

  //APPEND to div
  $("#past-locations").append(button);
}

// Add event listener to state button
$("#state-location").on("click", function () {
  //every time we get a new input location, we need to do three things:
  var address = $("#state").val();
  //1. Pass the location to goole API for lat/lon
  codeAddress(address);
  //2. Store the new location in local storage
  storeAddress(address);
  // display a button in the saved locations section with the new location
  displayNewLocation(address);
});

// Add event listener to zip button
$("#zip-location").on("click", function () {
  var address = $("#zip").val();
  if ($("#zip").parsley().validate() == true) {
    codeAddress(address);
    storeAddress(address);
    displayNewLocation(address);
  }
});

// Add event listener to zip button in top nav bar
$("#search-zip").on("click", function () {
  var address = $("#zip-text").val();

  //console.log('THIS IS WHAT ADDRESS GETS PASSED TO GEOCODE')
  //console.log (address)
  if ($("#zip-text").parsley().validate() == true) {
  codeAddress(address);
  storeAddress(address);
  displayNewLocation(address);
  }
});

//CHECK STORAGE -
function displaySavedLocations() {
  //console.log("Checking for local storage");

  //first, check to if there is anything in local storage with the key of locations
  if (localStorage.getItem("locations")) {
    //if so, parse through anything in local stoarage and save it into the array of past addresses
    pastAddress = JSON.parse(localStorage.getItem("locations"));

    //turn the display of the past markers on
    $("#past-locations").show();

    //loop through the array of saved locations
    for (i = 0; i < pastAddress.length; i++) {
      //console.log("this is the past address");
      //console.log(pastAddress[i]);

      let address = pastAddress[i];

      let button = $("<button/>", {
        //CREATE a new button
        text: address, //FILL new button
        class: "saved-location-button",
        click: function () {
          //when a button is clicked code the address into Lat long,
          codeAddress(address);
        },
      });

      //APPEND to div
      $("#past-locations").append(button);
    }
  }
}

//CHECK STORAGE - when the pages load, run the function to check local storage and display any saved locations
displaySavedLocations();

//REDIRECT SECTION

//SEARCH BAR FROM OTHER PAGES
//add event listener to search bars on the nav bars on the side pages
$("#side-page-button").on("click", function () {
  //redirect to the index.html with a search query.
  //console.log("side-page button was clicked.")

  //grab and store value entered from input form
  let redirectZip = $("#side-page-input").val();

  console.log(redirectZip);
  //console.log (window.location.href)

  //redirect to the homepage with the zip query added on the end as a search string
  window.location.href = "index.html" + "?search=" + redirectZip;
});

//CHECK URL FOR SEARCH QUERY, after the mapMaker fxn finishes running 
function checkQueryURL() {
  //check to see if there is a query at the end of the URL
  if (document.location.search) {
    //console.log("there is a query in the URL" + document.location.search)

    //if so, get the address off the end of search string
    let address = document.location.search.split("=")[1];
    console.log(address);

    //pass the address to the geocoder
    codeAddress(address);

    //pass the address to the functions to display the new sites and store in local storage
    storeAddress(address);
    displayNewLocation(address);
  }
}

//END OF REDIRECT SECTION
