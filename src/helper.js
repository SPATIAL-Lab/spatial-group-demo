var HELPER = null;
var Helper = function() {
	this.version = 0.01;
	this.DEBUG_MODE = true;
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
	
	console.log("---------------------------------------------------------");
	console.log("Found following countries:");
	for (var i = 0; i < countryStrings.length; ++i) {
		console.log(countryStrings[i]);
	}

	console.log("---------------------------------------------------------");
	console.log("Found following states:");
	for (var i = 0; i < stateStrings.length; ++i) {
		console.log(stateStrings[i]);
	}
	console.log("---------------------------------------------------------");
};