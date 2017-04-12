/*
Google Maps API Key: AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk
*/

// save the zoom level based on which we decide to enable/disable OMS
var OMS_ENABLE_ZOOM_VIEW = 8;

var MapView = function() {
	// this is our Google Maps API key
	this.API_KEY = "AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk";
	this.map = null;
	this.markers = null;
	this.infoWindow = null;

	if (HELPER.ENABLE_OMS) {
		this.oms = null;
		this.omsEnabled = false;		
	}

	this.initView();
};

//=========================================================================
// Initialization

MapView.prototype.initView = function() {
	// create a new Google Maps Map
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 0, lng: 0 },
		zoom: 2,
		streetViewControl: false,
		rotateControl: false,
		scaleControl: false,
		fullscreenControl: false
	});
	// listen for click and zoom events
	this.map.addListener('click', APP.onMapClicked);
	this.map.addListener('zoom_changed', this.onZoomChanged);
	
	if (HELPER.ENABLE_OMS) {
		// create an OMS object
		this.oms = new OverlappingMarkerSpiderfier(this.map, {markersWontMove: true, markersWontHide: true});
	}
};

//=========================================================================
// OMS enabling/disabling

MapView.prototype.enableOMS = function() {
	// only enable if the global variable is set to true
	if (!HELPER.ENABLE_OMS) {
		return;
	}

	// only enable if we're not already enabled
	if (this.omsEnabled) {
		return;
	}
	this.omsEnabled = true;

	// for each marker,
	// clear its default event listener,
	// add it to OMS
	for (var i = 0; i < this.markers.length; ++i) {
		google.maps.event.clearInstanceListeners(this.markers[i]);
		this.oms.addMarker(this.markers[i]);
	}
	
	// add a click listener for all OMS markers
	this.oms.addListener('click', APP.onOMSMarkerClicked);

	HELPER.DEBUG_LOG("OMS Enabled");
};

MapView.prototype.disableOMS = function() {
	// only enable if the global variable is set to true
	if (!HELPER.ENABLE_OMS) {
		return;
	}

	// only disable if we're not already disabled
	if (!this.omsEnabled) {
		return;
	}
	this.omsEnabled = false;

	// remove click listeners for all OMS markers
	this.oms.clearListeners('click');
	// clear all OMS markers
	this.oms.clearMarkers();

	// add a click listener for each marker
	for (var i = 0; i < this.markers.length; ++i) {
		this.markers[i].addListener('click', APP.onMarkerClicked);
	}

	HELPER.DEBUG_LOG("OMS Disabled");
};

//=========================================================================
// Plotting data on the map

MapView.prototype.plotData = function(data) {
	var numSitesPlotted = 0;

	// create an array of Google Maps Markers to hold each point in the payload
	this.markers = [];

	// create a marker for each site
	for (var i = 0; i < data.sites.length; ++i) {
		var site = data.sites[i];

		// only plot points that have valid latitude and longitude
		if (isNaN(parseFloat(site.Latitude)) || isNaN(parseFloat(site.Longitude)))
		{
			HELPER.ERROR_LOG("Found undefined Lat/Lon for site:" + site.Site_ID + " Lat:" + site.Latitude + " Lon:" + site.Longitude);
			continue;
		}

		// create a marker,
		// at the location we provided,
		// using the image we provided
		var marker = new google.maps.Marker({
			position: { lat: site.Latitude, lng: site.Longitude },
			icon: 'css/images/circle_10x10.png',
			map: this.map
		});
		// store into the marker, the ID of the site it represents
		// we use this information in the marker's click listener
		marker.set("siteID", site.Site_ID);
		// tell the marker we want to know when it has been clicked
		marker.addListener('click', APP.onMarkerClicked);
		// finally add it to our array
		this.markers.push(marker);

		++numSitesPlotted;
	}
	HELPER.DEBUG_LOG("Plotted " + numSitesPlotted + " sites...");
};

MapView.prototype.clearData = function(data) {
	// don't do anything if nothing to clear
	if (this.markers == null) {
		return;
	}

	// clear all markers from oms
	this.oms.clearMarkers();

	// loop all markers and set their maps to null
	// this will delete them
	for (var i = 0; i < this.markers.length; ++i) {
		this.markers[i].setMap(null);
	}
	// clear our list of markers
	this.markers.length = 0;
	this.markers = null;
};

//=========================================================================
// Click and zoom event handlers

MapView.prototype.onZoomChanged = function() {
	// only enable if the global variable is set to true
	if (!HELPER.ENABLE_OMS) {
		return;
	}

	// get the zoom level
	var zoomLevel = APP.mapView.map.getZoom();

	// decide whether we should enable/disable zoom
	if (zoomLevel > OMS_ENABLE_ZOOM_VIEW)
	{
		APP.mapView.enableOMS();
	}
	else
	{
		APP.mapView.disableOMS();
	}
};

MapView.prototype.handleClickOnMap = function(map) {
	this.deleteInfoWindow();
};

MapView.prototype.handleClickOnMarker = function(marker, contentString) {
	if (marker == null || contentString == "") {
		HELPER.ERROR_LOG("Invalid input provided to MapView.handleClickOnMarker!");
		return;
	}

	// delete any previously held info window
	this.deleteInfoWindow();

	// create a new info window for this site
	this.infoWindow = new google.maps.InfoWindow({
		content: contentString
	});

	this.infoWindow.open(this.map, marker);
};

MapView.prototype.deleteInfoWindow = function() {
	if (this.infoWindow == null || this.infoWindow == undefined) {
		return;
	}

	this.infoWindow.close();
};