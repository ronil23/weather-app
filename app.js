const express = require('express')
const app = express()
const request = require('request');

//sample api params
var sampleUrl = 'http://samples.openweathermap.org/data/2.5/forecast';
var sampleParams = '?q=M%C3%BCnchen,DE&appid=b1b15e88fa797225412429c1c50c122a1'	
//actual params for bangalore city
var baseUrl = 'http://api.openweathermap.org/data/2.5/forecast';
var params = '?q=Bangalore,in&appid=49d8e7beea1072b01928c38091bb31aa&units=metric';

// route that specifies the max and min temperature of the day and the time of occurence.
app.get('/weather', function (req, res) {
  request(sampleUrl + sampleParams, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(body);
    var weatherDataList = data["list"];
    weatherResults = calculateTemperature(weatherDataList);
    res.send(weatherResults);
  } else {
  	console.log('some error from weather api');
  }
  })
})

// route that gives temperature in asc sorted manner
app.get('/weather/sorted', function (req, res) {
  request(sampleUrl + sampleParams, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(body);
    var weatherDataList = data["list"];
    weatherSortedResults = sortTemperatures(weatherDataList);
    res.send(weatherSortedResults);
  } else {
  	console.log('some error from weather api');
  }
  })
})

// function to calculate min,max temperature for a given day.
function calculateTemperature(weatherDataList) {
    var weatherResults = {};
    for (var index in weatherDataList) {
    	weatherData = weatherDataList[index];

    	var time = weatherData["dt"];
    	var date = new Date(time*1000);
    	var dateKey = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    	var dateTimeKey = dateKey + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    	var maxTemperature = weatherData["main"]["temp_max"];
    	var minTemperature = weatherData["main"]["temp_min"];
    	if (!weatherResults[dateKey]) {
    		weatherResults[dateKey] = {};		
    		weatherResults[dateKey]["min"] = {
    			"temperature" : minTemperature,
    			"time" : dateTimeKey
    		}
    		weatherResults[dateKey]["max"] = {
    			"temperature" : maxTemperature,
    			"time" : dateTimeKey
    		}
    	} else {
    		if (minTemperature < weatherResults[dateKey]["min"]["temperature"]) {
    			weatherResults[dateKey]["min"]["temperature"] = minTemperature;
    			weatherResults[dateKey]["min"]["time"] = dateTimeKey;	
    		}
    		if (maxTemperature > weatherResults[dateKey]["max"]["temperature"]) {
    			weatherResults[dateKey]["max"]["temperature"] = maxTemperature;
    			weatherResults[dateKey]["max"]["time"] = dateTimeKey;	
    		}
    	}
    }
    
    return weatherResults;
}

//function to return temperatures in asc order
function sortTemperatures(weatherDataList) {
	weatherDataList.sort(temperatureCompare)
	weatherResults = {};
	for (index in weatherDataList) {
		weatherData = weatherDataList[index];
		var time = weatherData["dt"];
    	var date = new Date(time*1000);
    	var dateKey = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    	var dateTimeKey = dateKey + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    	if (!weatherResults[dateKey]) {
    		weatherResults[dateKey] = [];
    	}
    	weatherObj = {
    		"temperature": weatherData['main']['temp'],
    		"time": dateTimeKey
    	};
    	weatherResults[dateKey].push(weatherObj);
	}
	return weatherResults;
}

//function to compare temperatures
function temperatureCompare(weatherA, weatherB) {
	return (weatherA['main']['temp'] - weatherB['main']['temp']);
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
