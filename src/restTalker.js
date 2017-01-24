var REST_TALKER = null;
var RESTTalker = function() {
	this.sitesURL = "http://wateriso.utah.edu/api/sites.php";
	this.singleSiteURL = "http://wateriso.utah.edu/api/single_site.php";
	this.singleProjectURL = "http://wateriso.utah.edu/api/single_project.php";	
};

RESTTalker.prototype.getSites = function(data) {
	$.ajax({
		type: 'POST',
		url: this.sitesURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				REST_TALKER.receiveSites(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting sites!");
			}
		},
		error: function() {
			console.log("Something went wrong while requesting sites!");
		}
	});
};

RESTTalker.prototype.receiveSites = function(data) {
	if (data != null && data != undefined) {
		APP.onSitesReceived(data);
	}
};

RESTTalker.prototype.getSiteData = function(data) {
	$.ajax({
		type: 'POST',
		url: this.singleSiteURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				REST_TALKER.receiveSiteData(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting site data!");
			}
		},
		error: function() {
			console.log("Something went wrong while requesting site data!");
		}
	});
};

RESTTalker.prototype.receiveSiteData = function(data) {
	if (data != null && data != undefined) {
		APP.onSiteDataReceived(data);
	}
};

RESTTalker.prototype.getProjectData = function(data) {
	$.ajax({
		type: 'POST',
		url: this.singleProjectURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				REST_TALKER.receiveProjectData(data);
			}
			else {
				console.log("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting project data!");
			}
		},
		error: function() {
			console.log("Something went wrong while requesting project data!");
		}
	});
};

RESTTalker.prototype.receiveProjectData = function(data) {
	if (data != null && data != undefined) {
		APP.onProjectDataReceived(data);
	}
};
