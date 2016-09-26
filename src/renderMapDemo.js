/*
Test URL: http://localhost/~karan/SGD01/
*/

var RenderMapDemo = function() {
	this.testURL = "http://wateriso.utah.edu/api/sites.php";	//"data/sites_02.json";		//"http://wateriso.utah.edu/api/sites.php";
	this.jsonData = null;

	this.countriesURL = "http://wateriso.utah.edu/api/countries.php";		//"http://wateriso.utah.edu/api/countries.php";
	this.countries = null;

	this.mapView = null;
	this.form = new Form();
};

RenderMapDemo.prototype.initOpenLayersView = function() {
	console.log("Loading OpenLayersView...");
	this.mapView = new OpenLayersView();
	this.mapView.initView();
};

RenderMapDemo.prototype.initGoogleMapsView = function() {
	console.log("Loading GoogleMapsView...");
	this.mapView = new GoogleMapsView();
	this.mapView.initView();
};

RenderMapDemo.prototype.fetchJSON = function() {
	$.ajax({
		type: 'GET',
		url: this.testURL,
		contentType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if (data.status.Code == 200) {
				renderMapDemo.onJSONReceived(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message);
			}
		},
		error: function() {
			console.log("Something went wrong...");
		}
	});
};

RenderMapDemo.prototype.onJSONReceived = function(data) {
	this.jsonData = data;
	this.mapView.plotData(this.jsonData);
	this.form.init();
};

RenderMapDemo.prototype.fetchCountries = function() {
	$.ajax({
		type: 'GET',
		url: this.countriesURL,
		contentType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if (data.status.Code == 200) {
				renderMapDemo.onCountriesReceived(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message);
			}
		},
		error: function() {
			console.log("Something went wrong...");
		}
	});
};

RenderMapDemo.prototype.onCountriesReceived = function(countries) {
	this.countries = countries.countries;
	var selectCountries = $("#select-country");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < this.countries.length; ++i) {
		var country = this.countries[i];
		selectCountries.append($("<option></option>")
			.text(country["Country"]));
	}
}

var renderMapDemo = null;
window.onload = function() {

	if (didGoogleMapsAPILoad) {
		renderMapDemo = new RenderMapDemo();
		
		// parse the URL for viewType
		if (window.location.href.indexOf("viewType=ol") != -1) {
			renderMapDemo.initOpenLayersView();
		}
		else if (window.location.href.indexOf("viewType=goog") != -1) {
			renderMapDemo.initGoogleMapsView();
		}
		else {
			console.log("Received unknown view type in URL:" + window.location.href);
			renderMapDemo.initOpenLayersView();
		}

		renderMapDemo.fetchJSON();
		renderMapDemo.fetchCountries();
		console.log("Loaded render map demo...");
	}
	else {
		console.log("Google Maps API failed to load...");
	}
}

var didGoogleMapsAPILoad = false;
function onGoogleMapsAPILoaded() {
	console.log("Google maps API loaded...");
	didGoogleMapsAPILoad = true;
}
