/*
Test URL: http://localhost/~karan/SGD01/
*/

var RenderMapDemo = function() {
	this.testURL = "http://wateriso.utah.edu/api/sites.php";//"data/sites_02.json";	//"http://wateriso.utah.edu/api/sites.php";
	this.jsonData = null;

	this.map = null;
	this.vectorSource = null;
	this.rasterTile = null;
	this.vectorTile = null;
};

RenderMapDemo.prototype.initVectorSource = function() {
	// create a collection of features
	var featureCollection = new ol.Collection();

	// for each point that must be plotted, create a feature
	var numSitesPlotted = 0;
	for (var i = 0; i < this.jsonData.sites.length; ++i) {
		var site = this.jsonData.sites[i];
		if (isNaN(parseFloat(site.Latitude)) || isNaN(parseFloat(site.Longitude)))
		{
			console.log("Found undefined Lat/Lon for site:" + site.Site_ID + " Lat:" + site.Latitude + " Lon:" + site.Longitude);
			continue;
		}

		var point = new ol.geom.Point(null);
		point.setCoordinates(ol.proj.fromLonLat([parseFloat(site.Longitude), parseFloat(site.Latitude)]));

		featureCollection.push(new ol.Feature({
			geometry: point
		}));

		++numSitesPlotted;
	}
	console.log("Plotted " + numSitesPlotted + " sites...");

	this.vectorSource = new ol.source.Vector({
		features: featureCollection
	});
};

RenderMapDemo.prototype.initRasterTile = function() {
	this.rasterTile = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
};

RenderMapDemo.prototype.initVectorTile = function() {
	this.vectorTile = new ol.layer.Vector({
		source: this.vectorSource,
		style: new ol.style.Style({
			image: new ol.style.Circle({
				radius: 4,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	});
};

RenderMapDemo.prototype.initMap = function() {
	this.map = new ol.Map({
		target: 'map',
		layers: [this.rasterTile],
		view: new ol.View({
			center: [0, 0],
			zoom: 1.1
		})
	});
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
				console.log("Response received...");
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
	this.initVectorSource();
	this.initVectorTile();
	this.map.addLayer(this.vectorTile);
};

var renderMapDemo = null;
window.onload = function() {
	renderMapDemo = new RenderMapDemo();
	renderMapDemo.initRasterTile();
	renderMapDemo.initMap();
	renderMapDemo.fetchJSON();
	console.log("Loaded render map demo...");
}
