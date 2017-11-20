const DATASET_WEATHER = "";
var map;
var markerUniversity;

var todaysTemp = {"TMAX":0,"TMIN":0,"TAVG":0}, todaysWeather = [];

function weatherData(){
	var dayTemp, dayWeather;
	if(todaysWeather.length==0){
		$.ajax({
			url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets/GHCND",
			data: "data",
			headers: {token: "aFuOSLweUcPchzMAvxAEGqCqEmhVOHAE"},
			success:function(result){
				var auxDay = new Date(result.maxdate);   //Gets the date of the most recent data
		        var day;
		        if (auxDay.getDate() < 10){
		          day = "0" + (auxDay.getDate());
		        }else{
		          day = auxDay.getDate();
		        }
		        dayTemp = auxDay.getFullYear() + "-" + (auxDay.getMonth()+1) + "-" + day;
		        getTempData(dayTemp);
		        if (auxDay.getDate()-1 < 10){
		          day = "0" + (auxDay.getDate()-1);
		        }else{
		          day = auxDay.getDate()-1;
		        }
		        dayWeather = auxDay.getFullYear()+"-"+(auxDay.getMonth()+1)+"-"+day;
		        getWeatherData(dayWeather);
			}
		})
	}

}


function initWeatherData(){
  var tempDate, weatherDate;
  console.log("holo");
  if(todaysWeather.length === 0){
    $.ajax({
      url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets/GHCND",
      data: "data",
      headers:{token: "aFuOSLweUcPchzMAvxAEGqCqEmhVOHAE"},
      success: function(result){
      	console.log("holo2");
        var auxDate = new Date(result.maxdate);   //Gets the date of the most recent data
        var day;
        if (auxDate.getDate() < 10){
          day = "0" + (auxDate.getDate());
        }else{
          day = auxDate.getDate();
        }
        tempDate = auxDate.getFullYear()+"-"+(auxDate.getMonth()+1)+"-"+day;
        getTempData(tempDate);
        if (auxDate.getDate()-1 < 10){
          day = "0" + (auxDate.getDate()-1);
        }else{
          day = auxDate.getDate()-1;
        }
        weatherDate = auxDate.getFullYear()+"-"+(auxDate.getMonth()+1)+"-"+day;
        getWeatherData(weatherDate);
      }
    })
  }
}

function getTempData(date){
  $.ajax({            // Here we get data of average temperature, max. temperature and min. temperature
    url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=FIPS:36&datatypeid=TMIN,TMAX,TAVG&startdate="+ date+"&enddate=" + date + "&limit=1000",
    data: "data",
    headers:{token: "aFuOSLweUcPchzMAvxAEGqCqEmhVOHAE"},
    success: function(result){    // And here we get the mean of all that data
      var n = result.metadata.resultset.count;
      for(var i = 0; i < n; i++){
        todaysTemp[result.results[i].datatype]+=result.results[i].value;
      }
      for(var t in todaysTemp){
        todaysTemp[t] /= (n/3);
        todaysTemp[t] = (todaysTemp[t] - 32)* (5/9);  // we also parse it to Celcius (This ain't US!)
        todaysTemp[t] = Math.round(todaysTemp[t] * 10)/ 10;
      }
    }
  })
}

function getWeatherData(date){
  $.ajax({    //Gets data of weather in previous days
    url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes?datasetid=GHCND&locationid=FIPS:36&startdate="+ date+"&enddate=" + date,
    data: "data",
    headers:{token: "ngryDvgFvKkUIbrhfGsDJAvTXFpQLrrC"},
    success: function(result){
      var n = result.metadata.resultset.count;
      for(var i = n-1; i >= 0; i--){
        if( result.results[i].id.indexOf("WT") != -1 ){
          todaysWeather.push(result.results[i].name);
        }else if(result.results[i].id.indexOf("WV") != -1){
          continue;
        }else{
          break;
        }
      }
    }
  })
}

function updateWeatherPanel(){
  $("#tMax").html("\t" + todaysTemp.TMAX);
  $("#tMin").html("\t" + todaysTemp.TMIN);
  $("#tAvg").html("\t" + todaysTemp.TAVG);


  var list = $("#currentWeatherList").empty();
  list.append("<ul></ul>").find("ul");
  for (x in todaysWeather) {
    list.append("<li><span>" + todaysWeather[x] + "</span></li>");
  }
}

function retraso(){

  setTimeout(function(){
    $("#weatherOption").prop("disabled", false);
  },3000);
}

function hide (elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'none';
  }
}
function show (elements, specifiedDisplay) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = specifiedDisplay || 'block';
  }
}
function options(){
	if(document.getElementById("universityOption").checked == true)
		markerUniversity.setMap(map);
	else
		markerUniversity.setMap(null);
	if(document.getElementById("weatherOption").checked == true){
		updateWeatherPanel();
		hide(document.getElementById("optionsPanel"));
		show(document.getElementById("weatherPanel"));
	}
	else{
		show(document.getElementById("optionsPanel"));
		hide(document.getElementById("weatherPanel"));
	}
};

function myMap() {
var styledMapType = new google.maps.StyledMapType(
           [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#72afb6"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#c19879"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "weight": 5
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#416870"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#72afb6"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#305054"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8168a8"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
],
            {name: 'Styled Map'});

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7291, lng: -73.9965},
          zoom: 11,
          mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
        });

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        	var icon = {
		url: "img/university.png",
	    scaledSize: new google.maps.Size(30, 30), // scaled size
	    origin: new google.maps.Point(0,0), // origin
	    anchor: new google.maps.Point(0, 0) // anchor	

	};

	markerUniversity = new google.maps.Marker({ //Line 1
		position: {lat: 40.7291, lng: -73.9965}, //Line2: Location to be highlighted
		map: map,//Line 3: Reference to map object
		icon: icon
	});
}
$(document).ready(function(){
	myMap();
	retraso();
	weatherData();
	updateWeatherPanel();
	hide(document.getElementById("weatherPanel"));
});