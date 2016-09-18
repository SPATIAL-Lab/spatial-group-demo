/*
Test URL: http://localhost/~karan/SGD01/
*/

var RenderMapDemo = function() {
	this.testURL = "data/sites_02.json";	//"http://wateriso.utah.edu/api/sites.php";
	this.jsonData = null;

	this.mapView = null;
};

RenderMapDemo.prototype.initOpenLayersView = function() {
	this.mapView = new OpenLayersView();
	this.mapView.initView();
};

RenderMapDemo.prototype.initGoogleMapsView = function() {
	this.mapView = new GoogleMapsView();
	this.mapView.initView();
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
	this.mapView.plotData(this.jsonData);
};

var renderMapDemo = null;
window.onload = function() {
	if (didGoogleMapsAPILoad) {
		renderMapDemo = new RenderMapDemo();
		// renderMapDemo.initOpenLayersView();
		renderMapDemo.initGoogleMapsView();
		renderMapDemo.fetchJSON();
		console.log("Loaded render map demo...");
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