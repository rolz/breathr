var map = L.mapbox.map('map', 'barnaszasz.map-5d7s1o82');

map.locate({setView: true, maxZoom: 13});

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    
    var userIcon = L.icon({
        iconUrl: 'img/user_icon.png',
        iconSize: [33, 49],
        iconAnchor: [33, 49]
    });

    var userMarker = L.marker(e.latlng, {
        icon: userIcon,
        draggable: true
    }); 
        
    L.circle(e.latlng, radius).addTo(map);
    
    userMarker.addTo(map);
    userMarker.bindPopup("You are within " + radius + " meters from this point").openPopup();
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

var distancesLeftToCalculate = 0;

var destIcon = L.icon({
    iconUrl: 'img/dest_icon.png',
    iconSize: [35, 49],
    iconAnchor: [20, 49]
});


// user marker get coords on drag end
userMarker.on('dragend', function (event) {

    var userMarkerLoc = userMarker.getLatLng(); // but using the passed event is cleaner
    var userMarkerTransform = ('fuck' + userMarkerLoc);
    var userMarkerCoords = userMarkerTransform.slice(10);

    console.log(userMarkerCoords);

    var _destinationSet = [];

    // get distances between origin and destinations    
    function getDistances(destinationCoords) {

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
                            destinationCoords: destinationCoords
                        };

                        //destinationsValuesArray.push(proximityData); 
                        _destinationSet.push(proximityData);
                        console.log(proximityData);
                    }
                }
            }
            console.log(distancesLeftToCalculate)
            distancesLeftToCalculate--;
            if (distancesLeftToCalculate <= 0) {
                console.log("All done mother fucker.")
                getClosest(_destinationSet);
            }
        }
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

        var closestDestination = destinationSet[index];
        //closest destination data set 
        console.log("this is closest ", closestDestination);

        createDestinationMarkers(closestDestination);

    }



    //create destination markers    
    function createDestinationMarkers(properties) {
        var marker = L.marker([properties.destinationCoords.lb, properties.destinationCoords.mb], {
            icon: destIcon
        }).addTo(map);
    };

    // get destinations data    
    function getDestinationsCoords(destinationCoordsData) {
        distancesLeftToCalculate = destinationCoordsData.rows.length;
        for (i = 0; i < destinationCoordsData.rows.length; i++) {
            var raw = destinationCoordsData.rows[i];
            var destinationCoords = new google.maps.LatLng(raw[3], raw[4]);

            getDistances(destinationCoords);
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
        console.log(url);
    }

    getDestinationsData();

});
