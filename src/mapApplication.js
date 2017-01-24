var APP = null;
var MapApplication = function() {
	this.sitesData = null;
	this.countries = null;
	this.states = null;
	this.types = null;

	this.mapView = null;
	this.markerClicked = null;
};

MapApplication.prototype.initApp = function() {
	this.initMapView();
	this.fetchSites();
};

MapApplication.prototype.initMapView = function() {
	console.log("Loading MapView...");
	this.mapView = new MapView();
};

MapApplication.prototype.fetchSites = function(postData) {
	// validate input
	if (postData == null || postData == undefined) {
		postData = HELPER.getSitesRequestData();
	}
	
	REST_TALKER.getSites(JSON.stringify(postData));
};

MapApplication.prototype.onSitesReceived = function(data) {
	this.sitesData = data;

	if (HELPER.DEBUG_MODE) {
		HELPER.runDuplicateSearchTest(data);
	}

	this.extractLatLong(this.sitesData);
	this.extractCountries(this.sitesData);
	this.extractTypes(this.sitesData);
	this.extractCollectionDates(this.sitesData);
	this.extractElevation(this.sitesData);

	this.mapView.clearData();
	this.mapView.plotData(this.sitesData);

	FORM.setSpinnerVisibility(false);
};

MapApplication.prototype.fetchSiteData = function(postData) {
	if (postData == null || postData == undefined) {
		console.log("Invalid data provided to APP.fetchSiteData!");
		return;
	}

	REST_TALKER.getSiteData(JSON.stringify(postData));
};

MapApplication.prototype.onSiteDataReceived = function(data) {
	if (this.mapView == null || this.mapView == undefined) {
		console.log("APP.onSiteDataReceived could not find a valid mapView!");
		return;
	}

	if (HELPER.DEBUG_MODE && data.site_name == "") {
		console.log("Received empty data for site ID:" + this.markerClicked.get("siteID"));

		var contentString = "<div id=\'div-info-window-container\'>";
		contentString += '<p class="sample-site-name"><b>Received empty data for site ID: </b><br />' + this.markerClicked.get("siteID") + '</p>';

		this.mapView.handleClickOnMarker(this.markerClicked, contentString);
		this.markerClicked = null;
		return;
	}

	var contentString = HTML_WRITER.generateSiteContentString(data);
	this.mapView.handleClickOnMarker(this.markerClicked, contentString);
	this.markerClicked = null;
};

MapApplication.prototype.fetchProjectData = function(postData) {
	if (postData == null || postData == undefined) {
		console.log("Invalid data provided to APP.fetchProjectData!");
		return;
	}

	REST_TALKER.getProjectData(JSON.stringify(postData));
};

MapApplication.prototype.onProjectDataReceived = function(data) {
	var contentString = HTML_WRITER.generateProjectDataString(data);

	$('#div-info-window-container').html(contentString);
};

MapApplication.prototype.extractLatLong = function(data) {
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
	FORM.initLatLong(minLat, maxLat, minLong, maxLong);
};

MapApplication.prototype.extractCountries = function(data) {
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
	FORM.resetCountries();
	FORM.initCountries(this.countries);

	if (this.countries.length == 1) {
		this.states.sort();
		FORM.resetStates();
		FORM.initStates(this.states);
	}
};

MapApplication.prototype.extractTypes = function(data) {
	this.types = [];
	var numTypes = data.types.length;
	for (var i = 0; i < numTypes; ++i) {
		var type = data.types[i]["Type"];
		// validate data
		if (type != null && type != undefined) {
			this.types.push(type);
		}
	}
	FORM.resetTypes();
	FORM.initTypes(this.types);
};

MapApplication.prototype.extractCollectionDates = function(data) {
	var inputMaxDate = data.dates["Max"];
	var inputMinDate = data.dates["Min"];

	FORM.resetCollectionDates();
	FORM.initCollectionDates(inputMinDate, inputMaxDate);
};

MapApplication.prototype.extractElevation = function(data) {
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

	FORM.resetElevation();
	FORM.initElevation(minElevation, maxElevation);
};

MapApplication.prototype.onMapClicked = function() {
	if (APP.mapView) {
		APP.mapView.handleClickOnMap(this);
	}
};

MapApplication.prototype.onMarkerClicked = function() {
	if (this.markerClicked != null) {
		return;
	}
	APP.markerClicked = this;

	var postData = { "site_id": this.get("siteID") };
	APP.fetchSiteData(postData);
};

window.onload = function() {

	if (didGoogleMapsAPILoad) {
		HELPER = new Helper();
		FORM = new Form();
		FORM_WRITER = new FormWriter();
		FORM_READER = new FormReader();
		REST_TALKER = new RESTTalker();
		HTML_WRITER = new HTMLWriter();
		APP = new MapApplication();
		APP.initApp();

		console.log("Loaded Map Application version:" + HELPER.version);
	}
	else {
		console.log("Google Maps API failed to load!");
	}
}

var didGoogleMapsAPILoad = false;
function onGoogleMapsAPILoaded() {
	console.log("Google maps API loaded...");
	didGoogleMapsAPILoad = true;
}
