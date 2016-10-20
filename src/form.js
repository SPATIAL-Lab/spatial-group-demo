var Form = function() {
	this.countries = null;
	this.states = null;
	this.types = null;
	this.minDate = "";
	this.maxDate = "";

	// usage flags
	this.changedLatLong = false;
	this.changedCountries = false;
	this.changedStates = false;
	this.changedCollectionDates = false;
	this.changedElevations = false;
	this.changedTypes = false;
	this.changedDeltas = false;
};

Form.prototype.init = function(data) {
	this.initDatePicker();
	this.initButtons();
};

Form.prototype.initDatePicker = function() {
	$("#input-collection-date-from").datepicker({
		dateFormat: "yy-mm-dd",
		changeYear: true
	});
	$("#input-collection-date-to").datepicker({
		dateFormat: "yy-mm-dd",
		changeYear: true
	});
};

Form.prototype.initButtons = function() {
	$("#btn-submit").click( function(event) {
		event.preventDefault();
		DEMO.form.onSubmitClicked();
	} );

	$("#btn-reset").click( function(event) {
		event.preventDefault();
		DEMO.form.onResetClicked();
	} );
};

Form.prototype.initLatLong = function(minLat, maxLat, minLong, maxLong) {
	$("#input-south-lat").val(minLat);
	$("#input-north-lat").val(maxLat);
	$("#input-west-long").val(minLong);
	$("#input-east-long").val(maxLong);
};

Form.prototype.initCountries = function(countries) {
	this.countries = countries;

	var selectCountries = $("#select-country");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < this.countries.length; ++i) {
		selectCountries.append($("<option></option>").text(this.countries[i]));
	}
};

Form.prototype.initStates = function(states) {
	this.states = states;

	var selectStates = $("#select-state");
	selectStates.append($("<option></option>"));

	for (var i = 0; i < this.states.length; ++i) {
		selectStates.append($("<option></option>").text(this.states[i]));
	}
}

Form.prototype.initTypes = function(types) {
	this.types = types;

	var selectCountries = $("#select-type");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < this.types.length; ++i) {
		var type = this.types[i].replace(/_/g, ' ');
		selectCountries.append($("<option></option>").text(type));
	}
};

