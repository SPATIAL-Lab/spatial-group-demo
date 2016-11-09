
var Helper = function() {
	this.version = 0.01;
	this.sitesURL = "http://wateriso.utah.edu/api/sites.php";
	this.countriesURL = "http://wateriso.utah.edu/api/countries.php";
	this.statesURL = "http://wateriso.utah.edu/api/states.php";
	this.typesURL = "http://wateriso.utah.edu/api/types.php";
	this.singleSiteURL = "http://wateriso.utah.edu/api/single_site.php";
};
var HELPER = new Helper();

Helper.prototype.getSites = function(data) {
	$.ajax({
		type: 'POST',
		url: this.sitesURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				HELPER.receiveSites(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting sites...");
			}
		},
		error: function() {
			console.log("Something went wrong while requesting sites...");
		}
	});
};

Helper.prototype.receiveSites = function(data) {
	if (data != null && data != undefined) {
		DEMO.onSitesReceived(data);
	}
};

Helper.prototype.getSiteData = function(data) {
	$.ajax({
		type: 'POST',
		url: this.singleSiteURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				HELPER.receiveSiteData(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting sites...");
			}
		},
		error: function() {
			console.log("Something went wrong while requesting sites...");
		}
	});
};

Helper.prototype.receiveSiteData = function(data) {
	if (data != null && data != undefined) {
		DEMO.onSiteDataReceived(data);
	}
};

Helper.prototype.getSitesRequestData = function() {
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