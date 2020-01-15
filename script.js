$(document).ready(function() {
    loadPage();

    $("#citySearchBtn").on("click", function() {
        var usrEntry = $("#citySearchTxt").val();
        console.log(usrEntry);
        if(!validateInput(usrEntry)) {
            console.log("invalid");
            return;
        } else {
            console.log("good");
            return;
        }
    });

    function loadPage() {
        if(localStorage.getItem("citySearchHistory") === null) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(yesUsrLocal, noUsrLocal);
                return;
            } else {
                noUsrLocal();
                return;
            }
        } else {
            loadCity();
            return;
        }
    }

    function searchCity() {

        return;
    }

    function loadCity() {
        var load = JSON.parse(localStorage.getItem("citySearchHistory"));
        getCity(load[0]);
        return;
    }

    function yesUsrLocal(response) {
        var city = coordinates(response);
        var cityName = getCity(city);
        saveCity(city, cityName);
        return;
    }

    function coordinates(response) {
        var latitude  = response.coords.latitude;
        var longitude = response.coords.longitude;
        var city = "lat="+latitude+"&lon="+longitude;
        return city;
    }

    function noUsrLocal() {
        var city = "lat=38.89037&lon=-77.03196";
        var cityName = getCity(city);
        saveCity(city, cityName);
        return;
    }

    function getCity(city) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?"+city+"&APPID=79b2eb263cef8df7e36fe34823251ff5",
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#curLocation").html("<h3>"+response.city.name+"</h3>");
            var currentDate = moment(response.list[0].dt_txt).format('MMMM Do');
            $("#curDate").html("<h3>"+currentDate+"</h3>");
            var kelvin = response.list[0].main.temp;
            var currentTemp = ((kelvin - 273.15)*1.8)+32;
            $("#curTemp").html("<h3>"+currentTemp.toFixed(2)+"°F</h3>");

            $("#curHumid").text(response.list[0].main.humidity+"%");
            $("#curWind").text(response.list[0].wind.speed+" MPH");
            
            var uvCoordinates = "lat="+response.city.coord.lat+"&lon="+response.city.coord.lon;
            getUV(uvCoordinates);
            var cityName = response.city.name;
            return cityName;
        });
    }

    function getUV(uvCoordinates) {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=79b2eb263cef8df7e36fe34823251ff5&"+uvCoordinates,
            method: "GET"
        }).then(function(response) {
            var uvIndex = response.value;
            $("#curUV").text(uvIndex);
            return;
        });
    }

    function saveCity(city, cityName){
        if(localStorage.getItem("citySearchHistory") !== null) {
            citySave = JSON.parse(localStorage.getItem("citySearchHistory"));
            citySave += [city, cityName];
            localStorage.setItem("citySearchHistory", JSON.stringify(citySave));
        } else {
            citySave = [city,cityName];
            localStorage.setItem("citySearchHistory", JSON.stringify(citySave));
        }
    }

    function validateInput(usrEntry) {
        if(!usrEntry.replace(/\s/g, '').length) {
            console.log("contains space / no data");
            return false;
        } else if(usrEntry.match(/[0-9]/g)) {
            console.log("contains numbers");
            return false;
        } else {
            return true;
        }
    }

});

/*
.html
curLocation
curDate
curTemp

.text
curHumid
curWind
curUV
*/