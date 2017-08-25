var APP = null;
var MapApplication = function() {
	this.mapView = null;
	this.markerClicked = null;
	this.singleSite = null;
	this.lastSubmittedData = null;
};

//=========================================================================
// Initialization

MapApplication.prototype.initApp = function() {
	// create a new map view
	this.initMapView();
	// load the initial set of sites
	this.fetchSites();
	// load the initial set of projects to display in the banner
	this.fetchBannerData();
};

MapApplication.prototype.initMapView = function() {
	HELPER.DEBUG_LOG("Loading MapView...");
	this.mapView = new MapView();
};

//=========================================================================
// Fetch and receive all sites

MapApplication.prototype.fetchSites = function(postData) {
	// validate input
	if (postData == null || postData == undefined) {
		postData = HELPER.getSitesRequestData();
	}
	
	// pass the REST helper a JSON stringified payload to get all sites
	REST_TALKER.getSites(JSON.stringify(postData));

	// save this data for use in single site, multi site requests
	this.lastSubmittedData = postData;
};

MapApplication.prototype.onSitesReceived = function(data) {
	// update the form based on the payload received from the server
	FORM_WRITER.write(data);

	// clear any data currently plotted on the map
	this.mapView.clearData();
	// plot the data received from the server
	this.mapView.plotData(data);

	// hide the loading animation
	FORM.setSpinnerVisibility(false);
};

//=========================================================================
// Fetch and receive single site

MapApplication.prototype.fetchSiteData = function(postData) {
	if (postData == null || postData == undefined) {
		HELPER.ERROR_LOG("Invalid data provided to APP.fetchSiteData!");
		return;
	}

	// pass the REST helper a JSON stringified payload to get a single site
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
	// create a new single site based on data received from the server
	this.singleSite = new SingleSite(this.markerClicked.get("siteID"));

	// ask the map view to create an info window
	// pass in the marker that was clicked
	// pass in the DOM content to be added to the info window
	this.mapView.handleClickOnMarker(this.markerClicked, this.singleSite.getSingleSiteContent(data));
	// delete the reference to the marker
	this.markerClicked = null;
};

//=========================================================================
// Fetch and receive project data for a single site

MapApplication.prototype.fetchProjectData = function(postData) {
	if (postData == null || postData == undefined) {
		HELPER.ERROR_LOG("Invalid data provided to APP.fetchProjectData!");
		return;
	}

	// pass the REST helper a JSON stringified payload to get a single site's project data
	REST_TALKER.getProjectData(JSON.stringify(postData));
};

MapApplication.prototype.onProjectDataReceived = function(data) {
	if (this.singleSite == null) {
		HELPER.ERROR_LOG("APP.onProjectDataReceived could not find the current single site!");
		return;
	}

	// ask the single site to update its content to show the project data received from the server
	this.singleSite.showProjectData(data);
};

//=========================================================================
// Fetch a download link for a single site's data

MapApplication.prototype.downloadSiteData = function(postData) {
	if (postData == null || postData == undefined) {
		HELPER.ERROR_LOG("Invalid data provided to APP.downloadSiteData!");
		return;
	}

	// pass the REST helper a JSON stringified payload to download a single site's data
	REST_TALKER.downloadSiteData(JSON.stringify(postData));
};

MapApplication.prototype.onSiteDataReadyForDownload = function(data) { 
	if (this.singleSite == null) {
		HELPER.ERROR_LOG("APP.onSiteDataDownloaded could not find the current single site!");
		return;
	}

	// ask the single site to invoke a download dialog based on data received from the server
	this.singleSite.showDownloadDataLink(data);
};

//=========================================================================
// Fetch a download link for all site's data

MapApplication.prototype.downloadMultiSiteData = function(postData) {
	if (postData == null || postData == undefined) {
		HELPER.ERROR_LOG("Invalid data provided to APP.downloadMultiSiteData!");
		return;
	}

	// pass the REST helper a JSON stringified payload to download all relevant site data
	REST_TALKER.downloadMultiSiteData(JSON.stringify(postData));
};

MapApplication.prototype.onMultiSiteDataReadyForDownload = function(data) {
	// ask the helper to invoke a download dialog based on data received from the server
	HELPER.showMultiSiteDownloadLink(data);
};

//=========================================================================
// Fetch project data for the banner 

MapApplication.prototype.fetchBannerData = function() {
	REST_TALKER.fetchBannerData();
};

MapApplication.prototype.onBannerDataReceived = function(data) {
	BANNER.initBanner(data);
};

