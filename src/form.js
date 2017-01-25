var FORM = null;
var Form = function() {
	this.minDate = "";
	this.maxDate = "";
	this.types = [];

	// usage flags
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
};

Form.prototype.onSubmitClicked = function() {
	HELPER.DEBUG_LOG("Submit clicked...");

	var postData = HELPER.getSitesRequestData();
	
	FORM_READER.read(postData);

	APP.fetchSites(postData);

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
	this.resetChangeFlags();
	this.resetLatLong();
	this.resetCountries();
	this.resetStates();
	this.resetTypes();
	this.resetCollectionDates();
	this.resetElevation();
	this.resetDeltaValues();
	this.resetColorForInputFields();

	var postData = HELPER.getSitesRequestData();
	APP.fetchSites(postData);

	this.setSpinnerVisibility(true);
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

Form.prototype.resetChangeFlags = function() {
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