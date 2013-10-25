
	var map = L.mapbox.map('map', 'barnaszasz.map-5d7s1o82');

    var distancesLeftToCalculate = 0;

    var userIcon = L.icon({
        iconUrl: 'img/user_icon.png',
        iconSize: [33, 49],
        iconAnchor: [33, 49]
    });

     var destIcon = L.icon({
        iconUrl: 'img/dest_icon.png',
        iconSize: [35, 49],
        iconAnchor: [20, 49]
    });
    
    var userMarker = L.marker(new L.LatLng(59.32375406716411, 18.075084686279297),{
                             icon: userIcon,
                             draggable: true});

    userMarker.bindPopup('Drag marker to find 5 closest views.');
    userMarker.addTo(map);
    
// user marker get coords on drag end
    userMarker.on('dragend', function(event) {
        
        var userMarkerLoc = userMarker.getLatLng();  // but using the passed event is cleaner
        var userMarkerTransform = ('fuck'+userMarkerLoc);
        var userMarkerCoords = userMarkerTransform.slice(10);
        
        console.log(userMarkerCoords);
        
        var _destinationSet = [];
    
    // get distances between origin and destinations    
        function getDistances (destinationCoords) {  
            
            var service = new google.maps.DistanceMatrixService();
                    service.getDistanceMatrix(  
                      {
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
                                var proximityData = {distance: distance, 
                                                     duration: duration, 
                                                     timeValue: timeValue, 
                                                     from: from,
                                                     to: to,
                                                     originCoords: userMarkerCoords,
                                                     destinationCoords: destinationCoords}; 
                                  
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
            var marker = L.marker([properties.destinationCoords.lb, properties.destinationCoords.mb], {icon: destIcon}).addTo(map);
        };
                    
        // get destinations data    
            function getDestinationsCoords(destinationCoordsData) {
                distancesLeftToCalculate = destinationCoordsData.rows.length;
                for (i=0;i<destinationCoordsData.rows.length;i++){
                    var raw = destinationCoordsData.rows[i];
                    var destinationCoords = new google.maps.LatLng(raw[2],raw[3]);
                    
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

    function getWeatherData (api) {

//http://api.worldweatheronline.com/free/v1/weather.ashx?q=stockholm&format=json&num_of_days=1&callback=?&key=86pdf5p7sa34xzrgbenmtjnb

        var key = "86pdf5p7sa34xzrgbenmtjnb";
        var url = "http://api.worldweatheronline.com/free/v1/weather.ashx?q=";
        var city = "Stockholm";
        var numDays = 1;
        var amazingCallback = "?"
    //	var coords = "";
        var format = "json";

	   var fullQueryUrl = url+city+"&format="+format+"&num_of_days="+numDays+"&callback="+amazingCallback+"&key="+key;

	//console.log(fullQueryUrl);

	   $.getJSON(fullQueryUrl, getTemperatureInfo);
    };

    function getTemperatureInfo (weatherData) {
        var currentTemperature = weatherData.data.current_condition[0].temp_C;
        var city = weatherData.data.request[0].query;
        var celsius = String.fromCharCode(176)+"C";
        var weatherDesc = weatherData.data.current_condition[0].weatherDesc[0].value;
        
        console.log("the temperature in "+city+" is "+currentTemperature+celsius);
        $('#weather').html("It is " + weatherDesc + " and the temperature in " + city + " is " +currentTemperature+celsius);
    };
    getWeatherData();

//  weather data callback
    

//Marine weather

    function getWaterData (waterApi) {
        var url = "http://api.worldweatheronline.com/free/v1/marine.ashx?q=";
        var q = "59.329,18.06511";
        var format = "json";
        var apiCallback = "?";
        var key = "f932x2a5kct424atxm6ned9z";
    
        var fullQueryUrl = url+q+"&format="+format+"&Callback="+apiCallback+"&key="+key;
    
        console.log(fullQueryUrl);
    
        $.getJSON(fullQueryUrl, getWaterTemp);
        
    };
    
    function getWaterTemp (waterTemp) {
        var waterTemperature = waterTemp.data.weather[0].hourly[0].waterTemp_C;
        console.log(waterTemperature);
        var q = waterTemp.data.request[0].query; 
        var celsius = String.fromCharCode(176)+"C";
    
        console.log("The water temperature in Stockholm is " + waterTemperature + celsius);
        $('#marine').html("The water temperature in Stockholm is "+waterTemperature+celsius);
    
    };
    getWaterData();



	
	
	
