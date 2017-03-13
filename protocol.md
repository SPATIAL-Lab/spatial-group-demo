Protocol for Spatial_WI API

Base URL: http://wateriso.utah.edu/api

All request and response type are in JSON.


*************** Get sites info ***************
To make easier, I decide to make two type of requests, Get and Post. Both return the same format of response.

Request:	[Get]	/sites.php
Note: Parameters are not needed.
This will return all the sites that have not null latitude and not null longitude, all types, and the maximum/minimum Collection_Date.

Request:	[Post] 	/sites.php
Note: This requires user's query. If some parameter is not applicable, make its value as null.
{
	"latitude"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"longitude"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"elevation"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"countries"		:	[
							{
								"Country"	:	STRING
							},
							...
						],
	"states"		:	[
							{
								"State"	:	STRING
							},
							...
						],
	"collection_date":	{
							"Min"	:	STRING, 	(format: "yyyy-MM-dd" )
							"Max"	:	STRING	 	(format: "yyyy-MM-dd" )
						},
	"types"			:	[
							{
								"Type"	:	STRING
							},
							...
						],
	"h2"			:	null or 1,
	"o18"			:	null or 1
}


Response:
{
	"status": 	{
					"Code"					:	INT,
					"Message"				:	STRING
				},
	"sites" : 	[
					{
						"Site_ID"			:	STRING,
						"Site_Name"			:	STRING,
						"Latitude"			:	DOUBLE,
						"Longitude"			:	DOUBLE,
						"Elevation_mabsl"	:	DOUBLE,
						"Address"			:	STRING,
						"City"				:	STRING,
						"State_or_Province"	:	STRING,
						"Country"			:	STRING,
						"Project"			:	STRING
					},
					...
				],
	"types"	:		[
								{
									"Type" : STRING
								},
								...
							],
	"dates"	:	{
							"Max" : STRING, 	(format: "yyyy-MM-dd" )
							"Min"	:	STRING		(format: "yyyy-MM-dd" )
						}
}
***************  End  ***************

*************** Get types info when giving a single Site_ID ***************
Request:	[Post] 	/single_site.php
Note: This requires user's query. If some parameter is not applicable, make its value as null.
{
	"site_id"		:	STRING,
	"latitude"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"longitude"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"elevation"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"countries"		:	[
							{
								"Country"	:	STRING
							},
							...
						],
	"states"		:	[
							{
								"State"	:	STRING
							},
							...
						],
	"collection_date":	{
							"Min"	:	STRING, 	(format: "yyyy-MM-dd" )
							"Max"	:	STRING	 	(format: "yyyy-MM-dd" )
						},
	"types"			:	[
							{
								"Type"	:	STRING
							},
							...
						],
	"h2"			:	null or 1,
	"o18"			:	null or 1
}

Response:
{
	"status": 	{
									"Code"		:	INT,
									"Message"	:	STRING
							},
	"site_name"	:	STRING,
	"types" : 	[
									{
										"Type"			:						STRING,
										"Count_of_Sample_ID"	:	INT,
										"Max_Date_Collected"	:	STRING, 	(format: "yyyy-MM-dd" )
										"Min_Date_Collected"	:	STRING, 	(format: "yyyy-MM-dd" )
										"Count_d2H"						:	INT,
										"Count_d18O"					:	INT,
										"projects":	[
																		{
																			"Project_ID"			: 	STRING,
																			"Proprietary"			:		INT
																		}
																]
									},
									...
							]
}
***************  End  ***************


*************** Get project info when giving a single Project_ID ***************
Request:	[Post] 	/single_project.php
Note: This requires user's query.
{
	"project_id"		:	STRING
}

Response:
{
	"status": 	{
									"Code"		:	INT,
									"Message"	:	STRING
							},
	"project" : {
									"Project_ID"			: 	STRING,
									"Contact_Name"		:		STRING,
									"Contact_Email"		:		STRING,
									"Citation"				:		STRING,
									"URL"							:		STRING,
									"Project_Name"		:		STRING,
									"Proprietary"			:		INT
							}
}
***************  End  ***************


*************** Return a .csv file when giving a pair of Site_ID and Project_ID ***************
Request:	[Post] 	/site_download.php
Note: This requires user's query. If some parameter is not applicable, make its value as null.
{
	"site_id"				: STRING,
	"latitude"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"longitude"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"elevation"		:	{
							"Min"	:	DOUBLE,
							"Max"	:	DOUBLE
						},
	"countries"		:	[
							{
								"Country"	:	STRING
							},
							...
						],
	"states"		:	[
							{
								"State"	:	STRING
							},
							...
						],
	"collection_date":	{
							"Min"	:	STRING, 	(format: "yyyy-MM-dd" )
							"Max"	:	STRING	 	(format: "yyyy-MM-dd" )
						},
	"types"			:	[
							{
								"Type"	:	STRING
							},
							...
						],
	"h2"			:	null or 1,
	"o18"			:	null or 1
}

Response:
{
	"status": 	{
									"Code"		:	INT,
									"Message"	:	STRING
							},
	"filePath":	STRING
}

The csv file containing the following information from the sites, samples, and water_isotope_data tables:

Site_Name
Latitude
Longitude
Elevation
Sample_ID
Type
Start_Date
Start_Time
Collection_Date
Collection_Time
Phase
Depth_meters
d2H
d18O
d2H_Analytical_SD
d18O_Analytical_SD
WI_Analysis_Source
WHERE Samples.Sample_Ignore = 0 AND Water_Isotope_Data.WI_Analysis_Ignore = 0 AND Projects.Proprietary = 0
***************  End  ***************
