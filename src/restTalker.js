var REST_TALKER = null;
var RESTTalker = function() {
	this.sitesURL = "http://wateriso.utah.edu/api/sites.php";
	this.singleSiteURL = "http://wateriso.utah.edu/api/single_site.php";
	this.singleProjectURL = "http://wateriso.utah.edu/api/single_project.php";	
	this.siteDownloadURL = "http://wateriso.utah.edu/api/site_download.php";
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
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting sites!");
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while requesting sites!");
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
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting site data!");
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while requesting site data!");
		}
	});
};

RESTTalker.prototype.receiveSiteData = function(data) {
	if (data == null && data == undefined) {
		HELPER.ERROR_LOG("RESTTalker.receiveSiteData provided invalid input!");
		return;
	}

	APP.onSiteDataReceived(data);
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
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting project data!");
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while requesting project data!");
		}
	});
};

RESTTalker.prototype.receiveProjectData = function(data) {
	if (data == null && data == undefined) {
		HELPER.ERROR_LOG("RESTTalker.receiveProjectData provided invalid input!");
		return;
	}

	APP.onProjectDataReceived(data);
};

RESTTalker.prototype.downloadSiteData = function(data) {
	$.ajax({
		type: 'POST',
		url: this.siteDownloadURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status != undefined) {
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while downloading site data!");
			}
			else {
				REST_TALKER.onSiteDataDownloaded(data);
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while requesting project data!");
		}
	});
};

RESTTalker.prototype.onSiteDataDownloaded = function(data) {
	if (data == null && data == undefined) {
		HELPER.ERROR_LOG("RESTTalker.onSiteDataDownloaded provided invalid input!");
		return;
	}

	APP.onSiteDataDownloaded(data);
};