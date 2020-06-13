var express = require('express');
var bodyParser = require('body-parser');
var builder = require('xmlbuilder');

const https = require('https');
const http = require('http');
var PORT = process.env.PORT || 3000;
function Constants() {
	
	this.aggregateTypes = {
		"1":"SUM",
		"2":"COUNT",
		"3":"MIN",
		"4":"MAX",
	};
	
	this.sqlTypestoEdmTypesMap = {
		"BIGINT": "Edm.Int64",
		"BINARY": "Edm.Binary",
		"BIT": "Edm.Boolean",
		"BOOLEAN": "Edm.Boolean",
		"CHAR": "Edm.String",
		"DATE": "Edm.DateTime",
		"DECIMAL": "Edm.Decimal",
		"DOUBLE": "Edm.Double",
		"FLOAT": "Edm.Double",
		"INTEGER": "Edm.Int32",
		"LONGVARBINARY1": "Edm.Binary",
		"LONGVARCHAR2": "Edm.String",
		"REAL": "Edm.Single",
		"SMALLINT": "Edm.Int16",
		"TIME": "Edm.TimeOfDay",
		"TIMESTAMP": "Edm.DateTime",
		"TINYINT": "Edm.Byte",
		"VARBINARY": "Edm.Binary",
		"VARCHAR": "Edm.String",
		"NVARCHAR": "Edm.String",
		"STRING": "Edm.String"
	};

	this.metadataTemplate = '<?xml version="1.0" encoding="UTF-8"?><edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="1.0">	<edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="1.0">		<Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="sap.iot.cm.{{MODEL_NAME}}">{{ENTITY_TYPE_CONTENT}}<EntityContainer Name="AggregatesContainer" m:IsDefaultEntityContainer="true">				<EntitySet Name="Aggregates" EntityType="sap.iot.cm.{{MODEL_NAME}}.AggregateType"/>			</EntityContainer>		</Schema>	</edmx:DataServices></edmx:Edmx>';

	this.MDSMetadataRequestTemplate = '{"Metadata":{"Capabilities":["AggregationNOPNULL","AggregationNOPNULLZERO","AsyncMetadataBatchRequest","AttributeHierarchy","AttributeHierarchyHierarchyFields","AttributeHierarchyUniqueFields","AttributeValueLookup","AverageCountIgnoreNullZero","BugFixHierarchyFlatKeys","CEScenarioParams","CalculatedDimension","CancelRunningRequests","CellValueOperand","ClientCapabilities","CubeBlending","CubeBlendingCustomMembers","CubeBlendingMemberSorting","CubeBlendingOutOfContext","CubeBlendingProperties","CubeBlendingReadMode","CurrentMemberFilterExtension","CustomDimension2","CustomDimensionFilterCapabilities","CustomDimensionMemberExecutionStep","CustomMemberSortOrder","DataEntryOnUnbooked","DatasourceAtService","DimensionKindChartOfAccounts","DimensionKindEPMVersion","EPMResponseListSharedVersions","ExceptionAggregationAverageNullInSelectionMember","ExceptionAggregationCountNullInSelectionMember","ExceptionAggregationDimsAndFormulas","ExceptionSettings","Exceptions","ExpandHierarchyBottomUp","ExtHierarchy","ExtendedDimensions","ExtendedDimensionsChangeDefaultRenamingAndDescription","ExtendedDimensionsCopyAllHierarchies","ExtendedDimensionsFieldMapping","ExtendedDimensionsJoinCardinality","ExtendedDimensionsJoinColumns","ExtendedDimensionsOuterJoin","ExtendedDimensionsSkip","FastPath","FixMetaDataHierarchyAttributes","FlatKeyOnHierarchicalDisplay","HierarchyDataAndExcludingFilters","HierarchyKeyTextName","HierarchyNavigationDeltaMode","HierarchyPath","HierarchyPathUniqueName","HierarchyTrapezoidFilter","HierarchyVirtualRootNode","IgnoreUnitOfNullValueInAggregation","IgnoreUnitOfZeroValueInAggregation","InputReadinessStates","ListReporting","LocaleSorting","MaxResultRecords","MdsExpression","MetadataCubeQuery","MetadataDataCategory","MetadataDataSourceDefinitionValidation","MetadataDataSourceDefinitionValidationExposeDataSource","MetadataDefaultResultStructureResultAlignmentBottom","MetadataDimensionCanBeAggregated","MetadataDimensionDefaultMember","MetadataDimensionGroup","MetadataDimensionVisibility","MetadataDynamicVariable","MetadataHierarchyLevels","MetadataHierarchyRestNode","MetadataHierarchyStructure","MetadataHierarchyUniqueName","MetadataIsDisplayAttribute","MetadataRepositorySuffix","MetadataSemanticType","MultiSource","Obtainability","PagingTupleCountTotal","PersistResultSet","PlanningOnCalculatedDimension","ReadMode","ReadModeRelatedBooked","RemoteBlending","RemoteBlendingBW","RemoteFilter","RequestTimeZone","RestrictedMembersConvertToFlatSelection","ResultSetAxisType","ResultSetCellDataType","ResultSetCellFormatString","ResultSetCellNumericShift","ResultSetInterval","ResultSetState","ResultSetUnitIndex","ReturnErrorForInvalidQueryModel","ReturnRestrictedAndCalculatedMembersInReadmodeBooked","ReturnedDataSelection","SP9","SemanticalErrorType","SetNullCellsUnitType","SortNewValues","SpatialClustering","SpatialFilterSRID","StatisticalAggregations","SupportsComplexFilters","SupportsCubeBlendingAggregation","SupportsDataCellMixedValues","SupportsEncodedResultSet","SupportsEncodedResultSet2","SupportsExtendedSort","SupportsHierarchySelectionAsFlatSelection","SupportsIgnoreExternalDimensions","SupportsInAModelMetadata","SupportsMemberVisibility","SupportsSetOperand","SupportsSpatialFilter","SupportsSpatialTransformations","TechnicalAxis","Totals","TotalsAfterVisibilityFilter","UniqueAttributeNames","UseEPMVersion","ValuesRounded","Variables","VirtualDataSourceVariableValues","VisibilityFilter","VisualAggregation"],"Context":"Analytics","DataSource":{"InstanceId":"ffc5ca67-9a99-30a2-c756-c625690c6d47","ObjectName":"{{MODEL_NAME}}","PackageName":"##SCHEMA##.sap.iot.cm.g.views","SchemaName":"##SCHEMA##","Type":"View"},"Expand":["Cube"],"Language":"en"},"Options":[]}';

	this.xmlResponseTemplate = '<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xml:base="{{ODATA_URL}}/">    <id>{{ODATA_URL}}/Aggregates</id>    <title type="text">Aggregates</title>    <updated>{{TIME}}</updated>    <author>        <name/>    </author>    <link href="Aggregates" rel="self" title="Aggregates"/>{{ENTITY_CONTENT}}</feed>';	
	
	this.baseTemplate = '<?xml version="1.0" encoding="utf-8"?><service xml:base="{{ODATA_URL}}/" xmlns="http://www.w3.org/2007/app" xmlns:atom="http://www.w3.org/2005/Atom"><workspace><atom:title>Default</atom:title><collection href="Aggregates"><atom:title>Aggregates</atom:title></collection></workspace></service>';
	
	return this;
}

