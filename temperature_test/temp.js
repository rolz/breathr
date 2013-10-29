$(document).ready(function() {

//http://api.worldweatheronline.com/free/v1/weather.ashx?q=stockholm&format=json&num_of_days=1&callback=%3F&key=f932x2a5kct424atxm6ned9z

function getWeatherData (api) {
	var url = "http://api.worldweatheronline.com/free/v1/weather.ashx?q=";
	var city = "Stockholm";
//	var coords = "";
	var numDays = 1;
	var format = "json";
	var apiCallback = "?"
	var key = "f932x2a5kct424atxm6ned9z";

	var fullQueryUrl = url+city+"&format="+format+"&num_of_days="+numDays+"&Callback="+apiCallback+"&key="+key;

	console.log(fullQueryUrl);

	$.getJSON(fullQueryUrl, getTempInfo);
	
};



function getTempInfo (weatherData) {
	var currentTemperature = weatherData.data.current_condition[0].temp_C;
	var city = weatherData.data.request[0].query.substring(0,9); 
	var celsius = String.fromCharCode(176)+"C";
	var weatherDesc = weatherData.data.current_condition[0].weatherDesc[0].value;
	var weatherCode = weatherData.data.current_condition[0].weatherCode;

	console.log(weatherCode);

	console.log("It is "+weatherDesc+" and the temperature in "+city+" is "+currentTemperature+celsius); 
	
	$("#weather").html("It is "+weatherDesc+" and the temperature in "+city+" is "+currentTemperature+celsius);
	
	var climacon = "climacons/"+weatherCode+".png"

	$("#weathericon").html('<img src="'+climacon+'">');

	}

getWeatherData();

//Marineweather
//http://api.worldweatheronline.com/free/v1/marine.ashx?q=38.88944%2C-77.03533&format=json&callback=%3F&key=f932x2a5kct424atxm6ned9z

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

	console.log("The water temperature in Stockholm is "+waterTemperature+celsius); 
	
	
	}

getWaterData();


//
});


