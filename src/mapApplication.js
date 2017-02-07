var APP = null;
var MapApplication = function() {
	this.mapView = null;
	this.markerClicked = null;
	this.singleSite = null;
};

MapApplication.prototype.initApp = function() {
	this.initMapView();
	this.fetchSites();
};

MapApplication.prototype.initMapView = function() {
	HELPER.DEBUG_LOG("Loading MapView...");
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
		HELPER.ERROR_LOG("Invalid data provided to APP.fetchSiteData!");
		return;
	}

	REST_TALKER.getSiteData(JSON.stringify(postData));
};

MapApplication.prototype.onSiteDataReceived = function(data) {
	if (this.mapView == null || this.mapView == undefined) {
		HELPER.ERROR_LOG("APP.onSiteDataReceived could not find a valid mapView!");
		return;
	}

	// delete any previously held single site
	if (this.singleSite) {
		this.singleSite = null;
	}
	this.singleSite = new SingleSite();

	this.mapView.handleClickOnMarker(this.markerClicked, this.singleSite.getSingleSiteContent(data));
	this.markerClicked = null;
};

MapApplication.prototype.fetchProjectData = function(postData) {
	if (postData == null || postData == undefined) {
		HELPER.ERROR_LOG("Invalid data provided to APP.fetchProjectData!");
		return;
	}

	REST_TALKER.getProjectData(JSON.stringify(postData));
};

MapApplication.prototype.onProjectDataReceived = function(data) {
	if (this.singleSite == null) {
		HELPER.ERROR_LOG("APP.onProjectButtonClicked could not find the current single site!");
		return;
	}

	this.singleSite.showProjectData(data);
};

MapApplication.prototype.onMapClicked = function() {
	// delete any previously held single site
	if (APP.singleSite) {
		APP.singleSite = null;
	}

	if (APP.mapView) {
		APP.mapView.handleClickOnMap(this);
	}
	else {
		HELPER.ERROR_LOG("APP.onMapClicked could not find a map view!");
	}
};

MapApplication.prototype.onMarkerClicked = function() {
	if (this.markerClicked != null) {
		return;
	}
	APP.markerClicked = this;

	var postData = HELPER.getSitesRequestData();
	postData.site_id = this.get("siteID");
	
	FORM_READER.read(postData);

	APP.fetchSiteData(postData);
};

MapApplication.prototype.onProjectButtonClicked = function(buttonID) {
	var prefix = 'btn-project-';
	var projectID = buttonID.substring(prefix.length, buttonID.length);

	var postData = { "project_id": projectID };
	APP.fetchProjectData(postData);
};

MapApplication.prototype.onProjectBackButtonClicked = function() {
	if (APP.singleSite == null) {
		HELPER.ERROR_LOG("APP.onProjectBackButtonClicked could not find the current single site!");
		return;
	}
	this.singleSite.showSingleSiteData();
};

MapApplication.prototype.onDownloadDataButtonClicked = function(buttonID) {
	var prefix = 'btn-download-data-';
	var projectID = buttonID.substring(prefix.length, buttonID.length);
	HELPER.DEBUG_LOG("Download data for ProjectID:" + projectID);
};

window.onload = function() {
	HELPER = new Helper();
	if (didGoogleMapsAPILoad) {
		FORM = new Form();
		FORM_WRITER = new FormWriter();
		FORM_READER = new FormReader();
		REST_TALKER = new RESTTalker();
		APP = new MapApplication();
		APP.initApp();

		HELPER.DEBUG_LOG("Loaded Map Application version:" + HELPER.version);
	}
	else {
		HELPER.ERROR_LOG("Google Maps API failed to load!");
	}
}

var didGoogleMapsAPILoad = false;
function onGoogleMapsAPILoaded() {
	didGoogleMapsAPILoad = true;
}
