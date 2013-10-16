$(document).ready(function() {

function getData (api) {

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

	$.getJSON(fullQueryUrl, getTempInfo);
};



function getTempInfo (weatherData) {
		var currentTemperature = weatherData.data.current_condition[0].temp_C;
		var city = weatherData.data.request[0].query;
		var celsius = String.fromCharCode(176)+"C";
		console.log("the temperature in "+city+" is "+currentTemperature+celsius);
};

getData();

});