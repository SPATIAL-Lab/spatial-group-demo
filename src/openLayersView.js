var OpenLayersView = function() {
	this.map = null;
	this.vectorSource = null;
	this.rasterTile = null;
	this.vectorTile = null;
};

OpenLayersView.prototype.initView = function() {
	this.initRasterTile();
	this.initMap();
};

OpenLayersView.prototype.plotData = function(data) {
	this.initVectorSource(data);
	this.initVectorTile();
	this.map.addLayer(this.vectorTile);
};

OpenLayersView.prototype.initRasterTile = function() {
	this.rasterTile = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
};

OpenLayersView.prototype.initMap = function() {
	this.map = new ol.Map({
		target: 'map',
		layers: [this.rasterTile],
		view: new ol.View({
			center: [0, 0],
			zoom: 1.1
		})
	});
};

OpenLayersView.prototype.initVectorSource = function(data) {
	// create a collection of features
	var featureCollection = new ol.Collection();

	// for each point that must be plotted, create a feature
	var numSitesPlotted = 0;
	for (var i = 0; i < data.sites.length; ++i) {
		var site = data.sites[i];
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

OpenLayersView.prototype.initVectorTile = function() {
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
