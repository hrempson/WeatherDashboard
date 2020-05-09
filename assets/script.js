$(".btn").on("click", function (event) {
    event.preventDefault();
    var city = $(".search").val();
    var apiKey = "b0a1c026a3e75b564efaab3bbd39bf04";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    
// AJAX call to get weather info
console.log(city);
console.log(queryURL);
$.ajax({
        url: queryURL,
        method: "GET"
    })
// Store the retrieved data in "response"
    .then(function (response) {
            console.log(queryURL);
            console.log(response);
    
            var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            // Transfer content to HTML
            $(".city").html("<h1>" + response.name + "</h1>");
            $(".icon").attr("src", iconURL);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
            
$.ajax({
    url: queryURL,
    method: "GET"
    })

    .then(function (response) {
        
}

            
            // $(".uvIndex").text("UV Index: " + response.)
            // $(".temp").text("Temperature (K) " + response.);
    })
})