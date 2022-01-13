// Upon page load, get the users location
// if location services is enabled, it will show a map of their area
// if location services are not enabled, it will show a generic map with a box that will allow them to 1 of 12 states
// Next, the user will input their zip code
// CHECK: does google take zip code as a parameter or do we need to convert zip to lat/lon
// We'll store the users location as lat/lon in a global variable
// We'll take the users lat/lon and input it into the COVID api/url
// The COVID api will return testing locations around that lat/lon


//get COVID testing site data
const covidApiKey = "K39YR7g51qETSXocQ0uyEDBxgxXWFZSILwgtqcrNaP8";  
const covidAppId = "ikc0ro0Fv33Mt3V90p6Y";
let userLat = 0;
let userLon = 0;

let covidApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=" + covidApiKey + "&q=Covid&at=38.439701,-122.715637&limit=10"

let covidResponseData = {}; //initialize empty object that we will fill up with covid response data. 
let testLocations = [];
let markers = []; //set markers to be an empty array to fill with all the marker info

//Initialize and add the map
let map;

const mapStyleColors = [
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#f49f53"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#f9ddc5"
            },
            {
                "lightness": -7
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 43
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "color": "#645c20"
            },
            {
                "lightness": 38
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#1994bf"
            },
            {
                "saturation": -69
            },
            {
                "gamma": 0.99
            },
            {
                "lightness": 43
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f19f53"
            },
            {
                "weight": 1.3
            },
            {
                "visibility": "on"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi.business"
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "color": "#645c20"
            },
            {
                "lightness": 39
            }
        ]
    },
    {
        "featureType": "poi.school",
        "stylers": [
            {
                "color": "#a95521"
            },
            {
                "lightness": 35
            }
        ]
    },
    {},
    {
        "featureType": "poi.medical",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 38
            },
            {
                "visibility": "off"
            }
        ]
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
        "elementType": "labels"
    },
    {
        "featureType": "poi.sports_complex",
        "stylers": [
            {
                "color": "#9e5916"
            },
            {
                "lightness": 32
            }
        ]
    },
    {},
    {
        "featureType": "poi.government",
        "stylers": [
            {
                "color": "#9e5916"
            },
            {
                "lightness": 46
            }
        ]
    },
    {
        "featureType": "transit.station",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 22
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "lightness": 38
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#f19f53"
            },
            {
                "lightness": -10
            }
        ]
    },
    {},
    {},
    {}
] 


function getCovidData(){  
    $.ajax({
        url: covidApiUrl,
        method: 'GET',
    }).then(function (response) {
        
        testLocations = response.items;

        renderMarkers(testLocations);
        displayCovidData(testLocations);
    });
};


function displayCovidData(testLocations){
  //console.log("function is running to display COVID data")
  //console.log(testLocations)
  
}

function renderMarkers(testLocations){
    console.log("function is running to render markers")
    console.log(testLocations) 

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 38.439701, lng: -122.715637 },
        zoom: 8,
        styles: mapStyleColors,
      });
    
      for (let i=0; i < testLocations.length; i++){
                
        //create a local object for each pair of lat/lon coordinates, pulled from the response data at iterative index
         var locations = {
            lat: testLocations[i].position['lat'],
            lng: testLocations[i].position['lng']
        }; 

        console.log(locations);
        console.log(testLocations[i].title);
    
        //create a new marker google maps marker for each testing site's location object
        markers[i] = new google.maps.Marker(
            {
            position: locations,
            map: map,
            title: testLocations[i].title,
            custom_property: testLocations[i].contacts[0].www[0]['value'],
            }
        ); 


        //every time a marker is rendered, add event listener, listening for clicks on any of the markers. 
        markers[i].addListener(
            //when marker click happens
            "click",
            //show an info window 
            function(){
                let details = new google.maps.InfoWindow(
                    {
                        content: this.title + "\n" + this.custom_property
                        
                    } 
                );
                details.open(map,this);
            }
            );
    }

}     

function mapMaker() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 38.439701, lng: -122.715637 },
      zoom: 8,
      styles: mapStyleColors,
    });
  }



           




getCovidData();

