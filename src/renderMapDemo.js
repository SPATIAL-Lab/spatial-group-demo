/*
Test URL: http://localhost/~karan/SGD01/
*/

var DEMO = null;
var RenderMapDemo = function() {
	this.sitesData = null;
	this.countries = null;
	this.types = null;

	this.helper = new Helper();
	this.mapView = null;
	this.form = new Form();
};

RenderMapDemo.prototype.initOpenLayersView = function() {
	console.log("Loading OpenLayersView...");
	this.mapView = new OpenLayersView();
	this.mapView.initView();
};

RenderMapDemo.prototype.initGoogleMapsView = function() {
	console.log("Loading GoogleMapsView...");
	this.mapView = new GoogleMapsView();
	this.mapView.initView();
};

RenderMapDemo.prototype.fetchSites = function(postData) {
	// validate input
	if (postData == null || postData == undefined) {
		postData = this.helper.getDefaultPostData();
	}
	
	this.helper.doPOST(this.helper.sitesURL, JSON.stringify(postData));
};

RenderMapDemo.prototype.onSitesReceived = function(data) {
	this.sitesData = data;

	this.extractCountries(this.sitesData);
	this.extractTypes(this.sitesData);

	this.mapView.clearData();
	this.mapView.plotData(this.sitesData);
};

RenderMapDemo.prototype.extractCountries = function(data) {
	this.countries = [];
	var numSites = data.sites.length;
	for (var i = 0; i < numSites; ++i) {
		var country = data.sites[i].Country;
		// validate data
		if (country != null && country != undefined && this.countries.indexOf(country) < 0) {
			this.countries.push(country);
		}
	}
	this.countries.sort();
	this.form.resetCountries();
	this.form.initCountries(this.countries);
};

RenderMapDemo.prototype.extractTypes = function(data) {
	this.types = [];
	var numTypes = data.types.length;
	for (var i = 0; i < numTypes; ++i) {
		var type = data.types[i]["Type"];
		// validate data
		if (type != null && type != undefined) {
			this.types.push(type);
		}
	}
	this.form.resetTypes();
	this.form.initTypes(this.types);
};

window.onload = function() {

	if (didGoogleMapsAPILoad) {
		DEMO = new RenderMapDemo();
		DEMO.form.init();
		
		// parse the URL for viewType
		if (window.location.href.indexOf("viewType=ol") != -1) {
			DEMO.initOpenLayersView();
		}
		// else if (window.location.href.indexOf("viewType=goog") != -1) {
		// 	DEMO.initGoogleMapsView();
		// }
		else {
			console.log("Received unknown view type in URL:" + window.location.href);
			DEMO.initOpenLayersView();
		}

		DEMO.fetchSites();
		// DEMO.fetchCountries();
		console.log("Loaded render map demo v" + HELPER.version + "...");
	}
	else {
		console.log("Google Maps API failed to load...");
	}
}

var didGoogleMapsAPILoad = false;
function onGoogleMapsAPILoaded() {
	console.log("Google maps API loaded...");
	didGoogleMapsAPILoad = true;
}
