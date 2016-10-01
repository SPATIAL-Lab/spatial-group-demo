var Form = function() {

};

Form.prototype.init = function(data) {
	this.initDatePicker();
	this.initButtons();
	this.initTypes(HELPER.typeData);
};

Form.prototype.initDatePicker = function() {
	$("#input-collection-date-from").datepicker();
	$("#input-collection-date-to").datepicker();
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

Form.prototype.initCountries = function(countries) {
	var selectCountries = $("#select-country");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < countries.length; ++i) {
		var country = countries[i];
		selectCountries.append($("<option></option>")
			.text(country["Country"]));
	}
};

Form.prototype.setSelectedCountries = function(defaultPostData) {

};

Form.prototype.initTypes = function(types) {
	var selectCountries = $("#select-type");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < types.length; ++i) {
		selectCountries.append($("<option></option>").text(types[i].value));
	}
};

Form.prototype.setSelectedTypes = function(defaultPostData) {
	var selectedTypes = this.getSelectedValues(document.getElementById("select-type"));
	var numTypesSelected = selectedTypes.length;

	var typeArr = [];
	for (var i = 0; i < numTypesSelected; ++i) {
		for (var j = 0; j < HELPER.typeData.length; ++j) {
			if (HELPER.typeData[j].value == selectedTypes[i]) {
				typeArr.push({ Type: HELPER.typeData[j].key.toString() });
			}
		}
	}
	defaultPostData.types = typeArr;
};

Form.prototype.onSubmitClicked = function() {
	console.log("Submit clicked...");

	var postData = HELPER.getDefaultPostData();
	this.setSelectedTypes(postData);
	this.setSelectedCountries(postData);

	DEMO.fetchSites(postData);
};

Form.prototype.onResetClicked = function() {
	console.log("Reset clicked...");
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