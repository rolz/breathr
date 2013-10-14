$(document).ready(function() {

    var myLat = 0;
    var myLng = 0;

    
// get my location    
    
function get_location() {
     
    if (geoPosition.init()) {
      geoPosition.getCurrentPosition(geoLoc, geoError);
    }  
        
 }; 

function geoLoc(p) {
    
    myLat = p.coords.latitude;
    myLng = p.coords.longitude;
    
    console.log("My location is latitude " + myLat +" and longitude " + myLng);
    $("#lat").html(myLat);
    $("#lng").html(myLng);
    }
     
function geoError() {
      console.log("Could not find you!");
    }   
    
get_location();
    
    
// get location of database of locations   | test1 data 

function getData(table) {
    
     var fusionUrl = "https://www.googleapis.com/fusiontables/v1/";
     var allDataQuery = "query?sql=SELECT%20*%20FROM%20";
     var fusionTableId = "1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE";
     var fusionKey = "&key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM";
     
     var url = fusionUrl+allDataQuery+fusionTableId+fusionKey;
    
     $.getJSON(url, sortLocations);
};
    
getData();

    
// ?how do you find the lenght of the array?    
function sortLocations(l) {
        for (i=0;i<l.rows.length;i++){
            var raw = l.rows[i];
            var lat = raw[3];
            var lng = raw[4];
            
            console.log(lat+","+lng);
        }  
};
    
console.log(myLat);

    




// my key: AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM
// test table id: 1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE 


// test1 data (works)
// https://www.googleapis.com/fusiontables/v1/tables/1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE/columns?key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM
// https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1uljVsKPiMm45Sjs41B6KHlXmvoa8STcU8p-dCLE&key=AIzaSyA8z1sLokJyNX3IX58jbSic-coCPpkKifM


// example
// https://www.googleapis.com/fusiontables/v1/tables/1KxVV0wQXhxhMScSDuqr-0Ebf0YEt4m4xzVplKd4/columns?key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ
// https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1KxVV0wQXhxhMScSDuqr-0Ebf0YEt4m4xzVplKd4&key=your API key


});


