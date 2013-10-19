$(document).ready(function() {
    
    var originPosition = null;
    var destinationsContainerArray = []; 
    
    // get origin location    
        
    function get_location() {
         
        if (geoPosition.init()) {
        // 2nd callback    
          geoPosition.getCurrentPosition(geoLoc, geoError);
        }      
     }; 
    
    function geoLoc(p) {
        
        originLat = p.coords.latitude;
        originLng = p.coords.longitude;
        
        // make sure its arguments and not a string
        originPosition = new google.maps.LatLng(originLat, originLng);
        // need to be logged 1st
        console.log("My location is latitude " + originLat +" and longitude " + originLng);
        $("#lat").html(originLat);
        $("#lng").html(originLng);
     
    //3rd callback    
        getDestinationsData();
    };
            
        
    function geoError() {
          console.log("Could not find you!");
        };   
  
    // 1st start call function      
    get_location();
                  
    // get location of database of destinations   | test1 data 
    function getDestinationsData(table) {
        
         var fusionUrl = "https://www.googleapis.com/fusiontables/v1/";
         var allDataQuery = "query?sql=SELECT%20*%20FROM%20";
         var fusionTableId = "1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE";
         var fusionKey = "&key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM";
         
         var url = fusionUrl+allDataQuery+fusionTableId+fusionKey;
        
        // 3rd callback
         $.getJSON(url, getDestinations);
    };
    
     function getDestinations(destinationCoordsData) {
               
            for (i=0;i<destinationCoordsData.rows.length;i++){
                var raw = destinationCoordsData.rows[i];
                //getting google maps json, this has lat and lng
                var destinationObjects = new google.maps.LatLng(raw[3],raw[4]);
                
                // this is coords data of destinations

                // 4th callback to get distance function  
                getDistance(destinationObjects);
            }
    };
        
    
    function getDistance(destinationCoordsArray) {      
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(  
              {
                origins: [originPosition],
                destinations: [destinationCoordsArray],
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.METRIC,
              }, callback);
    }; 
    
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
                                             to: to}; 
                          
                          //destinationsValuesArray.push(proximityData); 
                          destinationsContainerArray.push(proximityData);
                        }
                    }
                }
    };
    var proximityArray = destinationsContainerArray; 
        storeProximityArray(proximityArray);
      
      
    
//get time values from duration values and store in an array
    function storeProximityArray(allProximityValues) {
        var destinationsContainerArray = [allProximityValues];
        // first time location allow, you need to reload page for array to work.
        console.log(destinationsContainerArray); 
     };
    
        
    function findRandomDestination() {
       // math.random of all destinations        
    };
 

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



});


