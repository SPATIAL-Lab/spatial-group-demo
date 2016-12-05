
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

Helper.prototype.generateSiteContentString = function(data) {
	var contentString = "<div id=\'div-info-window-container\'>";

	// write the site name
	contentString += '<p class="sample-site-name"><b>Site Name: </b>' + data.site_name + '</p>';

	// write information for each sample type
	for (var i = 0; i < data.types.length; ++i) {
		// add a separator after the first sample
		if (i > 0) {
			contentString += '<hr class="sample-separator" />';
		}
		
		var sample = data.types[i];

		contentString += '<p class="sample-data"><b>Sample Type: </b>' + sample.Type + '</p>';

		contentString += '<p class="sample-data"><b>#&delta;<sup>2</sup>H measurements: </b>' + sample.Count_d2H + '</p>';

		contentString += '<p class="sample-data"><b>#&delta;<sup>18</sup>O measurements: </b>' + sample.Count_d18O + '</p>';

		contentString += '<p class="sample-data"><b>Earliest Sample Date: </b>' + sample.Min_Date_Collected + '</p>';

		contentString += '<p class="sample-data"><b>Latest Sample Date: </b>' + sample.Max_Date_Collected + '</p>';
	}

	return contentString;
};

Helper.prototype.runDuplicateSearchTest = function(data) {
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