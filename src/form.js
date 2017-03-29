var FORM = null;
var Form = function() {
	this.minDate = "";
	this.maxDate = "";
	this.types = [];

	// usage flags
	// these flags are used to keep track of the information the user wants submitted in a given query
	this.changedForm = false;
	this.changedNorthLat = false;
	this.changedWestLong = false;
	this.changedEastLong = false;
	this.changedSouthLat = false;
	this.changedCountries = false;
	this.changedStates = false;	
	this.changedCollectionDateFrom = false;
	this.changedCollectionDateTo = false;	
	this.changedElevationFrom = false;
	this.changedElevationTo = false;	
	this.changedTypes = false;
	this.changedD2H = false;
	this.changedD18O = false;
	this.hasBeenSubmitted = false;

	// init UI elements
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
		FORM.onSubmitClicked();
	} );

	$("#btn-reset").click( function(event) {
		event.preventDefault();
		FORM.onResetClicked();
	} );

	this.setDownloadButtonDisabled(true);
};

Form.prototype.onSubmitClicked = function() {
	HELPER.DEBUG_LOG("Submit clicked...");

	// this flag is used by other modules such as the FormReader
	this.hasBeenSubmitted = true;

	// ask the helper for a sites payload 
	var postData = HELPER.getSitesRequestData();
	
	// ask the form reader to feed all form data into the payload
	FORM_READER.read(postData);

	// ask the app to invoke a request for all sites
	APP.fetchSites(postData);

	// show the loading animation
	this.setSpinnerVisibility(true);
};

Form.prototype.setColorForID = function(id, isSelected) {
	var element = $(id);
	if (element == null || element == undefined) {
		return;
	}

	if (element.is("input")) {
		element.css("background-color", isSelected ? "lightgrey" : "white");
	}
};

Form.prototype.onResetClicked = function() {
	HELPER.DEBUG_LOG("Reset clicked...");

	// this flag is used by other modules such as the FormReader
	this.hasBeenSubmitted = false;

	// reset all change tracking flags
	this.resetChangeFlags();
	// reset all the elements of the form
	this.resetLatLong();
	this.resetCountries();
	this.resetStates();
	this.resetTypes();
	this.resetCollectionDates();
	this.resetElevation();
	this.resetDeltaValues();
	this.resetColorForInputFields();

	// ask the helper for a sites payload 
	var postData = HELPER.getSitesRequestData();
	// ask the app to invoke a request for all sites
	APP.fetchSites(postData);

	// show the loading animation
	this.setSpinnerVisibility(true);
	// disable the download button
	this.setDownloadButtonDisabled(true);
};

Form.prototype.resetChangeFlags = function() {
	this.changedForm = false;
	this.changedNorthLat = false;
	this.changedWestLong = false;
	this.changedEastLong = false;
	this.changedSouthLat = false;
	this.changedCountries = false;
	this.changedStates = false;	
	this.changedCollectionDateFrom = false;
	this.changedCollectionDateTo = false;	
	this.changedElevationFrom = false;
	this.changedElevationTo = false;	
	this.changedTypes = false;
	this.changedD2H = false;
	this.changedD18O = false;
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
	FORM_WRITER.writeCollectionDates("", "");
};

Form.prototype.resetElevation = function() {
	FORM_WRITER.writeElevation(0, 0);
};

Form.prototype.resetDeltaValues = function() {
	$("#input-d2h").prop("checked", false);
	$("#input-d18o").prop("checked", false);
};

Form.prototype.resetColorForInputFields = function() {
	this.setColorForID("#input-north-lat", false);
	this.setColorForID("#input-west-long", false);
	this.setColorForID("#input-east-long", false);
	this.setColorForID("#input-south-lat", false);
	this.setColorForID("#input-collection-date-from", false);
	this.setColorForID("#input-collection-date-to", false);
	this.setColorForID("#input-elevation-from", false);
	this.setColorForID("#input-elevation-to", false);
};

Form.prototype.setSpinnerVisibility = function(visible) {
	document.getElementById("loading-spinner").style.display = visible ? 'block' : 'none';
};

Form.prototype.setDownloadButtonDisabled = function(disabled) {
	document.getElementById("btn-download").disabled = disabled;
};

Form.prototype.onChangedNorthLat = function() {
	this.changedNorthLat = true;
	this.changedForm = true;

	this.setColorForID('#input-north-lat', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedWestLong = function() {
	this.changedWestLong = true;
	this.changedForm = true;

	this.setColorForID('#input-west-long', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedEastLong = function() {
	this.changedEastLong = true;
	this.changedForm = true;

	this.setColorForID('#input-east-long', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedSouthLat = function() {
	this.changedSouthLat = true;
	this.changedForm = true;

	this.setColorForID('#input-south-lat', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedCountries = function() {
	this.changedCountries = true;
	this.changedForm = true;

	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedStates = function() {
	this.changedStates = true;
	this.changedForm = true;

	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedCollectionDateFrom = function() {
	this.changedCollectionDateFrom = true;
	this.changedForm = true;

	this.setColorForID('#input-collection-date-from', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedCollectionDateTo = function() {
	this.changedCollectionDateTo = true;
	this.changedForm = true;

	this.setColorForID('#input-collection-date-to', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedElevationFrom = function() {
	this.changedElevationFrom = true;
	this.changedForm = true;

	this.setColorForID('#input-elevation-from', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedElevationTo = function() {
	this.changedElevationTo = true;
	this.changedForm = true;

	this.setColorForID('#input-elevation-to', true);
	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedTypes = function() {
	this.changedTypes = true;
	this.changedForm = true;

	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedD2H = function() {
	this.changedD2H = true;
	this.changedForm = true;

	this.setDownloadButtonDisabled(false);
};

Form.prototype.onChangedD18O = function() {
	this.changedD18O = true;
	this.changedForm = true;

	this.setDownloadButtonDisabled(false);
};
