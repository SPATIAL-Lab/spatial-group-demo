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
