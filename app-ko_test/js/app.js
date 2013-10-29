var originCoordinates = null;
var _destinationSet = [];

// get distances between origin and destinations    

function getDistances(destinationCoords, destinationImage) {
    console.log(destinationCoords);
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [originCoordinates],
        destinations: [destinationCoords],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    }, callback);

    function callback(response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK) {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    var distance = element.distance.text;
                    var duration = element.duration.text;
                    //get time value
                    var timeValue = element.duration.value;
                    var from = origins[i];
                    var to = destinations[j];

                    // add needed elements to an object
                    var proximityData = {
                        distance: distance,
                        duration: duration,
                        timeValue: timeValue,
                        from: from,
                        to: to,
                        originCoordinates: originCoordinates,
                        destinationCoords: destinationCoords,
                        destinationImage: destinationImage
                    };

                    _destinationSet.push(proximityData);
                }
            }
        }
    }
}

//Closest and Random Destinations
function DestinationsViewModel(destinationSet) {
    var self = this;
    self.originAddress = ko.observable;
    self.destinationAddress = ko.observable;
    self.bgImage = ko.observable;

    var index = 0;
    var value = destinationSet.data[0].timeValue;
    for (var i = 1; i < destinationSet.data.length; i++) {
        if (destinationSet.data[i].timeValue < value) {
            value = destinationSet.data[i].timeValue;
            index = i;
        }
    }
    var closestDestination = destinationSet.data[index];

    self.originAddress(closestDestination.from);
    self.destinationAddress(closestDestination.to);
    //  self.bgImage(closestDestination.destinationImage); 
}

//Data from Fusion Tables
function fusionData() {
    var fusionApi = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%201uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE&key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM";

    $.getJSON(fusionApi, function (allData) {
        for (i = 0; i < allData.rows.length; i++) {
            var raw = allData.rows[i];
            //getting google maps json, this has lat and lng
            var destinationMedia = raw[6];
            var destinationCoords = new google.maps.LatLng(raw[2], raw[3]);

            getDistances(destinationCoords, destinationMedia);
        }
    })
}

//get origin location   
function geoLoc(p) {
    var originLat = p.coords.latitude;
    var originLng = p.coords.longitude;
    originCoordinates = new google.maps.LatLng(originLat, originLng);
    fusionData();
}

function geoError() {
    console.log("Could not find you!");
}

function get_location() {
    if (geoPosition.init()) {
        geoPosition.getCurrentPosition(geoLoc, geoError);
    }
}
get_location(); //App starts here


//Weather
function WeatherViewModel() {
    // Data
    var self = this;
    self.temp = ko.observable();
    self.marineTemp = ko.observable();
    self.weatherIcon = ko.observable();

    var celcius = String.fromCharCode(176) + "C";

    var weatherApi = "http://api.worldweatheronline.com/free/v1/weather.ashx?q=Stockholm&format=json&num_of_days=1&callback=?&key=86pdf5p7sa34xzrgbenmtjnb";
    var marineApi = "http://api.worldweatheronline.com/free/v1/marine.ashx?q=59.329,18.06511&format=json&Callback=?&key=f932x2a5kct424atxm6ned9z";

    var data = $.getJSON(weatherApi, function (allData) {
        var t = allData.data.current_condition[0].temp_C + celcius;
        var wC = allData.data.current_condition[0].weatherCode;
        var climacon = "images/climacons/" + wC + ".png";
        self.weatherIcon(climacon);
        self.temp(t);
    });

    var mData = $.getJSON(marineApi, function (allData) {
        var mT = allData.data.weather[0].hourly[0].waterTemp_C + celcius;
        self.marineTemp(mT);
    });
};
ko.applyBindings(new WeatherViewModel());