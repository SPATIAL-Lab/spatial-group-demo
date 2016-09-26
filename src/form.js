var Form = function() {

};

Form.prototype.init = function() {
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
		renderMapDemo.form.onSubmitClicked();
	} );

	$("#btn-reset").click( function(event) {
		event.preventDefault();
		renderMapDemo.form.onResetClicked();
	} );
};

Form.prototype.onSubmitClicked = function() {
	console.log("Submit clicked...");
};

Form.prototype.onResetClicked = function() {
	console.log("Reset clicked...");
};