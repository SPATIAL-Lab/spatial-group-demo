var Form = function() {
	this.countries = null;
	this.types = null;
};

Form.prototype.init = function(data) {
	this.initDatePicker();
	this.initButtons();
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
	this.countries = countries;

	var selectCountries = $("#select-country");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < this.countries.length; ++i) {
		selectCountries.append($("<option></option>")
			.text(this.countries[i]));
	}
};

Form.prototype.resetCountries = function() {
	this.countries = [];
	$("#select-country").empty();
};

Form.prototype.setSelectedCountries = function(defaultPostData) {
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

Form.prototype.initTypes = function(types) {
	this.types = types;

	var selectCountries = $("#select-type");
	selectCountries.append($("<option></option>"));

	for (var i = 0; i < this.types.length; ++i) {
		var type = this.types[i].replace(/_/g, ' ');
		selectCountries.append($("<option></option>").text(type));
	}
};

Form.prototype.resetTypes = function() {
	this.types = [];
	$("#select-type").empty();
};

Form.prototype.setSelectedTypes = function(defaultPostData) {
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

Form.prototype.onSubmitClicked = function() {
	console.log("Submit clicked...");

	var postData = HELPER.getDefaultPostData();
	this.setSelectedTypes(postData);
	this.setSelectedCountries(postData);

	DEMO.fetchSites(postData);
};

Form.prototype.onResetClicked = function() {
	console.log("Reset clicked...");
	this.resetCountries();
	this.resetTypes();

	var postData = HELPER.getDefaultPostData();
	DEMO.fetchSites(postData);
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