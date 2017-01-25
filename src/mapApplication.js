var APP = null;
var MapApplication = function() {
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
	if (HELPER.DEBUG_MODE) {
		HELPER.runDuplicateSearchTest(data);
	}

	FORM_WRITER.write(data);

	this.mapView.clearData();
	this.mapView.plotData(data);

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
