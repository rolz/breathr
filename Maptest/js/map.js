
	var map = L.mapbox.map('map', 'barnaszasz.map-5d7s1o82');

	function createMarker(properties) {
		console.log(properties[2], properties[3]);
        var marker = L.marker([properties[2], properties[3]]).addTo(map);
        marker.bindPopup(properties[6]).openPopup();
    };
				
// get destinations data    
    function getDestinationsCoords(destinationCoordsData) {
               
            for (i=0;i<destinationCoordsData.rows.length;i++){
                var raw = destinationCoordsData.rows[i];
				console.log(raw);
				
				createMarker(raw); 
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
	
	
