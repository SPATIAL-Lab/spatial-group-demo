/*
Google Maps API Key: AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk
*/

var GoogleMapsView = function() {
	this.API_KEY = "AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk";
	this.map = null;
	this.markers = null;
};

GoogleMapsView.prototype.initView = function() {
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 0, lng: 0 },
		zoom: 2,
		streetViewControl: false,
		rotateControl: false,
		scaleControl: false,
		fullscreenControl: false
	});
};

GoogleMapsView.prototype.plotData = function(data) {
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
		marker.addListener('click', DEMO.onMarkerClicked);
		this.markers.push(marker);

		++numSitesPlotted;
	}
	console.log("Plotted " + numSitesPlotted + " sites...");
};

GoogleMapsView.prototype.clearData = function(data) {
	if (this.markers == null) {
		return;
	}

	for (var i = 0; i < this.markers.length; ++i) {
		this.markers[i].setMap(null);
	}
	this.markers.length = 0;
	this.markers = null;
};

GoogleMapsView.prototype.createInfoWindow = function(marker, contentString) {
	var infoWindow = new google.maps.InfoWindow({
		content: contentString
	});

	infoWindow.open(this.map, marker);
};