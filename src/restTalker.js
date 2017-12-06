var REST_TALKER = null;
var RESTTalker = function() {
	this.sitesURL = "http://wateriso.utah.edu/api/sites.php";
	this.singleSiteURL = "http://wateriso.utah.edu/api/single_site.php";
	this.singleProjectURL = "http://wateriso.utah.edu/api/single_project.php";	
	this.siteDownloadURL = "http://wateriso.utah.edu/api/site_download.php";
	this.multiSiteDownloadURL = "http://wateriso.utah.edu/api/multi_download.php";
	this.bannerURL = "http://wateriso.utah.edu/api/new_proj.php";
};

//=========================================================================
// Fetch and receive all sites

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

//=========================================================================
// Fetch and receive single site

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

//=========================================================================
// Fetch and receive project data for a single site

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

//=========================================================================
// Fetch a download link for a single site's data

RESTTalker.prototype.downloadSiteData = function(data) {
	$.ajax({
		type: 'POST',
		url: this.siteDownloadURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				REST_TALKER.onSiteDataReadyForDownload(data);
			}
			else {
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while downloading site data!");
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while downloading site data!");
		}
	});
};

RESTTalker.prototype.onSiteDataReadyForDownload = function(data) {
	if (data == null && data == undefined) {
		HELPER.ERROR_LOG("RESTTalker.onSiteDataReadyForDownload received invalid input!");
		return;
	}

	APP.onSiteDataReadyForDownload(data);
};

//=========================================================================
// Fetch a download link for all site's data

RESTTalker.prototype.downloadMultiSiteData = function(data) {
	$.ajax({
		type: 'POST',
		url: this.multiSiteDownloadURL,
		data: data,
		datType: 'json',
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				REST_TALKER.onMultiSiteDataReadyForDownload(data);
			}
			else {
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while downloading site data!");
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while downloading site data!");
		}
	});
};

RESTTalker.prototype.onMultiSiteDataReadyForDownload = function(data) {
	if (data == null && data == undefined) {
		HELPER.ERROR_LOG("RESTTalker.onMultiSiteDataReadyForDownload received invalid input!");
		return;
	}

	APP.onMultiSiteDataReadyForDownload(data);
};

//=========================================================================
// Fetch and receive project data for the banner

RESTTalker.prototype.fetchBannerData = function() {
	$.ajax({
		type: 'GET',
		url: this.bannerURL,
		contentType: 'json',
		success: function(data) {
			if (data.status.Code == 200) {
				REST_TALKER.receiveBannerData(data);
			}
			else {
				HELPER.ERROR_LOG("Received response with error:" + data.status.Code + " and message:" + data.status.Message + " while requesting banner data!");
			}
		},
		error: function() {
			HELPER.ERROR_LOG("Something went wrong while requesting banner data!");
		}
	});
};

RESTTalker.prototype.receiveBannerData = function(data) {
	if (data == null && data == undefined) {
		HELPER.ERROR_LOG("RESTTalker.receiveBannerData provided invalid input!");
		return;
	}

	APP.onBannerDataReceived(data);
};