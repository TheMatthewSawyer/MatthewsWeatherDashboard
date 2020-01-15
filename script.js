var citySave  = [];

$(document).ready(function() {
    loadPage();

    $("#citySearchBtn").on("click", function() {
        var usrEntry = $("#citySearchTxt").val();
        if(!validateInput(usrEntry)) {
            console.log("invalid");
            return;
        } else {
            searchCity(usrEntry);
            return;
        }
    });

    $(document).on("click", ".historyOption", function() {
        var load = JSON.parse(localStorage.getItem("citySearchHistory"));
        getCity(load[$(this).attr('id')][0]);
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

    function searchCity(usrEntry) {
        var pre ="q=";
        usrEntry = pre + usrEntry;
        getCity(usrEntry);
        return;
    }

    function loadCity() {
        console.log("yep");
        var load = JSON.parse(localStorage.getItem("citySearchHistory"));
        getCity(load[0][0]);
        return;
    }

    function yesUsrLocal(response) {
        var latitude  = response.coords.latitude;
        var longitude = response.coords.longitude;
        var city = "lat="+latitude+"&lon="+longitude;
        getCity(city);
        return;
    }

    function noUsrLocal() {
        var city = "lat=38.89037&lon=-77.03196";
        getCity(city);
        return;
    }

    function getCity(city) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?"+city+"&units=imperial&APPID=79b2eb263cef8df7e36fe34823251ff5",
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#curLocation").html("<h3>"+response.city.name+"</h3>");
            var currentDate = moment(response.list[0].dt_txt).format('MMMM Do');
            $("#curDate").html("<h3>"+currentDate+"</h3>");
            $("#curTemp").html("<h3>"+response.list[0].main.temp+" °F</h3>");

            $("#curHumid").text(response.list[0].main.humidity+"%");
            $("#curWind").text(response.list[0].wind.speed+" MPH");
            
            var uvCoordinates = "lat="+response.city.coord.lat+"&lon="+response.city.coord.lon;
            getUV(uvCoordinates);
            
            saveCity(uvCoordinates, response.city.name);
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
            for(var i = 0; i < citySave.length; i++) {
                if(citySave[i][1] === cityName) {
                    loadSearchHistory();
                    return;
                }
            }
            citySave.unshift([city, cityName]);
            localStorage.setItem("citySearchHistory", JSON.stringify(citySave));
        } else {
            citySave.unshift([city, cityName]);
            localStorage.setItem("citySearchHistory", JSON.stringify(citySave));
        }
        loadSearchHistory();
        return;
    }

    function loadSearchHistory() {
        var load = JSON.parse(localStorage.getItem("citySearchHistory"));
        var tmp = "";
        for(var i = 0; i < load.length; i++) {
            tmp += "<button class='historyOption' id='"+i+"'>";
            tmp += load[i][1];
            tmp += "</button>"
        }
        $("#searchHistory").html(tmp);
        return;
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
searchHistory
*/