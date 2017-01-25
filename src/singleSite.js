var SingleSite = function() {
	this.singleSiteContent = '';
};

SingleSite.prototype.getSingleSiteContent = function(data) {

	// TODO: Remove once all empty sites have been found.
	if (HELPER.DEBUG_MODE && data.site_name == "") {
		HELPER.ERROR_LOG("Received empty data for site ID:" + this.markerClicked.get("siteID"));

		this.singleSiteContent = "<div id=\'div-info-window-container\'>";
		this.singleSiteContent += '<p class="sample-site-name"><b>Received empty data for site ID: </b><br />' + this.markerClicked.get("siteID") + '</p>';

		this.mapView.handleClickOnMarker(this.markerClicked, this.singleSiteContent);
		this.markerClicked = null;
		return;
	}

	this.singleSiteContent = '<div id="div-info-window-container">';

	// write the site name
	this.singleSiteContent += '<p class="sample-site-name"><b>Site Name: </b>' + data.site_name + '</p>';

	var projectsContentString = this.getSiteProjectContent(data.projects);

	// write information for each sample type
	for (var i = 0; i < data.types.length; ++i) {
		// add a separator after the first sample
		if (i > 0) {
			this.singleSiteContent += '<hr class="sample-separator" />';
		}
		var sample = data.types[i];

		this.singleSiteContent += '<p class="sample-data"><b>Sample Type: </b>' + sample.Type + '</p>';
		this.singleSiteContent += '<p class="sample-data"><b>#&delta;<sup>2</sup>H measurements: </b>' + sample.Count_d2H + '</p>';
		this.singleSiteContent += '<p class="sample-data"><b>#&delta;<sup>18</sup>O measurements: </b>' + sample.Count_d18O + '</p>';
		this.singleSiteContent += '<p class="sample-data"><b>Earliest Sample Date: </b>' + sample.Min_Date_Collected + '</p>';
		this.singleSiteContent += '<p class="sample-data"><b>Latest Sample Date: </b>' + sample.Max_Date_Collected + '</p>';
		this.singleSiteContent += projectsContentString;
	}

	this.singleSiteContent += '</div>';

	return this.singleSiteContent;
};

SingleSite.prototype.getSiteProjectContent = function(projects) {
	// write information for each project
	var projectsContentString = '';
	for (var i = 0; i < projects.length; ++i) {
		// add a separator after the first project
		if (i > 0) {
			projectsContentString += '<hr class="sample-separator" />';
		}

		var project = projects[i];

		projectsContentString += '<p class="sample-data"><b>Project ID: </b></p>';
		projectsContentString += '<button class="btn-project" onclick="APP.onProjectButtonClicked(this.id)" id="btn-project-' + project.Project_ID + '">' + project.Project_ID + '</button>';

		// offer download button only for non-proprietary data
		if (project.Proprietary == 0) {
			projectsContentString += '<button class="btn-download-data" onclick="APP.onDownloadDataButtonClicked(this.id)" id="btn-download-data-' + project.Project_ID + '">Download Data</button>';
		}
	}

	return projectsContentString;
};

SingleSite.prototype.getSingleProjectContent = function(data) {
	var projectData = data.project;

	var contentString = '<div id="div-project-data">';

	contentString += '<p class="sample-site-name"><b>Project ID: </b>' + projectData.Project_ID + '</p>';

	if (projectData.Project_Name != "") {
		contentString += '<p class="sample-data"><b>Project Name: </b>' + projectData.Project_Name + '</p>';
	}

	if (projectData.Contact_Name != "") {
		contentString += '<p class="sample-data"><b>Contact Name: </b>' + projectData.Contact_Name + '</p>';
	}

	if (projectData.Contact_Email != "") {
		contentString += '<p class="sample-data"><b>Contact Email: </b>' + projectData.Contact_Email + '</p>';
	}

	if (projectData.Citation != "") {
		contentString += '<p class="sample-data"><b>Citation: </b>' + projectData.Citation + '</p>';
	}

	if (projectData.URL != "") {
		contentString += '<p class="sample-data"><b>URL: </b>' + projectData.URL + '</p>';
	}

	contentString += '<button id="btn-project-back" onclick="APP.onProjectBackButtonClicked()">Back</button>';
	contentString += '</div>';

	return contentString;
};

SingleSite.prototype.showProjectData = function(data) {
	var contentString = this.getSingleProjectContent(data);
	$('#div-info-window-container').html(contentString);
};

SingleSite.prototype.showSingleSiteData = function() {
	if (this.singleSiteContent == undefined || this.singleSiteContent == '') {
		HELPER.ERROR_LOG("SingleSite.showSingleSiteData could not find the current site's content!");
		return;
	}

	$('#div-info-window-container').html(this.singleSiteContent);
};