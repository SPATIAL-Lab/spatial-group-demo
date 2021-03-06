var FORM_WRITER = null;
var FormWriter = function() {
	var today = new Date();
	this.minYear = "1000";
	this.maxYear = "" + today.getFullYear();
};

FormWriter.prototype.write = function(data) {
	// the following functions fill the form with data by extracting it from the payload provided
	this.extractLatLong(data);
	this.extractCountries(data);
	this.extractTypes(data);
	this.extractProjectIDs(data);
	this.extractCollectionDates(data);
	this.extractElevation(data);
};

FormWriter.prototype.extractLatLong = function(data) {
	var minLat = 90;
	var maxLat = -90;
	var minLong = 180;
	var maxLong = -180;

	var numSites = data.sites.length;
	for (var i = 0; i < numSites; ++i) {
		var lat = data.sites[i].Latitude;
		var lon = data.sites[i].Longitude;

		if (lat == null || lat == undefined || lon == null || lon == undefined) {
			continue;
		}

		minLat = (lat < minLat) ? lat : minLat;
		maxLat = (lat > maxLat) ? lat : maxLat;
		minLong = (lon < minLong) ? lon : minLong;
		maxLong = (lon > maxLong) ? lon : maxLong;
	}
	this.writeLatLong(minLat, maxLat, minLong, maxLong);
};

FormWriter.prototype.writeLatLong = function(minLat, maxLat, minLong, maxLong) {
	$("#input-south-lat").val(minLat);
	$("#input-north-lat").val(maxLat);
	$("#input-west-long").val(minLong);
	$("#input-east-long").val(maxLong);
};

FormWriter.prototype.extractCountries = function(data) {
	var countries = [];
	var states = [];

	var numSites = data.sites.length;
	for (var i = 0; i < numSites; ++i) {
		var country = data.sites[i].Country;
		var state = data.sites[i].State_or_Province;

		// validate data
		if (country != null && country != undefined && countries.indexOf(country) < 0) {
			countries.push(country);
		}

		if (state != null && state != undefined && states.indexOf(state) < 0) {
			states.push(state);
		}
	}

	countries.sort();
	FORM.resetCountries();
	this.writeCountries(countries);

	if (countries.length == 1) {
		states.sort();
		FORM.resetStates();
		this.writeStates(states);
	}
};

FormWriter.prototype.writeCountries = function(countries) {
	var selectCountries = $("#select-country");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < countries.length; ++i) {
		var option = $("<option></option>").text(countries[i]);
		option.prop("id", countries[i]);
		if (FORM.changedCountries) {
			option.prop("selected", true);
		}
		selectCountries.append(option);
	}

	FORM.countries = countries;
};

FormWriter.prototype.writeStates = function(states) {	
	var selectStates = $("#select-state");
	selectStates.append($("<option></option>"));

	for (var i = 0; i < states.length; ++i) {
		var option = $("<option></option>").text(states[i]);
		option.prop("id", states[i]);
		if (FORM.changedStates) {
			option.prop("selected", true);
		}
		selectStates.append(option);
	}

	FORM.states = states;
};

FormWriter.prototype.extractTypes = function(data) {
	var types = [];
	var numTypes = data.types.length;
	for (var i = 0; i < numTypes; ++i) {
		var type = data.types[i]["Type"];
		// validate data
		if (type != null && type != undefined) {
			types.push(type);
		}
	}

	FORM.resetTypes();
	this.writeTypes(types);
};

FormWriter.prototype.writeTypes = function(types) {
	var selectTypes = $("#select-type");
	selectTypes.append($("<option></option>"));

	for (var i = 0; i < types.length; ++i) {
		var optionContent = types[i].replace(/_/g, ' ');
		var option = $("<option></option>").text(optionContent);
		option.prop("id", types[i]);
		if (FORM.changedTypes) {
			option.prop("selected", true);
		}
		selectTypes.append(option);
	}

	FORM.types = types;
};

