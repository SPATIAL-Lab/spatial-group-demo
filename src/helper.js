var HELPER = null;
var Helper = function() {
	this.version = 0.01;
	// use this flag to turn off ALL logs
	this.ENABLE_LOGS = true;
	// use this flag to turn on debug messages & debug functionality
	this.DEBUG_MODE = true;
	// use this flag to enable/disable OMS
	this.ENABLE_OMS = true;
	// the path on the server where site data download files are located
	this.SITE_DOWNLOAD_PATH = "../../../";
};

// debug messages will be enabled only in debug mode
Helper.prototype.DEBUG_LOG = function(message) {
	if (this.ENABLE_LOGS && this.DEBUG_MODE) {
		console.log("DEBUG: " + message);
	}
};

// error messages will be enabled both in debug and release mode
Helper.prototype.ERROR_LOG = function(message) {
	if (this.ENABLE_LOGS) {
		console.log("ERROR: " + message);
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
		"o18": null,
		"project_id": null
	};

	return postData;
};

Helper.prototype.showMultiSiteDownloadLink = function(data) {
	// anchor tag approach
	var element = document.createElement('a');
	element.setAttribute('href', HELPER.SITE_DOWNLOAD_PATH + data.filePath.toString());

	element.style.display = 'none';
	$('#main-container').append(element);

	element.click();
	element.remove();
};
