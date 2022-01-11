//test COVID api
let covidApiKey = "K39YR7g51qETSXocQ0uyEDBxgxXWFZSILwgtqcrNaP8";
let covidAppId = "ikc0ro0Fv33Mt3V90p6Y";

let covidApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=" + covidApiKey + "&q=Covid&at=30.22,-92.02&limit=10"

function getCovidData(){
        
            $.ajax({
                url: covidApiUrl,
                method: 'GET',
            }).then(function (response) {
    
                console.log(response) 
            });
};

getCovidData();


//Initialize and add the map

let map;

function mapMaker() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
