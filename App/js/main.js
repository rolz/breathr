/*global $, jQuery*/
/*jslint browser: true, closure: true, sloppy: true, vars: true, white: true */

// not using doc ready: $(document).ready(function () {

    var originPosition = null;
    var _destinationSet = [];
    
//? how do i get the destinations coords array out and match up with the right the proximity data in a object    
    function getDistances (destinationCoordsArray, destinationImage) {  
        
        var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(  
                  {
                    origins: [originPosition],
                    destinations: [destinationCoordsArray],  
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
                                                 destinationCoords: destinationCoordsArray,
                                                 destinationImage: destinationImage}; 
                              
                              //destinationsValuesArray.push(proximityData); 
                              _destinationSet.push(proximityData);
                            }
                        }
                    }
                }
    }

//Find closest destination
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
       
            getBg(closestDestination.destinationImage)
    
            buttonsControl();
     }


//return random destination         
    function findRandomDestination(destinationSet) {
    
            // math.random of all destinations  
            var randomDestination = destinationSet.data[Math.floor(Math.random() * destinationSet.data.length)];
        
            //random destination data set
            console.log(randomDestination);
        
            //code for going to random view in html        
            $("#title").html("Random");    
            $("#user-location").html("You are currently at " + randomDestination.from +  "!");
        
            $("#random").html("But maybe you want an adventure, so go explore " + randomDestination.to + " it will only take you " + randomDestination.duration + "!");
        
            getBg(randomDestination.destinationImage)

            buttonsControl();
            $('#more-random').show();
    }

 //get destination backgrounds images
    function getBg(imgDestination) {
        
        var imgUrlHttps = imgDestination;
        var imgUrlHttp = imgUrlHttps.replace("https","http");
        console.log(imgUrlHttp);       
        var imgUrl = 'url('+imgUrlHttp+')';
        $('#img-container').css("background", "url(http://pbs.twimg.com/media/BWHwn9qIUAAOu90.jpg)");
        
    }
    

// get destinations data    
    function getDestinationsCoords(destinationCoordsData) {
               
            for (i=0;i<destinationCoordsData.rows.length;i++){
                var raw = destinationCoordsData.rows[i];
                //getting google maps json, this has lat and lng
                var destinationMedia = raw[1];
                var destinationCoords = new google.maps.LatLng(raw[3],raw[4]);
                
                // this is coords data of destinations
                // 4th callback to get distance function  
                getDistances(destinationCoords,destinationMedia);
            }
    } 

    
    function getDestinationsData() {
// use urlEncode***     
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

//  weather data callback
    getWeatherData();


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




