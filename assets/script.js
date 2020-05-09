// Global Variables
var lat = null;
var lon = null;
var apiKey = 'b0a1c026a3e75b564efaab3bbd39bf04';
var city = null;

$ ('.btn').on ('click', function (event) {
  event.preventDefault ();
  city = $ ('.search').val ();
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // AJAX call to get weather info
  console.log (city);
  console.log (queryURL);
  $.ajax ({
    url: queryURL,
    method: 'GET',
  })
    // Store the retrieved data in "response"
    .then (function (response) {
      console.log (queryURL);
      console.log (response);

      var iconURL = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
      var tempF = (response.main.temp - 273.15) * 1.80 + 32;
      var date = response.dt;

      // Transfer content to HTML
      $ ('.city').html ('<h1>' + response.name + '</h1>');
      $ ('.date').text (date.toString ());
      $ ('.icon').attr ('src', iconURL);
      $ ('.humidity').text ('Humidity: ' + response.main.humidity);
      $ ('.wind').text ('Wind Speed: ' + response.wind.speed);
      $ ('.tempF').text ('Temperature (F) ' + tempF.toFixed (2));

      lon = response.coord.lon;
      lat = response.coord.lat;

      // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}
      if (lon === null || lat === null) {
        throw new Error (`lon=${lon} && lat=${lat} one of these is null`);
      }
      var uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}`;
      $.ajax ({
        url: uvURL,
        method: 'GET',
      }).then (function (response) {
        var uvi = response.current.uvi;
        // Using Wikipedia Ultraviolet Index https://en.wikipedia.org/wiki/Ultraviolet_index
        if (uvi <= 3) {
          $ ('.uviValue').addClass ('badge-success');
          $ ('.uviValue').removeClass ('badge-danger');
          $ ('.uviValue').removeClass ('badge-warning');
        } else if (uvi > 3 && uvi < 6) {
          $ ('.uviValue').addClass ('badge-warning');
          $ ('.uviValue').removeClass ('badge-danger');
          $ ('.uviValue').removeClass ('badge-success');
        } else {
          $ ('.uviValue').removeClass ('badge-warning');
          $ ('.uviValue').addClass ('badge-danger');
          $ ('.uviValue').removeClass ('badge-success');
        }

        $ ('.uviValue').text (uvi);
      });

      var fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current&appid=${apiKey}`;

      if (lon === null || lat === null) {
        throw new Error (`lon=${lon} && lat=${lat} one of these is null`);
      }

      $.ajax ({
        url: fiveDayURL,
        method: 'GET',
      }).then (function (response) {
        // api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={your api key}

        // for loop to create Daily Weather Cards...
        // TODO: Bootstrap Grid System, or Flexbox layout...
        // Template literals with multiple lines https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        for (var i = 0; i < response.daily.length; i++) {
          var iconURL = `http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`;
          var temp = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
          $ ('.container-5-day').append (`
        <div class="card">
            <div class="card-body">
                <p class="card-title">${response.daily[i].dt}</p>
                <img src="${iconURL}">
                <p class="card-text">Temp: ${Number.parseFloat (temp).toPrecision (4)}</p>
                <p class="card-text">Humidity: ${response.daily[i].humidity}</p>
            </div>
        </div>`);
        }
      });
    });
});
