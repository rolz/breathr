$(document).ready(function() {

    var originPosition = null;
          
    // get origin location    
        
    function get_location() {
         
        if (geoPosition.init()) {
          geoPosition.getCurrentPosition(geoLoc, geoError);
        }  
            
     }; 
    
    function geoLoc(p) {
        
        originLat = p.coords.latitude;
        originLng = p.coords.longitude;
        
        // make sure its arguments and not a string
        originPosition = new google.maps.LatLng(originLat, originLng);
        
        console.log("My location is latitude " + originLat +" and longitude " + originLng);
        $("#lat").html(originLat);
        $("#lng").html(originLng);
     
    //2nd callback    
        getDestinationsData();
    };
            
        
    function geoError() {
          console.log("Could not find you!");
        }   
  
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
        

    
            
    function getDestinations(l) {
               
            for (i=0;i<l.rows.length;i++){
                var raw = l.rows[i];
                //getting google maps json
                var destinationArray = new google.maps.LatLng(raw[3],raw[4]);
                
                // 4th and last callback to get distance function  
                getDistance(destinationArray);
                
                //console array
                //console.log(destinationArray);
                
            }

    };
        
    
    
    var timeValueArray = new Array();
    
    function getDistance(destinationCoordsArray) {
          
        //get distances    
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(  
              {
                origins: [originPosition],
                destinations: [destinationCoordsArray],
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.METRIC,
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
                          
                        // add needed element to an array  
                        var proximityData = [distance,duration,timeValue];    
                        timeValueArray.push(proximityData);  
                      }
                    }
                  }    
            }
         
    };
    
    
    // get proximity data out of for loop and make an array
    var proximityArray = timeValueArray;
    storeProximityArray(proximityArray);
    
    

//get time values from duration values and store in an array?
    function storeProximityArray(allProximityValues) {
        var proximityArray = [allProximityValues];
        console.log(proximityArray); 
            
//        // use this to find smallest number
//            var index = 0;
//            var value = temp[0];
//            for (var i = 1; i < temp.length; i++) {
//              if (temp[i] < value) {
//                value = temp[i];
//                index = i;
//              }
//}
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