var constants = new Constants();
	

function Cache() {
	
	var cache = {};
	
	this.cacheData = function(key,content,expiryInMinutes) {

		if ( expiryInMinutes === undefined ) {
			expiryInMinutes = 5;
		}
		
		expiryInMinutes = parseInt(expiryInMinutes);

		var d = cache[key];
		if ( d !== undefined )
			delete cache[key];
		
		var expiryTime = new Date();
		
		expiryTime.setTime(expiryTime.getTime()+expiryInMinutes*60*1000);
		
		cache[key] = {
			"expiryTime":expiryTime,
			"content":content
		};
		return true;
	}
	
	this.getData = function(key) {
		var d = cache[key];
		if ( d === undefined )
			return undefined;

		var now = new Date();

		if ( d.expiryTime < now ) {
			delete cache[key];
			return undefined;
		}
		return d.content;
	}
	
	return this;
}

var metadataCache = new Cache();

function ODataService() {
	
	var viewName;
	
	var metadata = {};
	
	var metadataLoaded = false;
	
	
	
	this.setModelName = function(modelName) {
		viewName = modelName;
	};
	
	var getDataType = function(property) {
//		console.log("getDataType "+JSON.stringify(property));
		var edmType = constants.sqlTypestoEdmTypesMap[property.SQLType];
		if ( edmType == undefined ) {
			for ( var SQLType in constants.sqlTypestoEdmTypesMap ) {
				if ( property.SQLType.indexOf(SQLType) == 0 ) {
					edmType = constants.sqlTypestoEdmTypesMap[SQLType];
					break;
				}
			}
		}
		return edmType;
	};
	
	var prepareMetadata = function(data) {
		
		try {

		parseMetadataMDSResponse(data);
		
			if ( !metadata.hasError ) {
			
				var entityTypeXML = builder.create("EntityType",undefined,undefined,{headless:true});
				
				entityTypeXML.att("Name","AggregateType");
				
				var keyXML = entityTypeXML.ele("Key");
				var keyReference = keyXML.ele("PropertyRef");
				keyReference.att("Name","Id");

				var propertyXML = entityTypeXML.ele("Property");
				propertyXML.att("Name","Id");
				propertyXML.att("Type","Edm.String");
				propertyXML.att("Nullable",false);
					
				for ( var i = 0; i < metadata.properties.length; i++ ) {
					var propertyXML = entityTypeXML.ele("Property");
					propertyXML.att("Name",metadata.properties[i].Name);
					var edmType = metadata.properties[i].EdmType;
					propertyXML.att("Type",edmType);
					propertyXML.att("Nullable",metadata.properties[i].IsNotNull===false);
					if ( edmType === "Edm.String" )
						propertyXML.att("MaxLength",5000);
					else if ( edmType === "Edm.Decimal" ) {
						propertyXML.att("Precision",metadata.properties[i].Digits);
						propertyXML.att("Scale",metadata.properties[i].FractDigits);
					}
				}
				
				var metadataXML = constants.metadataTemplate.replace(/{{MODEL_NAME}}/g,viewName);
				metadataXML = metadataXML.replace("{{ENTITY_TYPE_CONTENT}}",entityTypeXML.end());
				metadata.content = metadataXML;
				metadata.status = 200;
				metadata.contentType = "application/xml";
				
				metadataLoaded = true;
			}
		} catch(ex) {
			console.log("prepareMetadata Exception: "+ex);
		}
		return metadata;
	};

	parseMetadataMDSResponse = function(data) {
		
		metadata.properties = [];
		metadata.propertiesMap = {};
		
		if ( !data.Cube ) {
			metadata.status = 404;
			metadata.contentType = "application/text";
			metadata.content = "Calculation View "+viewName+" doesn't exist";
			metadata.hasError = true;
		} else {

			for (var i = 0; i < data.Cube.Dimensions.length;i++){
				if ( data.Cube.Dimensions[i].Name === "TIME" ) continue;
				if ( data.Cube.Dimensions[i].CanBeAggregated ) {
					var property = {};
					property.Name = data.Cube.Dimensions[i].Name;
					
					for ( var j = 0; j < data.Cube.Dimensions[i].Attributes.length; j++ ) {
						if (data.Cube.Dimensions[i].Attributes[j].AliasName == property.Name ) {
							property.Description = data.Cube.Dimensions[i].Attributes[j].Description;
							property.DataType = data.Cube.Dimensions[i].Attributes[j].DataType;
							property.SQLType = data.Cube.Dimensions[i].Attributes[j].SQLType;
							property.Digits = data.Cube.Dimensions[i].Attributes[j].Digits;
							property.FractDigits = data.Cube.Dimensions[i].Attributes[j].FractDigits;
							var edmType = getDataType(property);
							property.EdmType = edmType;
							property.SemanticType = data.Cube.Dimensions[i].Attributes[j].SemanticType;
							property.IsFilterable = data.Cube.Dimensions[i].Attributes[j].IsFilterable;
							property.IsMeasure = data.Cube.Dimensions[i].Attributes[j].IsMeasure;
							property.IsNotNull = data.Cube.Dimensions[i].Attributes[j].IsNotNull;
							break;
						}
					}
					metadata.properties.push(property);
					metadata.propertiesMap[property.Name] = property;
				} else {
					for ( var j = 0; j < data.Cube.Dimensions[i].Members.length; j++ ) {
						var property = {};
						property.Name = data.Cube.Dimensions[i].Members[j]["[Measures].[Name]"];
						property.Description = data.Cube.Dimensions[i].Members[j]["[Measures].[Description]"];
						property.SQLType = data.Cube.Dimensions[i].Members[j]["[Measures].[SQLType]"];
						var edmType = getDataType(property);
						property.EdmType = edmType;
						property.SemanticType = data.Cube.Dimensions[i].Members[j]["[Measures].[SemanticType]"];
						property.Digits = data.Cube.Dimensions[i].Members[j]["[Measures].[Digits]"];
						property.FractDigits = data.Cube.Dimensions[i].Members[j]["[Measures].[FractDigits]"];
						property.Aggregation = data.Cube.Dimensions[i].Members[j]["[Measures].[Aggregation]"];
						property.AggregateType = constants.aggregateTypes[property.Aggregation+""];
						property.IsMeasure = true;
						property.IsNotNull = false;
						metadata.properties.push(property);
						metadata.propertiesMap[property.Name] = property;
					}
				}
			}	
			metadata.status = 200;
		}
		

	}
	
	var loadMetadata = function(request) {
	
		var promise = new Promise(function(resolve,reject){
			console.log('Fetching Metadata call for '+viewName);
			
			var query = constants.MDSMetadataRequestTemplate.replace("{{MODEL_NAME}}",viewName);
			query = JSON.parse(query);
			
			var myCallback = function(status,data) {
				
				if ( data.status === 200 ) {
					var metadata = prepareMetadata(data.content);
					metadataLoaded = true;
					resolve(metadata);
				} else {
					reject(data);
				}
			};
			
			executeMDSQuery(query,request,myCallback);
			
		
		});
		
		return promise;
	};

	
	this.getMetadata = function(request) {
//		console.log('getMetadata 1');

		return new Promise(function(resolve,reject){
//			console.log('getMetadata 2');
			if ( metadataLoaded ) {
//				console.log('getMetadata 3');
				resolve(metadata);
			} else {
//				console.log('getMetadata 4');
				loadMetadata(request).then(function(data){
//					console.log('getMetadata 5');
					resolve(data);
				},function(data){
//					console.log('getMetadata 6');
					reject(data);
				})
			}
		});
	}
	

	var _processEntitySetCall = function(request) {
		return new Promise(function(resolve,reject){

			try {
			var model = processAggregatesRequest(request);
			
			var format = "xml";
			var formatQuery = request.query["$format"];
			if ( formatQuery === undefined ) {
				if ( request.accepts("application/json") === "application/json") {
					format = "json";
				}
			} else if ( formatQuery === "json" ) {
				format = 'json';
			}
			
			var protocol = "http://";
				if ( request.secure ) {
					protocol = "https://";
				}
				
			var oDataURL = protocol+request.hostname+":"+PORT+"/odata/"+request.params.space+"/"+viewName;
			var host = oDataURL+"/Aggregates";
			
			if ( model.error !== undefined ) {
				var response = formatResponseData(model,format,request,oDataURL);
				reject(response);
			}
			var query = createMDSQuery(model,request);
			
			} catch(ex) {
				console.log("_processEntitySetCall Exception: "+ex);
			}
			
			var myCallback = function(status,data) {
				var mdsResponse = data.content;
				if ( !status ) {
					reject(data);
				}
				if ( mdsResponse.Messages !== undefined && mdsResponse.Messages.length > 0 ) {
					model.error = getErrorMessage(request,mdsResponse.Messages[0].Text);
					model.status = 400;
					var response = formatResponseData(model,format,request,oDataURL);
					reject(response);
					return;
				}
				model = convertMDSResponseToJSON(mdsResponse);
				processDataset(model,format,request,host);
				var response = formatResponseData(model,format,request,oDataURL);
				resolve(response);
			};
			
			
			executeMDSQuery(query,request,myCallback);
			
			
		});
	};
	
	this.processEntitySetCall = function(request) {
		
		if ( metadataLoaded ) {
			return _processEntitySetCall(request);
		}
		
		return new Promise(function(resolve,reject){
			if ( !metadataLoaded ) {
				loadMetadata(request).then(function(data){
					_processEntitySetCall(request).then(function(data){
						resolve(data);
					},function(data){
						reject(data);
					});
				},function(data){
					reject(data);
				});
			}
			
		});
	};
	
	var processAggregatesRequest = function(request) {

		var dataModel = {};
//		console.log('processAggregatesRequest '+JSON.stringify(request.query));
		
		if ( request.query && request.query["$select"] == undefined ) {
//		console.log('processAggregatesRequest 2');
			dataModel.select = metadata.properties;
		} else {

			dataModel.select = [];
			var selectColumns = request.query["$select"].split(",");
			for ( var i = 0; i < selectColumns.length; i++ ) {
				if ( metadata.propertiesMap[selectColumns[i]] === undefined ) {
					dataModel.error = getErrorMessage(request,"Type 'sap.iot.cm."+viewName+"' does not have a property named '"+selectColumns[i]+"'.");
					dataModel.status = 400;
					return dataModel;
				} else {
					dataModel.select.push(metadata.propertiesMap[selectColumns[i]]);
				}
			}
		}
		return dataModel;
	};
	
	var getErrorMessage = function(request,message) {
		return { "error": { "code":"", "message":{"lang":"en-US" , "value" : message}}};
	};
	
	
	var processDataset = function(data,format,request,host) {
		
		if ( data.content ) {
			
			var selectColumns = (request.query["$select"]!== undefined)?request.query["$select"].split(","):[];
			
			for (var i = 0; i < data.content.length; i++ ) {
				
				for ( var p in data.content[i] ) {
					
					if ( selectColumns.length > 0 && selectColumns.indexOf(p) == -1 ) {
						delete data.content[i][p];
						continue;
					}
					
					var propMetadata = metadata.propertiesMap[p];
					if ( propMetadata.EdmType === "Edm.DateTime" ) {
						if ( data.content[i][p] !== undefined && data.content[i][p] !== "" ) {
							var time = Date.parse(data.content[i][p]);
							if ( format === "json" ) {
								data.content[i][p] = "/Date("+time+")/";
							} else if ( format === "xml" ) {
								var now = new Date();
								now.setTime(time);
								data.content[i][p] = now.toISOString().replace("z","");
							}
						} else {
							if ( format === "json" ) {
								data.content[i][p] = null;
							}
						}
						
					} else if ( ["Edm.Int32","Edm.Int16"].indexOf(propMetadata.EdmType) !== -1  ) {
						if ( data.content[i][p] !== undefined ) {
							data.content[i][p] = parseInt(data.content[i][p]);
						}
					} else if ( ["Edm.Decimal","Edm.Int64","Edm.Double","Edm.Byte","Edm.String","Edm.Time","Edm.Binary"].indexOf(propMetadata.EdmType) !== -1 ) {
						if ( data.content[i][p] === undefined ) {
							data.content[i][p] = null;
						} else {
							data.content[i][p] = ""+data.content[i][p];
						}
						
						if ( ["Edm.Decimal","Edm.Int64","Edm.Double","Edm.Byte"].indexOf(propMetadata.EdmType) !== -1 ) {
							if ( data.content[i][p] === "" ) {
								data.content[i][p] = null;
							}
						}
					}
				}
				
				var id = (i+1)+"";
				data.content[i].Id = id;
				var uri = host+"('"+id+"')";
				data.content[i]["__metadata"] = {
					"id": uri,
                    "uri": uri,
                    "type": "sap.iot.cm."+viewName+".AggregateType"
                };

			}
			
			if ( request.query ) {
				var count = data.content.length;
				if ( request.query["$inlinecount"] === "allpages") {
					data.count = count+"";
				}
				
				var topQuery = request.query["$top"];
				var skipTokenQuery = request.query["$skipToken"];
				
				if ( topQuery !== undefined ) {
					
					topQuery = parseInt(topQuery);
					
					if ( skipTokenQuery !== undefined ) {
						skipTokenQuery = parseInt(skipTokenQuery);
					} else {
						skipTokenQuery = 0;
					}
					
					var limit = topQuery + skipTokenQuery;
					
					if ( count > limit ) {
						data.content.splice(limit,count-limit);
						
						if ( skipTokenQuery > 0 ) {
							data.content.splice(0,skipTokenQuery);
						}
						
						//generate next
						
						var nextURL = host + "?";
						var firstRecord = true;
						var addedSkipToken = false;
						for ( var q in request.query ) {
							if (!firstRecord ) {
								nextURL += "&";
							}
							firstRecord = false;
							
							nextURL += q + "=";
							
							if ( q === "$skipToken" ) {
								nextURL += limit;
								addedSkipToken = true;
							} else {
								nextURL += request.query[q];
							}
						}
						
						if ( !addedSkipToken ) {
							if (!firstRecord ) {
								nextURL += "&";
							}
							nextURL += "$skipToken=";
							nextURL += limit;
						}
						
						data.next = nextURL;
					}
				}
			}
		}
	};
	
	formatResponseData = function(model,format,request,oDataURL) {

		var response = {};
		
		if (format === "xml" ) {
			
			if ( model.error !== undefined ) {

				var errorXML = builder.create("error",undefined,undefined,{headless:true}	);
				errorXML.att("xmlns","http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
				errorXML.ele("code");
				var messageXML = errorXML.ele("message",{"xml:lang":model.error.error.message.lang},model.error.error.message.value);
				messageXML.att("xml:lang",model.error.error.message.lang);
				response.status = model.status;
				response.content = errorXML.end();
				response.contentType = "application/xml";
			} else {

				var data = model;
						
				var template = constants.xmlResponseTemplate;
				var xml = "";
				var time = (new Date()).toISOString();
				var oDataName = "";
				
				if ( data.count !== undefined ) {
					xml += "<m:count>"+data.count+"</m:count>";
				}
				
				for ( var i =0; i < data.content.length; i++ ) {
					var entryXML = builder.create("entry",undefined,undefined,{headless:true}	);
					entryXML.ele("id",{},data.content[i]["__metadata"].uri);
					entryXML.ele("title",{"type" : "text"},'Aggregates');	
					entryXML.ele("updated",time);	
					entryXML.ele("category",{"term":"sap.iot.cm."+viewName,"scheme":"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"});	
					var contentXML = entryXML.ele("content",{"type":"application/xml"});
					var propertiesXML = contentXML.ele("m:properties");
					
					for ( var property in data.content[i] ) {
						if ( property === "__metadata" )	continue;
						var att = {}
						if ( data.content[i][property] == undefined || data.content[i][property] === "" ) {
							att["m:null"] = "true";
						}
						propertiesXML.ele("d:"+property,att,data.content[i][property]);
					}			
					xml += entryXML.end();
				}
				
				if ( data.next !== undefined ) {
					xml += "<link href=\""+data.next+"\" rel=\"next\"/>";
				}
				
				template = template.replace(/{{ODATA_URL}}/g,oDataURL);
				template = template.replace(/{{TIME}}/g,time);
				template = template.replace(/{{ENTITY_CONTENT}}/g,xml);
				

				response.status = 200;
				response.content = template;
				response.contentType = "application/xml";
			}
			
		} else if ( format === "json" ) {
			if ( model.error !== undefined ) {
				response.status = model.status;
				response.content = JSON.stringify(model.error);
				response.contentType = "application/json";
			} else {
				
				response.status = 200;
				var finalContent = { d : {}};
				
				if ( model.count !== undefined ) {
					finalContent.d["__count"] = model.count;
				}
				
				if ( model.next !== undefined ) {
					finalContent.d["__next"] = model.next;
				}

				finalContent.d.results = model.content;
				
				response.content = JSON.stringify(finalContent);
				response.contentType = "application/json";	
			}
			
		}
		return response;
	};
	
	createMDSQuery = function(model,request) {
		
		if ( model.select === undefined ) {
			model.select = metadata.properties;
		}

		var dimTemplate = '{	"Attributes": [		{			"Name": "[#DIMENSIONNAME#].[#DIMENSIONNAME#]",			"Obtainability": "UserInterface"		}	],	"Axis": "Rows",	"Name": "#DIMENSIONNAME#",	"NonEmpty": true,	"ReadMode": "Booked",	"ResultStructure": [		{			"Result": "Members",			"Visibility": "Visible"		}	]}';

		var measuresTemplate = '{"Attributes": [{"Name": "[Measures].[Measures]","Obtainability": "UserInterface"},{"Name": "[Measures].[Description]","Obtainability": "UserInterface"}],"Axis": "Columns","Members": [#MEASUREMEMBERS#],"Name": "CustomDimension1","NonEmpty": true,"ReadMode": "Booked"}';

		var measureTemplate = '{"Aggregation": "#AGGMETHOD#","MemberOperand": {"AttributeName": "Measures","Comparison": "=","Value": "#MEASURENAME#"},"NumericPrecision": #PRECISION#,"NumericScale": #SCALE#,"Visibility": "Visible"}';

		var dimensionRows = "";
		
		var measureRows = "";

		var isFirstDimension = true;
		
		var isFirstMeasure = true;
		
		for (var i = 0; i < model.select.length; i++) {
			if ( model.select[i].IsMeasure ) {
				if (!isFirstMeasure) {
					measureRows += ",";
				}
				isFirstMeasure = false;
				var measureStrig = measureTemplate.replace(/#AGGMETHOD#/g, model.select[i].AggregateType);
				measureStrig = measureStrig.replace(/#MEASURENAME#/g, model.select[i].Name);
				measureStrig = measureStrig.replace(/#PRECISION#/g, model.select[i].Digits);
				measureStrig = measureStrig.replace(/#SCALE#/g, model.select[i].FractDigits);
				measureRows += measureStrig;
			} else {
				if (!isFirstDimension) {
					dimensionRows += ",";
				}
				isFirstDimension = false;
				var dimString = dimTemplate.replace(/#DIMENSIONNAME#/g, model.select[i].Name);
				dimensionRows += dimString;
			}
		}

		measureRows = measuresTemplate.replace(/#MEASUREMEMBERS#/g, measureRows);

		dimensionRows += "," + measureRows;

		var inATemplate = '{	"Analytics": {		"Capabilities": [	"AggregationNOPNULL",		"AggregationNOPNULLZERO",			"AsyncMetadataBatchRequest",			"AttributeHierarchy",			"AttributeHierarchyHierarchyFields",			"AttributeHierarchyUniqueFields",			"AttributeValueLookup",			"AverageCountIgnoreNullZero",			"CEScenarioParams",			"CalculatedDimension",			"CancelRunningRequests",			"CellValueOperand",			"ClientCapabilities",			"CubeBlending",			"CubeBlendingCustomMembers",			"CubeBlendingMemberSorting",			"CubeBlendingOutOfContext",			"CubeBlendingProperties",			"CubeBlendingReadMode",			"CurrentMemberFilterExtension",			"CustomDimension2",			"CustomDimensionFilterCapabilities",			"CustomDimensionMemberExecutionStep",			"CustomMemberSortOrder",			"DataEntryOnUnbooked",			"DatasourceAtService",			"DimensionKindChartOfAccounts",			"DimensionKindEPMVersion",			"EPMResponseListSharedVersions",			"ExceptionAggregationAverageNullInSelectionMember",			"ExceptionAggregationCountNullInSelectionMember",			"ExceptionAggregationDimsAndFormulas",			"ExceptionSettings",			"Exceptions",			"ExpandHierarchyBottomUp",			"ExtHierarchy",			"ExtendedDimensions",			"ExtendedDimensionsChangeDefaultRenamingAndDescription",			"ExtendedDimensionsCopyAllHierarchies",			"ExtendedDimensionsFieldMapping",			"ExtendedDimensionsJoinCardinality",			"ExtendedDimensionsJoinColumns",			"ExtendedDimensionsOuterJoin",			"ExtendedDimensionsSkip",			"FastPath",			"FixMetaDataHierarchyAttributes",			"FlatKeyOnHierarchicalDisplay",			"HierarchyDataAndExcludingFilters",			"HierarchyKeyTextName",			"HierarchyNavigationDeltaMode",			"HierarchyPath",			"HierarchyPathUniqueName",			"HierarchyTrapezoidFilter",			"HierarchyVirtualRootNode",			"IgnoreUnitOfNullValueInAggregation",			"IgnoreUnitOfZeroValueInAggregation",			"InputReadinessStates",			"ListReporting",			"LocaleSorting",			"MaxResultRecords",			"MdsExpression",			"MetadataCubeQuery",			"MetadataDataCategory",			"MetadataDataSourceDefinitionValidation",			"MetadataDataSourceDefinitionValidationExposeDataSource",			"MetadataDefaultResultStructureResultAlignmentBottom",			"MetadataDimensionCanBeAggregated",			"MetadataDimensionDefaultMember",			"MetadataDimensionGroup",			"MetadataDimensionVisibility",			"MetadataDynamicVariable",			"MetadataHierarchyLevels",			"MetadataHierarchyRestNode",			"MetadataHierarchyStructure",			"MetadataHierarchyUniqueName",			"MetadataIsDisplayAttribute",			"MetadataRepositorySuffix",			"MetadataSemanticType",			"MultiSource",			"Obtainability",			"PagingTupleCountTotal",			"PersistResultSet",			"PlanningOnCalculatedDimension",			"ReadMode",			"ReadModeRelatedBooked",			"RemoteBlending",			"RemoteBlendingBW",			"RequestTimeZone",			"RestrictedMembersConvertToFlatSelection",			"ResultSetAxisType",			"ResultSetCellDataType",			"ResultSetCellFormatString",			"ResultSetCellNumericShift",			"ResultSetInterval",			"ResultSetState",			"ResultSetUnitIndex",			"ReturnErrorForInvalidQueryModel",			"ReturnRestrictedAndCalculatedMembersInReadmodeBooked",			"ReturnedDataSelection",			"SP9",			"SemanticalErrorType",			"SetNullCellsUnitType",			"SortNewValues",			"SpatialClustering",			"SpatialFilterSRID",			"StatisticalAggregations",			"SupportsComplexFilters",			"SupportsCubeBlendingAggregation",			"SupportsDataCellMixedValues",			"SupportsEncodedResultSet",			"SupportsEncodedResultSet2",			"SupportsExtendedSort",			"SupportsHierarchySelectionAsFlatSelection",			"SupportsIgnoreExternalDimensions",			"SupportsInAModelMetadata",			"SupportsMemberVisibility",			"SupportsSetOperand",			"SupportsSpatialFilter",			"SupportsSpatialTransformations",			"TechnicalAxis",			"Totals",			"TotalsAfterVisibilityFilter",			"UniqueAttributeNames",			"UseEPMVersion",			"ValuesRounded",			"Variables",			"VirtualDataSourceVariableValues",			"VisibilityFilter",			"VisualAggregation"		],		"DataSource": {			"InstanceId": "349fd2a1-708f-73f5-ff0d-e51f388ed904",			"ObjectName": "#MODELNAME#",			"PackageName": "##SCHEMA##.sap.iot.cm.g.views",			"SchemaName": "##SCHEMA##",			"Type": "View"		},		"Definition": {			"Dimensions": [#DIMENSIONVALUES#],			"ResultSetFeatureRequest": {				"ResultEncoding": "None",				"ResultFormat": "Version2",				"ReturnedDataSelection": {					"Actions": true,					"CellDataType": true,					"CellFormat": true,					"CellMeasure": false,					"CellValueTypes": true,					"ExceptionAlertLevel": false,					"ExceptionName": false,					"ExceptionSettings": true,					"Exceptions": true,					"InputEnabled": false,					"InputReadinessStates": true,					"NumericRounding": true,					"NumericShift": true,					"TupleDisplayLevel": true,					"TupleDrillState": true,					"TupleElementIds": true,					"TupleElementIndexes": false,					"TupleLevel": false,					"TupleParentIndexes": true,					"UnitDescriptions": true,					"UnitIndex": true,					"UnitTypes": true,					"Units": true,					"Values": true,					"ValuesFormatted": true,					"ValuesRounded": true				},				"SubSetDescription": {					"ColumnFrom": 0,					"ColumnTo": 60,					"RowFrom": 0,					"RowTo": 500				},				"UseDefaultAttributeKey": false			},			"Sort": []		},		"Language": "en"	},	"ClientInfo": {		"Context": {			"StoryId": "STORY:t.I:9D631AF6FD780A0CA3018097C2323B5E",			"StoryName": "New Document",			"WidgetId": [				"0896a402-1719-44cb-b896-11f11505058c"			]		}	},	"Options": []}';

		dimensionRows = inATemplate.replace(/#DIMENSIONVALUES#/g, dimensionRows);
		dimensionRows = dimensionRows.replace(/#MODELNAME#/g, viewName);

		var mdsQuery = JSON.parse(dimensionRows);
		
		return mdsQuery;
	};
	
	var convertMDSResponseToJSON = function(mdsResponse) {


		var json = mdsResponse;
		var data = {};

		if (json.Messages && json.Messages.length > 0) {
			data.message = JSON.stringify(json.Messages);
		} else if (json.Grids[0].Axes.length == 0) {
			if (json.Grids[0].Messages && json.Grids[0].Messages.length > 0) {
				data.message = JSON.stringify(json.Grids[0].Messages);
			}
		} else {

			var dimensions = json.Grids[0].Axes[0].Dimensions;
			var dIndexMap = {};

			var columns = ["TIMESTAMP"];
			var columnCounter = columns.length;
			for (var i = 0; i < dimensions.length; i++) {
				dIndexMap[i] = dimensions[i].Name;
				if (dimensions[i].Name !== "TIMESTAMP") {
					columns[columnCounter++] = dimensions[i].Name;
				}
			}

			var mIndexMap = {};
			var measures = json.Grids[0].Axes[1].Dimensions[0].Attributes[0].Values;
			for (var i = 0; i < measures.length; i++) {
				columns[columnCounter++] = measures[i];
			}
			var rows = [];

			var tuples = json.Grids[0].Axes[0].Tuples;

			for (var i = 0; i < tuples.length; i++) {
				var tuple = tuples[i];
				var values = tuple.TupleElementIds.Values;
				for (var j = 0; j < values.length; j++) {
					var record = undefined;
					if (rows.length > j) {
						record = rows[j];
					} else {
						record = {};
						rows[j] = record;
					}
					//        if ( values[j] !== undefined && values[j] !== "" )
					record[dIndexMap[i]] = values[j];
					//        else
					//            record[dIndexMap[i]] = "-";
				}
			}

			var measureValues = json.Grids[0].Cells.Values.Values;
			var recordCounter = 0;
			for (var i = 0; i < measureValues.length;) {
				var record = rows[recordCounter++];
				for (var j = 0; j < measures.length; j++) {
					record[measures[j]] = measureValues[i];
					i++;
				}
			}
			data.content = rows;
		}

		return data;
	};
	return this;
}


var app = express();

app.use(bodyParser.urlencoded({limit: '200mb',extended: true}));
app.use(bodyParser.json({limit: '200mb'}));


var that = this;

app.get('/odata/:space/:modelName',function(request,response){

//	console.log('Base call');
	if ( request.headers.authorization == undefined || request.headers.authorization.toLowerCase().indexOf("bearer") !== 0 ) {
		console.log('Unauthorized');
		response.writeHead(401, { 'Content-Type': 'text/plain' }); 
		response.write("Bearer token not found");
		response.end();
		return;
	}

	if ( destinations[request.params.space] === undefined ) {
		console.log('Invalid Application Space Name');
		response.writeHead(404, { 'Content-Type': 'text/plain' }); 
		response.write("Invalid Application Space Name");
		response.end();
		return;
	}
	
	var protocol = "http://";
	if ( request.secure ) {
		protocol = "https://";
	}
	
	var modelName = request.params.modelName;
				
	var oDataURL = protocol+request.hostname+":"+PORT+"/odata/"+request.params.space+"/"+modelName;
	
	var template = constants.baseTemplate.replace(/{{ODATA_URL}}/g,oDataURL);
	
    console.log('call received params: '+JSON.stringify(request.params));
	
    console.log('call received originalUrl: '+request.originalUrl);
    console.log('call received query: '+JSON.stringify(request.query));
	
	response.writeHead(200, { 'Content-Type': 'application/xml' }); 
	response.write(template);
	response.end();

});

app.get('/odata/:space/:modelName/*',function(request,response){

	if ( request.headers.authorization == undefined || request.headers.authorization.toLowerCase().indexOf("bearer") !== 0 ) {
		console.log('Unauthorized');
		response.writeHead(401, { 'Content-Type': 'text/plain' }); 
		response.write("Bearer token not found");
		response.end();
		return;
	}
	
    console.log('call received params: '+JSON.stringify(request.params));
	
	if ( destinations[request.params.space] === undefined ) {
		console.log('Invalid Application Space Name');
		response.writeHead(404, { 'Content-Type': 'text/plain' }); 
		response.write("Invalid Application Space Name");
		response.end();
		return;
	}
	
    console.log('call received originalUrl: '+request.originalUrl);
    console.log('call received query: '+JSON.stringify(request.query));
	
	 var modelName = request.params.modelName;
	 var wildcard = request.params[0];


	if ( wildcard == "$metadata" ) {
		that.getMetadata(modelName,request,response);
	} else if( wildcard == "Aggregates" ) {
		that.getAggregates(modelName,request,response);
	} else {
		console.log('bad request');
		response.writeHead(400, { 'Content-Type': 'application/text' }); 
		response.write("Invalid URL");
		response.end();

	}
});

var destinations = {};

var readDestinations = function() {
	
	var dest = process.env.destinations;
		  
	var destinationString = dest;
	if ( destinationString === undefined ) {
		console.log("ERROR: DESTINATIONS WERE NOT DETECTED");
		return;
	} else {
		console.log("DESTINATIONS WERE DETECTED");
	}
	
	var items = JSON.parse(dest);
	
	for ( var i = 0; i < items.length; i++ ) {
		destinations[items[i].name] = items[i];
	}
	
};

var server = app.listen(PORT,function () {
    console.log('Node server is running on port '+PORT);
	readDestinations();
});



this.getODataService = function(modelName,request) {
	
	var service = metadataCache.getData(modelName);
	if ( service == undefined ) {
		service = new ODataService();
		service.setModelName(modelName);
		metadataCache.cacheData(modelName,service,5);
	}
	return service;

};

this.getMetadata = function(modelName,request,response) {
	
	var service = this.getODataService(modelName);
	service.getMetadata(request).then(
		function(data){
			that.writeResponse(response,data);
		},
		function(data){
			that.writeResponse(response,data);
		}
	);
};

this.writeResponse = function(response,data) {
	response.writeHead(data.status, { 'Content-Type': data.contentType }); 
	response.write(data.content);
	response.end();
};

this.getAggregates = function(modelName,request,response) {
    console.log('aggregates call for '+modelName);
	var service = this.getODataService(modelName);
	service.processEntitySetCall(request).then(
		function(data){
			that.writeResponse(response,data);
		},
		function(data){
			console.log("error : "+JSON.stringify(data));
			that.writeResponse(response,data);
		}
	);

};

var executeMDSQuery = function(query,request,callback) {
	try {
	query = JSON.stringify(query);
//	console.log("executeMDSQuery: "+query.toString());

	var destination = destinations[request.params.space];
	var url = destination.url;
	if (url.indexOf("https://") == 0 ) {
		url = url.replace("https://",'');
	}

	const options = {
	  hostname: url,
	  path: "/sap/bc/ina/service/v2/GetResponse",
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'Accept':'application/json',
		'Authorization': request.headers.authorization
	  }
	};

	const req = https.request(options, res => {
//	  console.log(`statusCode: ${res.statusCode}`);
	  
	  if ( res.statusCode == 401 || res.statusCode == 403 ) {
		var response = {};
		response.status = res.statusCode;
		response.content = "Unauthorized/Forbidden";
		response.contentType = "text/plain";
		callback(false,response);
		return;
	  }

	  if ( res.statusCode != 200 ) {
		var response = {};
		response.status = res.statusCode;
		response.content = "";
		response.contentType = "text/plain";
		callback(false,response);
		return;
	  }
	  
	var data = "";
	  res.on('data', d => {
//	  	console.log("MDS Chunk Response: "+d.toString());
		data += d;
	  });
	  res.on('end', d => {
//	  	console.log("MDS Final Response: "+data.toString());
		var response = {};
		response.status = res.statusCode;
		response.content = JSON.parse(data);
		callback(true,response);
	  })
	});

	req.on('error', error => {
		console.log("MDS Query Failed: "+JSON.stringify(error));
	  callback(false,error);
	});
	
	req.write(query);
	req.end();
	
	} catch(ex) {
		console.log("executeMDSQuery Exception: "+ex);
	}
}




