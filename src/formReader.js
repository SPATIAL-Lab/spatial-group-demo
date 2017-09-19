var FORM_READER = null;
var FormReader = function() {

};

FormReader.prototype.read = function(data) {
	// only read data from the form if it has been changed
	// we track if data has been changed by asking the form
	if (!FORM.hasBeenSubmitted) {
		return false;
	}

	// the following functions feed data from the form into the payload,
	// if they have been changed by the user
	this.readSelectedLatLong(data);
	this.readSelectedCountries(data);
	this.readSelectedStates(data);
	this.readSelectedTypes(data);
	this.readSelectedProjectIDs(data);
	this.readSelectedCollectionDates(data);
	this.readElevation(data);
	this.readDeltaValues(data);

	return true;
};

FormReader.prototype.readSelectedLatLong = function(output) {
	if (FORM.changedNorthLat || FORM.changedSouthLat) {
		output.latitude = { "Min": null, "Max": null };
		
		if (FORM.changedNorthLat) {
			var maxLat = $("#input-north-lat").val();
			maxLat = (maxLat < -90) ? -90 : ((maxLat > 90) ? 90 : maxLat);
			output.latitude.Max = maxLat;
		}

		if (FORM.changedSouthLat) {
			var minLat = $("#input-south-lat").val();
			minLat = (minLat < -90) ? -90 : ((minLat > 90) ? 90 : minLat);
			output.latitude.Min = minLat;
		}
	}

	if (FORM.changedWestLong || FORM.changedEastLong) {
		output.longitude = { "Min": null, "Max": null };

		if (FORM.changedWestLong) {
			var minLong = $("#input-west-long").val();
			minLong = (minLong < -180) ? -180 : ((minLong > 180) ? 180 : minLong);
			output.longitude.Min = minLong;
		}

		if (FORM.changedEastLong) {
			var maxLong = $("#input-east-long").val();
			maxLong = (maxLong < -180) ? -180 : ((maxLong > 180) ? 180 : maxLong);
			output.longitude.Max = maxLong;
		}
	}
};

FormReader.prototype.readSelectedCountries = function(output) {
	if (!FORM.changedCountries) {
		return;
	}
	
	var selectedCountries = this.getSelectedValues(document.getElementById("select-country"));
	var numCountriesSelected = selectedCountries.length;

	if (numCountriesSelected <= 0) {
		return;
	}

	var countriesArr = [];
	for (var i = 0; i < numCountriesSelected; ++i) {
		var country = selectedCountries[i];
		countriesArr.push({ "Country": country });
	}
	output.countries = countriesArr;
};

FormReader.prototype.readSelectedStates = function(output) {
	if (!FORM.changedStates) {
		return;
	}
	
	var selectedStates = this.getSelectedValues(document.getElementById("select-state"));
	var numStatesSelected = selectedStates.length;

	if (numStatesSelected <= 0) {
		return;
	}

	var statesArr = [];
	for (var i = 0; i < numStatesSelected; ++i) {
		var state = selectedStates[i];
		statesArr.push({ "State": state });
	}
	output.states = statesArr;
};

FormReader.prototype.readSelectedTypes = function(output) {
	if (!FORM.changedTypes) {
		return;
	}

	var selectedTypes = this.getSelectedValues(document.getElementById("select-type"));
	var numTypesSelected = selectedTypes.length;

	if (numTypesSelected <= 0) {
		return;
	}

	var typeArr = [];
	for (var i = 0; i < numTypesSelected; ++i) {
		for (var j = 0; j < FORM.types.length; ++j) {
			var type = selectedTypes[i].replace(/ /g, '_');
			if (FORM.types[j] == type) {
				typeArr.push({ "Type": type });
			}
		}
	}
	output.types = typeArr;
};

FormReader.prototype.readSelectedProjectIDs = function(output) {
	if (!FORM.changedProjectIDs) {
		return;
	}

	var selectedProjectIDs = this.getSelectedValues(document.getElementById("select-project-id"));
	var numProjectIDsSelected = selectedProjectIDs.length;

	if (numProjectIDsSelected <= 0) {
		return;
	}

	var projectIDsArr = [];
	for (var i = 0; i < numProjectIDsSelected; ++i) {
		projectIDsArr.push({ "Project_ID": selectedProjectIDs[i] });
	}
	output.project_ids = projectIDsArr;
};

FormReader.prototype.readSelectedCollectionDates = function(output) {
	if (FORM.changedCollectionDateFrom || FORM.changedCollectionDateTo) {
		output.collection_date = { "Min": null, "Max": null };
		
		if (FORM.changedCollectionDateFrom) {
			var minDate = $("#input-collection-date-from").datepicker("getDate");
			output.collection_date.Min = minDate;
		}

		if (FORM.changedCollectionDateTo) {
			var maxDate = $("#input-collection-date-to").datepicker("getDate");
			output.collection_date.Max = maxDate;
		}
	}
};

FormReader.prototype.readElevation = function(output) {
	if (FORM.changedElevationFrom || FORM.changedElevationTo) {
		output.elevation = { "Min": null, "Max": null };
		
		if (FORM.changedElevationFrom) {
			var minElevation = $("#input-elevation-from").val();
			output.elevation.Min = minElevation;
		}

		if (FORM.changedElevationTo) {
			var maxElevation = $("#input-elevation-to").val();
			output.elevation.Max = maxElevation;
		}
	}
};

FormReader.prototype.readDeltaValues = function(output) {
	if (FORM.changedD2H) {
		output.h2 = $("#input-d2h").prop("checked") ? 1 : null;
	}

	if (FORM.changedD18O) {
		output.o18 = $("#input-d18o").prop("checked") ? 1 : null;
	}
};

FormReader.prototype.getSelectedValues = function(select) {
	var result = [];
	var options = select && select.options;
	var opt;

	// loop all options
	for (var i = 0, len = options.length; i < len; ++i) {
		opt = options[i];

		// check if option is selected and has a value/text that is not empty
		if (opt.selected && ((opt.value || opt.text) != "")) {
			// add this option's id to the result
			result.push(opt.id)
		}
	}

	return result;
};