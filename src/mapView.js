/*
Google Maps API Key: AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk
*/

var MapView = function() {
	this.API_KEY = "AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk";
	this.map = null;
	this.markers = null;
	this.infoWindow = null;

	this.initView();
};

MapView.prototype.initView = function() {
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 0, lng: 0 },
		zoom: 2,
		streetViewControl: false,
		rotateControl: false,
		scaleControl: false,
		fullscreenControl: false
	});
	this.map.addListener('click', APP.onMapClicked);
};

MapView.prototype.plotData = function(data) {
	var numSitesPlotted = 0;

	// for each point that must be plotted, create a marker
	this.markers = [];
	for (var i = 0; i < data.sites.length; ++i) {
		var site = data.sites[i];
		// only plot points that have valid data
		if (isNaN(parseFloat(site.Latitude)) || isNaN(parseFloat(site.Longitude)))
		{
			console.log("Found undefined Lat/Lon for site:" + site.Site_ID + " Lat:" + site.Latitude + " Lon:" + site.Longitude);
			continue;
		}

		var marker = new google.maps.Marker({
			position: { lat: site.Latitude, lng: site.Longitude },
			icon: 'css/images/circle_10x10.png',
			map: this.map
		});
		marker.set("siteID", site.Site_ID);
		marker.addListener('click', APP.onMarkerClicked);
		this.markers.push(marker);

		++numSitesPlotted;
	}
	console.log("Plotted " + numSitesPlotted + " sites...");
};

MapView.prototype.clearData = function(data) {
	if (this.markers == null) {
		return;
	}

	// loop all markers and set their maps to null to remove them
	for (var i = 0; i < this.markers.length; ++i) {
		this.markers[i].setMap(null);
	}
	this.markers.length = 0;
	this.markers = null;
};

MapView.prototype.handleClickOnMap = function(map) {
	this.deleteInfoWindow();
};

MapView.prototype.handleClickOnMarker = function(marker, contentString) {
	if (marker == null || contentString == "") {
		console.log("Invalid input provided to MapView.handleClickOnMarker!");
		return;
	}

	this.createInfoWindow(marker, contentString);
};

MapView.prototype.createInfoWindow = function(marker, contentString) {
	this.deleteInfoWindow();

	// create an info window for this site
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