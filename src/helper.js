var MODE = "LIVE";	// "DEV", "LIVE"

var Helper = function() {
	this.version = 0.01;
	this.sitesURL = (MODE == "LIVE" ? "http://wateriso.utah.edu/api/sites.php" : "data/sites_02.json");
	this.countriesURL = (MODE == "LIVE" ? "http://wateriso.utah.edu/api/countries.php" : "data/countries.json");
	this.statesURL = (MODE == "LIVE" ? "http://wateriso.utah.edu/api/states.php" : "data/states.json");
	this.typesURL = (MODE == "LIVE" ? "http://wateriso.utah.edu/api/types.php" : "data/types.json");
};
var HELPER = new Helper();

Helper.prototype.doGET = function(url) {
	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if (data.status.Code == 200) {
				HELPER.onResponseReceived(data);
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

Helper.prototype.doPOST = function(url, data) {
	$.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: 'json',
		contentType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if (data.status.Code == 200) {
				HELPER.onResponseReceived(data);
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

Helper.prototype.onResponseReceived = function(data) {
	if (data == null || data == undefined) {
		return;
	}

	if (data.sites != null) {
		DEMO.onSitesReceived(data);
	}
};

Helper.prototype.getDefaultPostData = function() {
	var postData = {
		"latitude": null,
		"longitude": null,
		"elevation": null,
		"countries": null,
		"states": null,
		"collection_date": null,
		"types": null,
		"h2": null,
		"o18": null
	};

	return postData;
};