FormWriter.prototype.extractProjectIDs = function(data) {
	var projectIDs = [];
	var numProjects = data.project_ids.length;
	for (var i = 0; i < numProjects; ++i) {
		var projectID = data.project_ids[i];
		// validata data
		if (projectID != null && projectID != undefined) {
			projectIDs.push(projectID);
		}
	}

	FORM.resetProjectIDs();
	this.writeProjectIDs(projectIDs);
};

FormWriter.prototype.writeProjectIDs = function(projectIDs) {
	var selectProjectIDs = $("#select-project-id");
	selectProjectIDs.append($("<option></option>"));

	for (var i = 0; i < projectIDs.length; ++i) {
		var project = projectIDs[i];

		// set option element's content;
		var optionContent = project["Project_ID"];
		optionContent += (project["Project_Name"] == null || project["Project_Name"] == undefined || project["Project_Name"] == "") ? "" : " - " + project["Project_Name"];
		optionContent += (project["Contact_Name"] == null || project["Contact_Name"] == undefined || project["Contact_Name"] == "") ? "" : " - " + project["Contact_Name"];

		var option = $("<option></option>").text(optionContent);
		option.prop("id", projectIDs[i]["Project_ID"]);
		option.prop("title", optionContent);
		if (FORM.changedProjectIDs) {
			option.prop("selected", true);
		}
		selectProjectIDs.append(option);
	}

	FORM.projectIDs = projectIDs;
};

FormWriter.prototype.extractCollectionDates = function(data) {
	var inputMaxDate = data.dates["Max"];
	var inputMinDate = data.dates["Min"];

	FORM.resetCollectionDates();
	this.writeCollectionDates(inputMinDate, inputMaxDate);
};

FormWriter.prototype.writeCollectionDates = function(minDate, maxDate) {
	if (minDate == null || minDate == undefined || minDate == "") {
		$("#input-collection-date-from").datepicker("setDate", "");
		$("#input-collection-date-from").datepicker("refresh");
	}
	else {
		// the date picker widget breaks if given a date of '0000-00-00'
		this.minDate = minDate == "0000-00-00" ? "1000-02-06" : minDate;
		this.minYear = this.minDate.split("-")[0];

		$("#input-collection-date-from").datepicker("option", "yearRange", this.minYear + ":" + this.maxYear);
		$("#input-collection-date-from").datepicker("option", "minDate", this.minDate);
		$("#input-collection-date-from").datepicker("setDate", this.minDate);
		$("#input-collection-date-from").datepicker("refresh");
	}

	if (maxDate == null || maxDate == undefined || maxDate == "") {
		$("#input-collection-date-to").datepicker("setDate", "");
		$("#input-collection-date-to").datepicker("refresh");
	}
	else {
		this.maxDate = maxDate;		
		this.maxYear = this.maxDate.split("-")[0];

		$("#input-collection-date-to").datepicker("option", "yearRange", this.minYear + ":" + this.maxYear);
		$("#input-collection-date-to").datepicker("option", "maxDate", this.maxDate);
		$("#input-collection-date-to").datepicker("setDate", this.maxDate);
		$("#input-collection-date-to").datepicker("refresh");
	}	
};

FormWriter.prototype.extractElevation = function(data) {
	var minElevation = 10000;
	var maxElevation = -10000;
	var numSites = data.sites.length;

	for (var i = 0; i < numSites; ++i) {
		var elevation = data.sites[i].Elevation_mabsl;
		if (elevation == null || elevation == undefined) {
			continue;
		}

		minElevation = (elevation < minElevation) ? elevation : minElevation;
		maxElevation = (elevation > maxElevation) ? elevation : maxElevation;
	}

	FORM.resetElevation();
	this.writeElevation(minElevation, maxElevation);
};

FormWriter.prototype.writeElevation = function(minElevation, maxElevation) {
	$("#input-elevation-from").val(minElevation);
	$("#input-elevation-to").val(maxElevation);
};