var cityNameCarrier = '';
var cityName = '';
var num = 0;

var searchedArray = [];

if (JSON.parse(localStorage.getItem('searchedArray')) != null) {
    searchedArray = JSON.parse(localStorage.getItem('searchedArray'));
    $('#history').empty();
    for (var a = 0; a < searchedArray.length; a++) {
        var button = $('<button>');
        button.text(searchedArray[a]);
        button.addClass('list-button');
        button.attr('id', a);
        button.on('click', function (event) {
            cityName = event.target.innerHTML;
            searchedArray.splice(searchedArray.indexOf(cityName),1);
            searchedArray.unshift(cityName);
            $('#history').empty();
            for (var a = 0; a < searchedArray.length; a++) {
                var button = $('<button>');
                button.text(searchedArray[a]);
                button.addClass('list-button');
                button.attr('id', a);
                $('#history').append(button);
            }
            getData(cityName);   
            });
        $('#history').append(button);
    }
    
    getData(searchedArray[0]);
};



$('#search-input').on('input', function (event) {
    event.preventDefault();
    cityNameCarrier = event.target.value;
})

$('#search-button').on('click', function (e) {
    e.preventDefault();
    cityName = cityNameCarrier;
    if (!searchedArray.includes(cityName)) {
        searchedArray.unshift(cityName);
        localStorage.setItem('searchedArray', JSON.stringify(searchedArray));
    } else if (searchedArray != '') {
        searchedArray.splice(searchedArray.indexOf(cityName),1);
        searchedArray.unshift(cityName);
        localStorage.setItem('searchedArray', JSON.stringify(searchedArray));
    }
    if (cityName == '') {
        alert('Empty value, please enter again.');
        searchedArray.pop();
        localStorage.setItem('searchedArray', JSON.stringify(searchedArray));
    } else {
        getData(cityName);
    }
    $('#search-input').val('');    

    $('#history').empty();

    for (var a = 0; a < searchedArray.length; a++) {
        var button = $('<button>');
        button.text(searchedArray[a]);
        button.addClass('list-button');
        button.attr('id', a);
        button.on('click', function (event) {
            cityName = event.target.innerHTML;
            searchedArray.splice(searchedArray.indexOf(cityName),1);
            searchedArray.unshift(cityName);
            $('#history').empty();
            for (var a = 0; a < searchedArray.length; a++) {
                var button = $('<button>');
                button.text(searchedArray[a]);
                button.addClass('list-button');
                button.attr('id', a);
                addListButton();
                $('#history').append(button);
            }
            getData(cityName);   
            });
        $('#history').append(button);
    }

});

// Get coordinates of country by country name

function getData(cityName) {
    
    var baseUrlForCountry = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=100&appid=9d7f5341bd0fb68875264e69f841ba60';
    var latitude = 0;
    var longitude = 0;

    $.ajax({
        url: baseUrlForCountry,
        method: 'GET'
    }).then(function(response){
        if (response == '') {
            alert('Your chosen city does not exist in our data, please try another.');
            searchedArray.shift();
            localStorage.setItem('searchedArray', JSON.stringify(searchedArray));
            $('#history').find(':first-child').remove();

        } else {
            for (var a = 0; a < 5; a++) {
                if (response[a].local_names.en == cityName) {
                    latitude = response[a].lat;
                    longitude = response[a].lon;
                    a = 5;
                };
                
            }
            
            // use coordinates to access main API date

            var baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=9d7f5341bd0fb68875264e69f841ba60';
            
            $.ajax({
                url: baseUrl,
                method: 'GET'
            }).then(function(newResponse){
                console.log(newResponse);
                if (newResponse.city.name == cityName) {
                    
                    
                    today = moment().format('D/MM/YYYY');
                    $('#today-header').text(cityName + " (" + today + ")");
                    
                    var i = $('<i>');
                    if (newResponse.list[0].weather[0].main == 'Rain') {
                        i.addClass('fa fa-umbrella');
                    } else if (newResponse.list[0].weather[0].main == 'Clouds') {
                        i.addClass('fa fa-cloud');
                    } else {
                        i.addClass('fa fa-sun-o');
                    }                    
                    $('#today').append(i);

                    $('#today-temp').text('Temp: ' + newResponse.list[0].main.temp + ' Celcius');
                    $('#today-wind').text('Wind: ' + newResponse.list[0].wind.speed + ' KPH');
                    $('#today-humidity').text('Humidity: ' + newResponse.list[0].main.humidity + '%');

                    $('#forecast-holding-div').empty();
                    
                    for (var a = 0; a < 5; a++) {
                        var newDate = moment().add(a, "days").format('D/MM/YYYY');
                        console.log(newDate);

                        var div = $('<div>');

                        var i = $('<i>');
                        if (newResponse.list[0].weather[0].main == 'Rain') {
                            i.addClass('fa fa-umbrella');
                        } else if (newResponse.list[0].weather[0].main == 'Clouds') {
                            i.addClass('fa fa-cloud');
                        } else {
                            i.addClass('fa fa-sun-o');
                        }                    
                        
                        div.addClass('forecast-divs bg-dark p-1');
                        var spanOne = $('<span>');
                        spanOne.text(newDate);
                        var spanTwo = $('<span>');
                        var spanThree = $('<span>');
                        var spanFour = $('<span>');
                        spanTwo.text('Temp: ' + newResponse.list[0].main.temp + ' Celcius');
                        spanThree.text('Wind: ' + newResponse.list[0].wind.speed + ' KPH');
                        spanFour.text('Humidity: ' + newResponse.list[0].main.humidity + '%');
                        $('#forecast-holding-div').append(div);
                        $('#div').append(i);
                        $(div).append(spanOne);
                        $(div).append(spanTwo);
                        $(div).append(spanThree);
                        $(div).append(spanFour);
                    }
                } 
                cityName = '';
                latitude = 0;
                longitude = 0;
            });
        }
    });

}; 
