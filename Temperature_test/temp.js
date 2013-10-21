$(document).ready(function() {

//http://api.worldweatheronline.com/free/v1/weather.ashx?q=stockholm&format=json&num_of_days=1&callback=%3F&key=f932x2a5kct424atxm6ned9z

function getWeatherData (api) {
	var url = "http://api.worldweatheronline.com/free/v1/weather.ashx?q=";
	var city = "Stockholm";
//	var coords = "";
	var numDays = 1;
	var format = "json";
	var amazingCallback = "?"
	var key = "f932x2a5kct424atxm6ned9z";

	var fullQueryUrl = url+city+"&format="+format+"&num_of_days="+numDays+"&Callback="+amazingCallback+"&key="+key;

	console.log(fullQueryUrl);

	$.getJSON(fullQueryUrl, getTempInfo);
	
};



function getTempInfo (weatherData) {
	var currentTemperature = weatherData.data.current_condition[0].temp_C;
	var city = weatherData.data.request[0].query.substring(0,9); 
	var celsius = String.fromCharCode(176)+"C";
	var weatherDesc = weatherData.data.current_condition[0].weatherDesc[0].value;
	var weatherCode = weatherData.data.current_condition[0].weatherCode;

	console.log("It is "+weatherDesc+" and the temperature in "+city+" is "+currentTemperature+celsius); 
	
	
	}

getWeatherData();

//Marineweather
//http://api.worldweatheronline.com/free/v1/marine.ashx?q=38.88944%2C-77.03533&format=json&callback=%3F&key=f932x2a5kct424atxm6ned9z

function getWaterData (waterApi) {
	var url = "http://api.worldweatheronline.com/free/v1/marine.ashx?q=";
	var q = "38.88944,-77.03533";
	var format = "json";
	var marineCallback = "?";
	var key = "f932x2a5kct424atxm6ned9z";

var fullQueryUrl = url+q+"&format="+format+"&Callback="+marineCallback+"&key="+key;

	console.log(fullQueryUrl);

	$.getJSON(fullQueryUrl, getWaterData);
	
};

function getTempWater (waterTemp) {
	var waterTemperature = waterTemp.data.request.weather[0].waterTemp_C;
	var q = waterData.data.request[0].query; 
	var celsius = String.fromCharCode(176)+"C";

	console.log("It is "+waterTemperature+" and the temperature in "+q+" is "+waterTemperature+celsius); 
	
	
	}

getWaterData();


//
});


