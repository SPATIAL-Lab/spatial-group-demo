/*
Google Maps API Key: AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk
*/

var GoogleMapsView = function() {
	this.API_KEY = "AIzaSyCYRKZVcrxCpuBNyrvPYsgQrSbxqJNn5Yk";
	this.map = null;
};

GoogleMapsView.prototype.initView = function() {
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 0, lng: 0 },
		zoom: 1
	});
};

GoogleMapsView.prototype.plotData = function(data) {
	var numSitesPlotted = 0;

	// for each point that must be plotted, create a marker
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
			map: this.map
		});

		++numSitesPlotted;
	}
	console.log("Plotted " + numSitesPlotted + " sites...");
};