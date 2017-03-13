var HELPER = null;
var Helper = function() {
	this.version = 0.01;
	// use this flag to turn off ALL logs
	this.ENABLE_LOGS = true;
	// use this flag to turn on debug messages & debug functionality
	this.DEBUG_MODE = true;
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
		"o18": null
	};

	return postData;
};

Helper.prototype.runDuplicateSearchTest = function(data) {
	if (!this.DEBUG_MODE) {
		return;
	}

	var allCountries = [];
	var allStates = [];

	var countryStrings = [];
	var stateStrings = [];

	// first get all the countries
	for (var i = 0; i < data.sites.length; ++i) {
		var siteID = data.sites[i].Site_ID;
		
		var country = data.sites[i].Country;
		if (allCountries.indexOf(country) < 0) {
			allCountries.push(country);
			countryStrings.push("Country:" + country + "\t\t\t\tSite:" + siteID);
		}

		var state = data.sites[i].State_or_Province;
		if (allStates.indexOf(state) < 0) {
			allStates.push(state);
			stateStrings.push("State:" + state + "\t\t\t\tSite:" + siteID);
		}
	}
	
	HELPER.DEBUG_LOG("---------------------------------------------------------");
	HELPER.DEBUG_LOG("Found following countries:");
	for (var i = 0; i < countryStrings.length; ++i) {
		HELPER.DEBUG_LOG(countryStrings[i]);
	}

	HELPER.DEBUG_LOG("---------------------------------------------------------");
	HELPER.DEBUG_LOG("Found following states:");
	for (var i = 0; i < stateStrings.length; ++i) {
		HELPER.DEBUG_LOG(stateStrings[i]);
	}
	HELPER.DEBUG_LOG("---------------------------------------------------------");
};

Helper.prototype.downloadSiteData = function(postData) {
	HELPER.DEBUG_LOG("HELPER.downloadSiteData postData" + postData);

	var form = document.createElement('form');
	form.method = "POST";
	form.action = REST_TALKER.siteDownloadURL;
	document.getElementById('div-info-window-container').appendChild(form);

	this.createInputField("site_id", JSON.stringify(postData.site_id), form);
	this.createInputField("latitude", JSON.stringify(postData.latitude), form);
	this.createInputField("longitude", JSON.stringify(postData.longitude), form);
	this.createInputField("elevation", JSON.stringify(postData.elevation), form);
	this.createInputField("countries", JSON.stringify(postData.countries), form);
	this.createInputField("states", JSON.stringify(postData.states), form);
	this.createInputField("collection_date", JSON.stringify(postData.collection_date), form);
	this.createInputField("types", JSON.stringify(postData.types), form);
	this.createInputField("h2", JSON.stringify(postData.h2), form);
	this.createInputField("o18", JSON.stringify(postData.o18), form);

	form.submit();
};

Helper.prototype.createInputField = function(name, value, form) {
	var input = document.createElement('input');
	input.type + "hidden";
	input.name = name;
	input.value = value;
	form.appendChild(input);
};