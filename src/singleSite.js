var SingleSite = function(siteID) {
	this.singleSiteContent = '';
	this.siteID = siteID;
};

SingleSite.prototype.getSingleSiteContent = function(data) {

	// handle empty data separately
	if (data.types.length <= 0) {
		HELPER.ERROR_LOG("Received empty data for site ID:" + this.siteID);

		this.singleSiteContent = "<div id=\'div-info-window-container\'>";
		this.singleSiteContent += '<p class="sample-data" style="margin-left: 25px; text-indent: 0px;"><b>No samples currently available at this site.</b></p>';
		this.singleSiteContent += '</div>';
		
		return this.singleSiteContent;
	}

	this.singleSiteContent = '<div id="div-info-window-container">';

	// write the site name
	this.singleSiteContent += '<p class="sample-site-name"><b>Site Name: </b>' + data.site_name + '</p>';

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
		
		// add project information for this site
		var containsNonPropietary = false;
		for (var i = 0; i < sample.projects.length; ++i) {
			var project = sample.projects[i];

			this.singleSiteContent += '<p class="sample-data"><b>Project ID: </b>';
			this.singleSiteContent += '<button class="btn-project" onclick="APP.onProjectButtonClicked(this.id)" id="btn-project-' + project.Project_ID + '">' + project.Project_ID + '</button>';
			this.singleSiteContent += '</p>';

			containsNonPropietary = containsNonPropietary || (project.Proprietary == 0);
		}

		if (containsNonPropietary) {
			this.singleSiteContent += '<button class="btn-download-data" onclick="APP.onDownloadDataButtonClicked(this.id)" id="btn-download-data-' + this.siteID + '">Download Data</button>';			
		}
	}

	this.singleSiteContent += '</div>';

	return this.singleSiteContent;
};

SingleSite.prototype.getSiteProjectContent = function(projects) {
	// write information for each project
	var projectsContentString = '';

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
		contentString += '<p class="sample-data"><b>Contact Email: </b><a href="mailto:' + projectData.Contact_Email + '">' + projectData.Contact_Email + '</a></p>';
	}

	if (projectData.Citation != "") {
		contentString += '<p class="sample-data"><b>Citation: </b>' + projectData.Citation + '</p>';
	}

	if (projectData.URL != "") {
		contentString += '<p class="sample-data"><b>URL: </b><a target="_blank" href="' + projectData.URL + '">' + projectData.URL + '</a></p>';
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

SingleSite.prototype.showDownloadDataLink = function(data) {
	// anchor tag approach
	var element = document.createElement('a');
	element.setAttribute('href', 'data/Sample.csv');

	element.style.display = 'none';
	$('#div-info-window-container').append(element);

	element.click();
	element.remove();

	// iframe approach
	// var iframe = document.createElement('iframe');
	// iframe.setAttribute('src', 'data/Sample.csv');
	// iframe.setAttribute('style', 'display: none');
	// $('#div-info-window-container').append(iframe);
};