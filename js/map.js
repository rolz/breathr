var map = L.mapbox.map('map', 'barnaszasz.map-5d7s1o82');

map.locate({
    setView: true,
    maxZoom: 13
});

var userMarker;
var lat = 59.32932349999999;
var lng = 18.068580800000063;

var newLatLng = new L.LatLng(lat, lng);

function onLocationFound(e) {
    console.log(e.latlng);
    var userIcon = L.icon({
        iconUrl: 'img/user_icon.png',
        iconSize: [33, 49],
        iconAnchor: [16.5, 49],
        popupAnchor: [0, -35]
    });

    userMarker = L.marker(newLatLng, {
        icon: userIcon,
        draggable: true,
        zIndexOffset: 2
    });

    //    L.circle(e.latlng, radius).addTo(map);

    userMarker.addTo(map);
    userMarker.bindPopup("<b>You are here!</b><br>Drag the market to find closest spot</br>").openPopup();

    drag(userMarker);

}


map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);


var distancesLeftToCalculate = 0;

function drag(userMarker) {
    // user marker get coords on drag end
    userMarker.on('dragend', function(event) {

        var userMarkerLoc = userMarker.getLatLng(); // but using the passed event is cleaner
        var userMarkerTransform = ('fuck' + userMarkerLoc);
        var userMarkerCoords = userMarkerTransform.slice(10);

        var _destinationSet = [];

        // get distances between origin and destinations
        function getDistances(destinationCoords, destinationMedia) {

            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [userMarkerCoords],
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
                                originCoords: userMarkerCoords,
                                destinationCoords: destinationCoords,
                                destinationMedia: destinationMedia
                            };

                            //destinationsValuesArray.push(proximityData);
                            _destinationSet.push(proximityData);
                        }
                    }
                }

                distancesLeftToCalculate--;
                if (distancesLeftToCalculate <= 0) {
                    getClosest(_destinationSet);
                }
            }
        }
        // get destinations data
        function getDestinationsCoords(destinationCoordsData) {
            distancesLeftToCalculate = destinationCoordsData.rows.length;
            for (i = 0; i < destinationCoordsData.rows.length; i++) {
                var raw = destinationCoordsData.rows[i];
                var destinationCoords = new google.maps.LatLng(raw[3], raw[4]);
                var destinationMedia = raw[7];

                console.log(destinationCoords);

                getDistances(destinationCoords, destinationMedia);
            }
        }

        // get points from fusion table
        function getDestinationsData() {
            //***use urlEncode***
            var fusionUrl = "https://www.googleapis.com/fusiontables/v1/";
            var allDataQuery = "query?sql=SELECT%20*%20FROM%20";
            var fusionTableId = "1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE";
            var fusionKey = "&key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM";

            var url = fusionUrl + allDataQuery + fusionTableId + fusionKey;

            $.getJSON(url, getDestinationsCoords);
        }

        getDestinationsData();


    });
}

//return closest destination **** find way to connect getDistances
function getClosest(destinationSet) {

    var index = 0;
    var value = destinationSet[0].timeValue;

    for (var i = 1; i < destinationSet.length; i++) {
        if (destinationSet[i].timeValue < value) {
            value = destinationSet[i].timeValue;
            index = i;
        }
    }

    console.log("cd" + destinationSet[index]);
    var closestDestination = destinationSet[index];
    //closest destination data set

    console.log(closestDestination);

    createDestinationMarkers(closestDestination);

}

// destination icon
var destIcon = L.icon({
    iconUrl: 'img/dest_icon.png',
    iconSize: [35, 49],
    iconAnchor: [20, 49],
    popupAnchor: [0, -35]
});

//create destination markers
function createDestinationMarkers(properties) {
    var marker = L.marker([properties.destinationCoords.k, properties.destinationCoords.B], {
        icon: destIcon,
        zIndexOffset: 1
    }).addTo(map).bindPopup("<b>Click here to see the view!</b>").openPopup().on('click', function clickDestination() {

        getBg(properties.destinationMedia);
    });

    calcDirections(properties.originCoords, properties.destinationCoords);
}

function getBg(imgDestination) {

    var imgUrl = imgDestination;

    // fade this in:
    $('#img-container').css({
        'background': 'url(' + imgUrl + ')',
        'backgroundSize': '100%',
        'display': 'block'
    });
}

//add directions


var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function calcDirections(originCoords, destinationCoords) {

    directionsDisplay = new google.maps.DirectionsRenderer();
    $('#sidr-right').empty();
    directionsDisplay.setPanel(document.getElementById('sidr-right'));

    var start = originCoords;

    var end = destinationCoords;

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

//add sidr

$('#right-menu').sidr({
    name: 'sidr-right',
    side: 'right',
});

function StartViewModel() {
    // Data
    var self = this;
    self.temp = ko.observable();
    self.marineTemp = ko.observable();
    self.weatherIcon = ko.observable();
    self.marineIcon = "img/waves.png";
    self.walking = "img/walking_path.png";
    self.map = "img/map.png";
    self.close = "img/close.png";

    var celcius = String.fromCharCode(176) + "C";

    var weatherApi = "http://api.worldweatheronline.com/free/v1/weather.ashx?q=Stockholm&format=json&num_of_days=1&callback=?&key=86pdf5p7sa34xzrgbenmtjnb";
    var marineApi = "http://api.worldweatheronline.com/free/v1/marine.ashx?q=59.329,18.06511&format=json&Callback=?&key=f932x2a5kct424atxm6ned9z";

    var data = $.getJSON(weatherApi, function(allData) {
        var t = allData.data.current_condition[0].temp_C + celcius;
        var wC = allData.data.current_condition[0].weatherCode;
        var climacon = "img/climacons/" + wC + ".png";
        self.weatherIcon(climacon);
        self.temp(t);
    });

    var mData = $.getJSON(marineApi, function(allData) {
        var mT = allData.data.weather[0].hourly[0].waterTemp_C + celcius;
        self.marineTemp(mT);
    });
}
ko.applyBindings(new StartViewModel()); //key elements

$('#close-img').click(function() {
    $('#img-container').hide();
});

$('#close-map').click(function() {
    window.location = 'index.html';
});