//=========================================================================
// Click event handlers

MapApplication.prototype.onMapClicked = function() {
	// delete any previously held single site
	if (APP.singleSite) {
		APP.singleSite = null;
	}

	// safety net
	if (APP.mapView) {
		// pass this event on to the map view
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
	// save a reference to the marker that was clicked for later
	APP.markerClicked = this;

	// ask the helper for a site request payload 
	var postData = HELPER.getSitesRequestData();

	// ask the form reader to feed all the form data into the payload
	if (!FORM_READER.read(postData)) {
		// if a single field on the form was changed, 
		// we use the previously submitted data for the download request instead
		postData = APP.lastSubmittedData;
	}

	// extract the site's id that is stored inside this marker & store it into the payload
	postData.site_id = this.get("siteID");
	
	// ask the app to invoke a request for a single site's data
	APP.fetchSiteData(postData);
};

MapApplication.prototype.onOMSMarkerClicked = function(marker) {
	if (APP.markerClicked != null) {
		return;
	}
	// save a reference to the marker that was clicked for later
	APP.markerClicked = marker;

	// ask the helper for a site request payload 
	var postData = HELPER.getSitesRequestData();
	// extract the site's id that is stored inside this marker & store it into the payload
	postData.site_id = marker.get("siteID");

	// ask the form reader to feed all form data into the payload
	FORM_READER.read(postData);

	// ask the app to invoke a request for a single site's data
	APP.fetchSiteData(postData);
};

MapApplication.prototype.onProjectButtonClicked = function(buttonID) {
	var prefix = 'btn-project-';
	// extract the project's id from the button
	var projectID = buttonID.substring(prefix.length, buttonID.length);

	// create a payload for a single project request
	var postData = { "project_id": projectID };
	// ask the app to invoke a request for a single project's data
	APP.fetchProjectData(postData);
};

MapApplication.prototype.onProjectBackButtonClicked = function() {
	if (APP.singleSite == null) {
		HELPER.ERROR_LOG("APP.onProjectBackButtonClicked could not find the current single site!");
		return;
	}
	// ask the single site to clear project data and show sample information
	this.singleSite.showSingleSiteData();
};

MapApplication.prototype.onDownloadDataButtonClicked = function(buttonID) {
	var prefix = 'btn-download-data-';
	// extract the site id from the button
	var siteID = buttonID.substring(prefix.length, buttonID.length);
	HELPER.DEBUG_LOG("Download data for ProjectID:" + siteID);

	// ask the helper for a site data download payload
	var postData = HELPER.getSitesRequestData();
	// save this site's id into the payload
	postData.site_id = siteID;
	
	// ask the form reader to feed all form data into the payload
	FORM_READER.read(postData);

	// ask the app to invoke a request for a single site's data
	APP.downloadSiteData(postData);
};

MapApplication.prototype.onBannerProjectClicked = function(elementID) {
	var prefix = 'btn-banner-'
	// extract the project id from the element
	FORM.submittedProjectID = elementID.substring(prefix.length, elementID.length);
	HELPER.DEBUG_LOG("Fetching sites for ProjectID:" + FORM.submittedProjectID);

	// ask the helper for a sites payload 
	var postData = HELPER.getSitesRequestData();
	// save this project's id into the payload
	postData.project_id = FORM.submittedProjectID;

	// ask the app to invoke a request for all sites
	APP.fetchSites(postData);

	// show the loading animation
	FORM.setSpinnerVisibility(true);

	// enable the option to download
	FORM.setDownloadButtonDisabled(false);

	// this flag is used by other modules such as the FormReader
	FORM.hasBeenSubmitted = true;
};

//=========================================================================
// Global onload handlers

window.onload = function() {
	// create the helper first because it initializes the custom log function
	HELPER = new Helper();

	// we can only proceed if the Google Maps API loaded successfully
	if (didGoogleMapsAPILoad) {
		FORM = new Form();
		FORM_WRITER = new FormWriter();
		FORM_READER = new FormReader();
		REST_TALKER = new RESTTalker();
		APP = new MapApplication();
		BANNER = new Banner();
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
	
	// create and load OMS
	// for some reason, OMS MUST be loaded AFTER the Google Maps API has loaded
	var omsScript = document.createElement('script');
	omsScript.type = 'text/javascript';
	omsScript.src = 'lib/oms.min.js';
	document.getElementsByTagName('head')[0].appendChild(omsScript);
}