Form.prototype.initCollectionDates = function(minDate, maxDate) {
	if (minDate == null || minDate == undefined || minDate == "") {
		$("#input-collection-date-from").datepicker("setDate", "");
		$("#input-collection-date-from").datepicker("refresh");
	}
	else {
		this.minDate = minDate;
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

Form.prototype.initElevation = function(minElevation, maxElevation) {
	$("#input-elevation-from").val(minElevation);
	$("#input-elevation-to").val(maxElevation);
};

Form.prototype.onSubmitClicked = function() {
	console.log("Submit clicked...");

	var postData = HELPER.getDefaultPostData();
	this.setSelectedLatLong(postData);
	this.setSelectedTypes(postData);
	this.setSelectedCountries(postData);
	this.setSelectedStates(postData);
	this.setSelectedCollectionDates(postData);
	this.setElevation(postData);
	this.setDeltaValues(postData);
	
	this.resetChangeFlags();

	DEMO.fetchSites(postData);
};

Form.prototype.setSelectedLatLong = function(defaultPostData) {
	if (!this.changedLatLong) {
		return;
	}
	this.changedLatLong = false;

	var minLat = $("#input-south-lat").val();
	var maxLat = $("#input-north-lat").val();
	var minLong = $("#input-west-long").val();
	var maxLong = $("#input-east-long").val();

	minLat = (minLat < -90) ? -90 : ((minLat > 90) ? 90 : minLat);
	maxLat = (maxLat < -90) ? -90 : ((maxLat > 90) ? 90 : maxLat);
	minLong = (minLong < -180) ? -180 : ((minLong > 180) ? 180 : minLong);
	maxLong = (maxLong < -180) ? -180 : ((maxLong > 180) ? 180 : maxLong);

	defaultPostData.latitude = { "Min": minLat, "Max": maxLat };
	defaultPostData.longitude = { "Min": minLong, "Max": maxLong };
};

Form.prototype.setSelectedTypes = function(defaultPostData) {
	if (!this.changedTypes) {
		return;
	}
	this.changedTypes = false;

	var selectedTypes = this.getSelectedValues(document.getElementById("select-type"));
	var numTypesSelected = selectedTypes.length;

	if (numTypesSelected <= 0) {
		return;
	}

	var typeArr = [];
	for (var i = 0; i < numTypesSelected; ++i) {
		for (var j = 0; j < this.types.length; ++j) {
			var type = selectedTypes[i].replace(/ /g, '_');
			if (this.types[j] == type) {
				typeArr.push({ "Type": type });
			}
		}
	}
	defaultPostData.types = typeArr;
};

Form.prototype.setSelectedCountries = function(defaultPostData) {
	if (!this.changedCountries) {
		return;
	}
	this.changedCountries = false;
	
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
	defaultPostData.countries = countriesArr;
};

Form.prototype.setSelectedStates = function(defaultPostData) {
	if (!this.changedStates) {
		return;
	}
	this.changedStates = false;
	
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
	defaultPostData.states = statesArr;
};

Form.prototype.setSelectedCollectionDates = function(defaultPostData) {
	if (!this.changedCollectionDates) {
		return;
	}
	this.changedCollectionDates = false;
	
	var minDate = $("#input-collection-date-from").datepicker("getDate");
	var maxDate = $("#input-collection-date-to").datepicker("getDate");

	defaultPostData.collection_date = { "Min": minDate, "Max": maxDate };
};

Form.prototype.setElevation = function(defaultPostData) {
	if (!this.changedElevations) {
		return;
	}
	this.changedElevations = false;
	
	var minElevation = $("#input-elevation-from").val();
	var maxElevation = $("#input-elevation-to").val();

	defaultPostData.elevation = { "Min": minElevation, "Max": maxElevation };
};

Form.prototype.setDeltaValues = function(defaultPostData) {
	if (!this.changedDeltas) {
		return;
	}
	this.changedDeltas = false;
	
	defaultPostData.h2 = $("#input-d2h").prop("checked") ? 1 : null;
	defaultPostData.o18 = $("#input-d18o").prop("checked") ? 1 : null;
};

Form.prototype.onResetClicked = function() {
	console.log("Reset clicked...");
	this.resetChangeFlags();
	this.resetLatLong();
	this.resetCountries();
	this.resetStates();
	this.resetTypes();
	this.resetCollectionDates();
	this.resetElevation();
	this.resetDeltaValues();

	var postData = HELPER.getDefaultPostData();
	DEMO.fetchSites(postData);
};

Form.prototype.resetLatLong = function() {
	$("#input-north-lat").val(90);
	$("#input-south-lat").val(-90);
	$("#input-west-long").val(-180);
	$("#input-east-long").val(180);
};

Form.prototype.resetCountries = function() {
	this.countries = [];
	$("#select-country").empty();
};

Form.prototype.resetStates = function() {
	this.states = [];
	$("#select-state").empty();
};

Form.prototype.resetTypes = function() {
	this.types = [];
	$("#select-type").empty();
};

Form.prototype.resetCollectionDates = function() {
	this.initCollectionDates("");
};

Form.prototype.resetElevation = function() {
	this.initElevation(0, 0);
};

Form.prototype.resetDeltaValues = function() {
	$("#input-d2h").prop("checked", false);
	$("#input-d18o").prop("checked", false);
};

Form.prototype.resetChangeFlags = function() {
	this.changedLatLong = false;
	this.changedCountries = false;
	this.changedStates = false;
	this.changedCollectionDates = false;
	this.changedElevations = false;
	this.changedTypes = false;
	this.changedDeltas = false;
};

Form.prototype.getSelectedValues = function(select) {
	var result = [];
	var options = select && select.options;
	var opt;

	for (var i = 0, len = options.length; i < len; ++i) {
		opt = options[i];

		if (opt.selected && ((opt.value || opt.text) != "")) {
			result.push(opt.value || opt.text);
		}
	}

	return result;
};

Form.prototype.onInputFieldChanged = function(fieldID) {
	console.log("Input field-" + fieldID + " changed...");
};