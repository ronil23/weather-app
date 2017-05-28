const express = require('express')
const app = express()
const request = require('request');
app.set('view engine', 'ejs');

//sample api params
var sampleUrl = 'http://samples.openweathermap.org/data/2.5/forecast';
var sampleParams = '?q=M%C3%BCnchen,DE&appid=b1b15e88fa797225412429c1c50c122a1'	

// route that specifies the max and min temperature of the day and the time of occurence.
app.get('/api/temperature', function (req, res) {
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

// route that specifies the max and min temperature of the day and the time of occurence.
app.get('/view/temperature', function (req, res) {
  request(sampleUrl + sampleParams, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(body);
    var weatherDataList = data["list"];
    var weatherResults = calculateTemperature(weatherDataList);
    var weatherViewData = redressToList(weatherResults);
    res.render('pages/temperature', {
      weatherData: weatherViewData
    });
  } else {
    console.log('some error from weather api');
  }
  })
})

// route that gives temperature in asc sorted manner
app.get('/api/temperature/sorted', function (req, res) {
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

// temperture plot
app.get('/view/temperature/plot', function (req, res) {
  
  request(sampleUrl + sampleParams, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var data = JSON.parse(body);
    var weatherDataList = data["list"];
    chartDataList = prepareChartData(weatherDataList);
    res.render('pages/temperature_plot', {
      'chartData': chartDataList["chartData"],
      'labelData': chartDataList["labelData"]
    });
    } else {
      console.log('some error from weather api');
    }
  })
})

// function to calculate min,max temperature for a given day.
function calculateTemperature(weatherDataList) {
    var weatherResults = {};
    for (var index in weatherDataList) {
    	var weatherData = weatherDataList[index];
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

//function to redress data for sending to view
function redressToList(weatherResults) {
  var dateKeys = Object.keys(weatherResults);
  var formattedWeatherResultsList = [];
  for (index in dateKeys) {
    weatherObj = {
      'min': weatherResults[dateKeys[index]]['min'],
      'max': weatherResults[dateKeys[index]]['max'],
      'day': dateKeys[index]
    }
    formattedWeatherResultsList.push(weatherObj);
  }
  return formattedWeatherResultsList;
}

//function to prepare chart data
function prepareChartData(weatherResults) {
  var labelData = [];
  var chartData = [];
  for (index in weatherResults) {
    weatherData = weatherResults[index];
    var time = weatherData["dt_txt"];
    weatherData = weatherResults[index];
    labelData.push(time);
    chartData.push(weatherData['main']['temp']);
  }
  return {
    'chartData': chartData,
    'labelData': labelData
  }
} 


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
