/*
Test URL: http://localhost/~karan/SGD01/
*/

var DEMO = null;
var RenderMapDemo = function() {
	this.sitesData = null;
	this.countries = null;
	this.states = null;
	this.types = null;

	this.helper = new Helper();
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

RenderMapDemo.prototype.fetchSites = function(postData) {
	// validate input
	if (postData == null || postData == undefined) {
		postData = this.helper.getSitesRequestData();
	}
	
	this.helper.getSites(JSON.stringify(postData));
};

RenderMapDemo.prototype.onSitesReceived = function(data) {
	this.sitesData = data;

	this.extractLatLong(this.sitesData);
	this.extractCountries(this.sitesData);
	this.extractTypes(this.sitesData);
	this.extractCollectionDates(this.sitesData);
	this.extractElevation(this.sitesData);

	this.mapView.clearData();
	this.mapView.plotData(this.sitesData);

	this.form.setSpinnerVisibility(false);
};

RenderMapDemo.prototype.fetchSiteData = function(postData) {
	if (postData == null || postData == undefined) {
		console.log("Invalid data provided to DEMO.fetchSiteData!");
		return;
	}

	this.helper.getSiteData(JSON.stringify(postData));
};

RenderMapDemo.prototype.onSiteDataReceived = function(data) {
	if (this.mapView == null || this.mapView == undefined) {
		console.log("DEMO.onSiteDataReceived could not find a valid mapView!");
		return;
	}

	this.mapView.handleClickOnMarker(data);
};

RenderMapDemo.prototype.extractLatLong = function(data) {
	var minLat = 90;
	var maxLat = -90;
	var minLong = 180;
	var maxLong = -180;

	var numSites = data.sites.length;
	for (var i = 0; i < numSites; ++i) {
		var lat = data.sites[i].Latitude;
		var lon = data.sites[i].Longitude;

		if (lat == null || lat == undefined || lon == null || lon == undefined) {
			continue;
		}

		minLat = (lat < minLat) ? lat : minLat;
		maxLat = (lat > maxLat) ? lat : maxLat;
		minLong = (lon < minLong) ? lon : minLong;
		maxLong = (lon > maxLong) ? lon : maxLong;
	}
	this.form.initLatLong(minLat, maxLat, minLong, maxLong);
};

RenderMapDemo.prototype.extractCountries = function(data) {
	this.countries = [];
	this.states = [];

	var numSites = data.sites.length;
	for (var i = 0; i < numSites; ++i) {
		var country = data.sites[i].Country;
		var state = data.sites[i].State_or_Province;

		// validate data
		if (country != null && country != undefined && this.countries.indexOf(country) < 0) {
			this.countries.push(country);
		}

		if (state != null && state != undefined && this.states.indexOf(state) < 0) {
			this.states.push(state);
		}
	}
	this.countries.sort();
	this.form.resetCountries();
	this.form.initCountries(this.countries);

	if (this.countries.length == 1) {
		this.states.sort();
		this.form.resetStates();
		this.form.initStates(this.states);
	}
};

RenderMapDemo.prototype.extractTypes = function(data) {
	this.types = [];
	var numTypes = data.types.length;
	for (var i = 0; i < numTypes; ++i) {
		var type = data.types[i]["Type"];
		// validate data
		if (type != null && type != undefined) {
			this.types.push(type);
		}
	}
	this.form.resetTypes();
	this.form.initTypes(this.types);
};

RenderMapDemo.prototype.extractCollectionDates = function(data) {
	var inputMaxDate = data.dates["Max"];
	var inputMinDate = data.dates["Min"];

	this.form.resetCollectionDates();
	this.form.initCollectionDates(inputMinDate, inputMaxDate);
};

RenderMapDemo.prototype.extractElevation = function(data) {
	var minElevation = 10000;
	var maxElevation = -10000;
	var numSites = data.sites.length;

	for (var i = 0; i < numSites; ++i) {
		var elevation = data.sites[i].Elevation_mabsl;
		if (elevation == null || elevation == undefined) {
			continue;
		}

		minElevation = (elevation < minElevation) ? elevation : minElevation;
		maxElevation = (elevation > maxElevation) ? elevation : maxElevation;
	}

	this.form.resetElevation();
	this.form.initElevation(minElevation, maxElevation);
};

RenderMapDemo.prototype.onMapClicked = function() {
	if (DEMO.mapView) {
		DEMO.mapView.handleClickOnMap(this);
	}
};

RenderMapDemo.prototype.onMarkerClicked = function() {
	var postData = { "site_id": this.get("siteID") };
	DEMO.fetchSiteData(postData);
	DEMO.mapView.handleClickOnMarker(this);
};

window.onload = function() {

	if (didGoogleMapsAPILoad) {
		DEMO = new RenderMapDemo();
		DEMO.form.init();
		
		// parse the URL for viewType
		if (window.location.href.indexOf("v=ol") != -1) {
			DEMO.initOpenLayersView();
		}
		else if (window.location.href.indexOf("v=gm") != -1) {
			DEMO.initGoogleMapsView();
		}
		else {
			console.log("Received unknown view type in URL:" + window.location.href);
			DEMO.initGoogleMapsView();
		}

		DEMO.fetchSites();
		console.log("Loaded render map demo v" + HELPER.version + "...");
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
