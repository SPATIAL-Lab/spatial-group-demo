var HTML_WRITER = null;
var HTMLWriter = function() {
	
};

HTMLWriter.prototype.generateSiteContentString = function(data) {
	var contentString = '<div id="div-info-window-container">';

	// write the site name
	contentString += '<p class="sample-site-name"><b>Site Name: </b>' + data.site_name + '</p>';

	var projectsContentString = this.generateSiteProjectString(data.projects);

	// write information for each sample type
	for (var i = 0; i < data.types.length; ++i) {
		// add a separator after the first sample
		if (i > 0) {
			contentString += '<hr class="sample-separator" />';
		}

		var sample = data.types[i];

		contentString += '<p class="sample-data"><b>Sample Type: </b>' + sample.Type + '</p>';

		contentString += '<p class="sample-data"><b>#&delta;<sup>2</sup>H measurements: </b>' + sample.Count_d2H + '</p>';

		contentString += '<p class="sample-data"><b>#&delta;<sup>18</sup>O measurements: </b>' + sample.Count_d18O + '</p>';

		contentString += '<p class="sample-data"><b>Earliest Sample Date: </b>' + sample.Min_Date_Collected + '</p>';

		contentString += '<p class="sample-data"><b>Latest Sample Date: </b>' + sample.Max_Date_Collected + '</p>';

		contentString += projectsContentString;
	}

	contentString += '</div>';

	return contentString;
};

HTMLWriter.prototype.generateSiteProjectString = function(projects) {
	// write information for each project
	var projectsContentString = '';
	for (var i = 0; i < projects.length; ++i) {
		// add a separator after the first project
		if (i > 0) {
			projectsContentString += '<hr class="sample-separator" />';
		}

		var project = projects[i];

		projectsContentString += '<p class="sample-data"><b>Project ID: </b></p>';
		projectsContentString += '<button class="btn-project" onclick="FORM.onProjectClicked(this.id)" id="btn-project-' + project.Project_ID + '">' + project.Project_ID + '</button>';

		// offer download button only for non-proprietary data
		if (project.Proprietary == 0) {
			projectsContentString += '<button class="btn-download-data" onclick="FORM.onDownloadDataClicked(this.id)" id="btn-download-data-' + project.Project_ID + '">Download Data</button>';
		}
	}

	return projectsContentString;
};

HTMLWriter.prototype.generateProjectDataString = function(data) {
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

	contentString += '</div>';

	return contentString;
};