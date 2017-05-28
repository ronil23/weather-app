# weather-app
Provides max/min temperature for the day
Provides a temperature plot against time for 5 days.
Provides a sorted temperature list day wise.

## about
App is built using express.js and uses charts.js for the graphs. 
It uses https://openweathermap.org/api for the weather data.

## Starting the app


## list of available routes:

/api/temperature          : Gives the max and min temperature for a day

/api/temperature/sorted   : Gives ascendingly sorted values for temperature for days

/view/temperature         : Gives the max and min temperature of the day view

/view/temperature/plot    : Gives the temperature vs time plot for the readings provided by the weather api
