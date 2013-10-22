/*global $, jQuery*/
/*jslint browser: true, closure: true, sloppy: true, vars: true, white: true */

// not using doc ready: $(document).ready(function () {

    var originPosition = null;
    var _destinationSet = [];
    
// get distances between origin and destinations    
    function getDistances (destinationCoords, destinationImage) {  
        
        var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(  
                  {
                    origins: [originPosition],
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
                                                 originCoords: originPosition,
                                                 destinationCoords: destinationCoords,
                                                 destinationImage: destinationImage}; 
                              
                              //destinationsValuesArray.push(proximityData); 
                              _destinationSet.push(proximityData);
                            }
                        }
                    }
                }
    }

//return closest destination
    function getClosest(destinationSet) {
        
            //full destination data set
            console.log(destinationSet.data); 
               
            var index = 0;
            var value = destinationSet.data[0].timeValue;
              
            for (var i = 1; i < destinationSet.data.length; i++) {
                if (destinationSet.data[i].timeValue < value) {
                    value = destinationSet.data[i].timeValue;
                    index = i; 
                }
            }
            
            var closestDestination = destinationSet.data[index];
            //closest destination data set 
            console.log(closestDestination);
            console.log(closestDestination.destinationImage);
        
        
            //code for going to closest view in html             
            $("#title").html("Closest");
            $("#user-location").html("You are currently at " + closestDestination.from +  "!");
        
            $("#closest").html("It should not take more than " + closestDestination.duration + " to get to " + closestDestination.to + "!");
       
            //get bg
            getBg(closestDestination.destinationImage);
        
            buttonsControl();
        
            //get directions
            calcDirections(closestDestination.destinationCoords);
    
            
     }


//return random destination         
    function findRandomDestination(destinationSet) {
        
//            $('directions-panel').empty();
    
// math.random of all destinations  ***** without repeating
            var randomDestination = destinationSet.data[Math.floor(Math.random() * destinationSet.data.length)];
 
            //random destination data set
            console.log(randomDestination);
        
            //code for going to random view in html        
            $("#title").html("Random");    
            $("#user-location").html("You are currently at " + randomDestination.from +  "!");
        
            $("#random").html("But maybe you want an adventure, so go explore " + randomDestination.to + " it will only take you " + randomDestination.duration + "!");
        
            //get bg
            getBg(randomDestination.destinationImage);
        
            buttonsControl();
        
            $('#more-random').show();
        
            //get directions
            calcDirections(randomDestination.destinationCoords);

            
    }

 //get destination backgrounds images
    function getBg(imgDestination) {
        
        var imgUrl = imgDestination;
        $('#img-container').css("background", 'url('+imgUrl+')');
        
    }

//add directions

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();

    function calcDirections(directionsCoords) {    
        
          directionsDisplay = new google.maps.DirectionsRenderer();
          $('#directions-panel').empty();    
          directionsDisplay.setPanel(document.getElementById('directions-panel'));
                
          var start = originPosition;
          console.log(originPosition);
          var end = directionsCoords;
          console.log(directionsCoords);
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


// get destinations data    
    function getDestinationsCoords(destinationCoordsData) {
               
            for (i=0;i<destinationCoordsData.rows.length;i++){
                var raw = destinationCoordsData.rows[i];
                //getting google maps json, this has lat and lng
                var destinationMedia = raw[6];
                var destinationCoords = new google.maps.LatLng(raw[2],raw[3]);
                
                // this is coords data of destinations
                // 4th callback to get distance function  
                getDistances(destinationCoords,destinationMedia);
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
            
            // 3rd callback
             $.getJSON(url, getDestinationsCoords);
        console.log(url);
    }


// get origin location   
    function geoLoc(p) {    
            var originLat = p.coords.latitude;
            var originLng = p.coords.longitude;
            
        // make sure its arguments and not a string
            originPosition = new google.maps.LatLng(originLat, originLng);
            
        // check we get coords, needs to be logged 1st
            console.log("My location is latitude " + originLat + " and longitude " + originLng);
                 
        //3rd callback    
            getDestinationsData();
    }           
        
    function geoError() {
            console.log("Could not find you!");
        } 
         
    function get_location() {
    
            if (geoPosition.init()) {
            // 2nd callback    
            geoPosition.getCurrentPosition(geoLoc, geoError);
        }      
     } 
   
    // 1st start call function      
    get_location();

//get weather data 

//temperature data
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




//show and hide buttons
    function buttonsControl() {
        $('#get-closest').hide();
        $('#get-random').hide();
        $('#back').show();
    }


    // click to get closest
    $('#get-closest').click(_destinationSet,getClosest);

    // click to get random
    $('#get-random').click(_destinationSet,findRandomDestination);

    //cycle through random destination
    $('#more-random').click(_destinationSet,findRandomDestination);

    $("#back").click(function() {
        window.location.reload()
    });

// my key: AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM
// test table id: 1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE 


// test1 data (works)
// https://www.googleapis.com/fusiontables/v1/tables/1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE/columns?key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM
// https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE&key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM
    
//http://maps.google.com/maps/api/directions/json?origin=59.29857610000000559.298576100000005,17.9919169&destination=59.3147616,18.03399764&sensor=true


// example fusion
// https://www.googleapis.com/fusiontables/v1/tables/1KxVV0wQXhxhMScSDuqr-0Ebf0YEt4m4xzVplKd4/columns?key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ
// https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1KxVV0wQXhxhMScSDuqr-0Ebf0YEt4m4xzVplKd4&key=your API key
    
// example distance matrix
// http://maps.googleapis.com/maps/api/distancematrix/json?origins=59.298819,17.9918335&destinations=59.31946149,18.07416947&mode=walking&language=-EN&sensor=true
    

// example directions api
// http://maps.google.com/maps/api/directions/json?origin=27.111,45.222&destination=28.333,46.444&sensor=false    




