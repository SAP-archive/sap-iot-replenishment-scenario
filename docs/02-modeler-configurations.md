# Content Definitions

Below are the modeling artifacts that were considered in this scenario creation.

### Packages

Create a Package by using Fiori Launchpad Application as explained [here](https://help.sap.com/viewer/e057ad687acc4d2d8f2893609aff248b/1905a/en-US/5ba36c7bc9af4576997f72d6dddfc951.html).

Package Name : "TENANT-PACKAGE-NAMESPACE.com.connected.silos".

Where as "TENANT-PACKAGE-NAMESPACE" refers to the tenant specific package namespace as explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/462b49382316427aa59fe671a75fa39e.html).

Here is a sample structure to create this package via API's explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/72815137035e48e0ac38e50934e718df.html).

```
Service End Point: config-package-sap
```
```
{
  "Name": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos",
  "Scope": "private",
  "Description": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos",
  "Status": "Active",
  "Descriptions":[{
	"Description": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos",
	"LanguageCode": "en"
  }]
}
```

### Property Set Types

Create the below mentioned property set types by using the Fiori Launchpad Application as explained [here](https://help.sap.com/viewer/e057ad687acc4d2d8f2893609aff248b/1905a/en-US/2ad2ba3b5702479987d330d16a200051.html).

Property Set Types can be created alternatively via API's as explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/7e40790cad924439be08981c745f615b.html).

```
Service End Point: config-thing-sap
```
#### 1. SILO_METADATA
SILO_METADATA is a MasterData based Property Set Type that is used to maintain the basic master data of a silo.

Here is a sample structure of Property Set Type.

```json
{
  "Name": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_METADATA",
  "Description": "Silo Metadata",
  "DataCategory": "MasterData",
  "Descriptions": [{
    "LanguageCode": "en",
    "Description": "Silo Metadata"
  }],
  "Properties": [{
    "Name": "serialNumber",
    "Descriptions": [{
        "LanguageCode": "en",
        "Description": "Silo Serial Number"
      }],
    "Type": "String",
    "PropertyLength": "127",
    "QualityCode":"0"
  },
  {
    "Name": "moduleSerialNumber",
    "Descriptions": [{
        "LanguageCode": "en",
        "Description": "IoT Module Serial Number"
      }],
    "Type": "String",
    "PropertyLength": "127",
    "QualityCode":"0"
  },
  {
    "Name": "siloType",
    "Descriptions": [{
        "LanguageCode": "en",
        "Description": "Type of Silo"
      }],
    "Type": "String",
    "PropertyLength": "127",
    "QualityCode":"0"
  },
  {
    "Name": "siloCapacity",
    "Descriptions": [{
        "LanguageCode": "en",
        "Description": "Capacity of Silo"
      }],
    "Type": "Numeric",
    "PropertyLength": "8,3",
    "QualityCode":"0"
  },
  {
    "Name": "storageLocation",
    "Descriptions": [{
        "LanguageCode": "en",
        "Description": "Storage Location"
      }],
    "Type": "String",
    "PropertyLength": "127",
    "QualityCode":"0"
  },
  {
    "Name": "plant",
    "Descriptions": [{
        "LanguageCode": "en",
        "Description": "Plant"
      }],
    "Type": "String",
    "PropertyLength": "127",
    "QualityCode":"0"
  }]
}
```

#### 2. Material
Material is a MasterData based Property Set Type that is used to assign the currently maintain material for the selected silo.
Here is a sample structure of Property Set Type.

```json
{
  "Name": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:Material",
  "Description": "Material properties",
  "DataCategory": "MasterData",
  "Descriptions": [{
    "LanguageCode": "en",
    "Description": "Material properties"
  }],
  "Properties": [{
    "Name": "Material",
    "Type": "String",
    "PropertyLength": "127"
  }]
}
```


#### 3. SILO_TIME_SERIES
SILO_TIME_SERIES is a TimeSeriesData based Property Set Type that is used to capture the measured values of a silo

Here is a sample structure of Property Set Type.

```json
{
  "Name": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
  "Description": "Time Series of Silo",
  "DataCategory": "TimeSeriesData",
  "Descriptions": [{
    "LanguageCode": "en",
    "Description": "Time Series of Silo"
  }],
  "Properties": [
    {
            "Name": "temperature",
             "Descriptions": [{
		        "LanguageCode": "en",
		        "Description": "Temperature of Silo"
		      }],
            "Type": "Numeric",
            "PropertyLength": "5,2",
            "UnitOfMeasure": "°C",
            "QualityCode": "0"
       },
        {
            "Name": "humidity",
            "Descriptions": [{
		        "LanguageCode": "en",
		        "Description": "Humidity in Silo"
		      }],
            "Type": "Numeric",
            "PropertyLength": "5,3",
            "QualityCode": "0"
    },
        {

            "Name": "fillLevelTons",
            "Descriptions": [{
		        "LanguageCode": "en",
		        "Description": "Current fill level of Silo in Tons"
		      }],
            "Type": "Numeric",
            "PropertyLength": "5,2",
            "QualityCode": "0"
        }]
}
```

### Thing Modeling

Thing Types ( SAP Leonardo IoT), Sensor Types ( SAP Internet Of Things ), Capabilities ( SAP Internet Of Things) and Flexible Mappings ( SAP Leonardo IoT) to be created to model the Connected Silo scenario.

This can be achieved by using either Fiori Launchpad Applications or by using API's.

#### Option 1: Using Fiori Launchpad Applications

##### Artifacts from SAP Internet Of Things

###### Capabilities
Create a capability named as "SILO_TIME_SERIES" in Internet Of Things Service Cockpit as explained [here](https://help.sap.com/viewer/9a8cae62b9ab4278af1f39e188b11bc7/Cloud/en-US/390a21cfd67e4412893d137c7baf50ad.html#3e15042e1e964499b318c337d2ec5380.html).

Here are the properties to be created under this capability : 
```
Name : temperature
Data Type : double
Unit of Measure

Name : humidity
Data Type : double

Name : fillLevelTons
Data Type : fillLevelTons
```

##### Sensor Types
Creat a Sensor Type named as "ConnectedSilo" and add the "SILO_TIME_SERIES" capability in Internet Of Things Service Cockpit as explained [here](https://help.sap.com/viewer/9a8cae62b9ab4278af1f39e188b11bc7/Cloud/en-US/46199e6ba66b41748223d70f52ddf1fb.html#49228f3bde974760b319dc197c009898.html).


##### Artifacts from SAP Leonardo IoT

###### Thing Types & Flexible Mapping

Create a Thing Type called "TENANT-PACKAGE-NAMESPACE.com.connected.silos:ConnectedSilos" and create named property sets from the above property set types by UI Modeler application as explained [here](https://help.sap.com/viewer/e057ad687acc4d2d8f2893609aff248b/1905a/en-US/cb931ba512284e6cb77386386194b23e.html).

Additionally Create the Flexible Mapping between Thing Type to Sensor Type as explained in the Connectivity part [here](https://help.sap.com/viewer/e057ad687acc4d2d8f2893609aff248b/1905a/en-US/cb931ba512284e6cb77386386194b23e.html).


#### Option 2: Using Thing Type & Sensor Type API
There are API's that enable auto creation of Thing Type, Capabilities, Sensor Types and Flexible Mapping via single API as explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/d07264e4c1254f9ead7b2ced04655476.html).

```
Service End Point: config-thing-sap
```
Here is a sample structure for creating these artifacts 

```json
{
	"Name": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:ConnectedSilos",
	"PackageName": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos",
	"Descriptions": [{
		"LanguageCode": "en",
		"Description": "Connected Silo"
	}],
	"PropertySets": [{
		"Name": "SILO_METADATA",
		"PropertySetType": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_METADATA",
		"Descriptions": [{
			"LanguageCode": "en",
			"Description": "Silo Metadata"
		}]
	},
	{
		"Name": "SILO_TIME_SERIES",
		"PropertySetType": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
		"Descriptions": [{
			"LanguageCode": "en",
			"Description": "Time Series of Silo"
		}]
	},
	{
		"Name": "Material",
		"PropertySetType": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:Material",
		"Descriptions": [{
			"LanguageCode": "en",
			"Description": "Material"
		}]
	}],
	"SensorTypeMappings": [{
		"Descriptions": [{
			"LanguageCode": "en",
			"Description": "Connected Silo Sensor Type Mappings"
		}],
		"Name": "ConnectedSiloTypeMappings",
		"MeasureMappings": [{
			"SensorTypeName": "ConnectedSilos",
			"CapabilityName": "SILO_TIME_SERIES",
			"CapabilityPropertyId": "temperature",
			"PropertySetTypeId": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
			"NamedPropertySetTypeId": "SILO_TIME_SERIES",
			"NamedPropertySetTypePropertyId": "temperature"
		},
		{
			"SensorTypeName": "ConnectedSilos",
			"CapabilityName": "SILO_TIME_SERIES",
			"CapabilityPropertyId": "humidity",
			"PropertySetTypeId": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
			"NamedPropertySetTypeId": "SILO_TIME_SERIES",
			"NamedPropertySetTypePropertyId": "humidity"
		},
		{
			"SensorTypeName": "ConnectedSilos",
			"CapabilityName": "SILO_TIME_SERIES",
			"CapabilityPropertyId": "fillLevelTons",
			"PropertySetTypeId": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
			"NamedPropertySetTypeId": "SILO_TIME_SERIES",
			"NamedPropertySetTypePropertyId": "fillLevelTons"
		},
		{
			"SensorTypeName": "ConnectedSilos",
			"CapabilityName": "SILO_TIME_SERIES",
			"CapabilityPropertyId": "latitude",
			"PropertySetTypeId": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
			"NamedPropertySetTypeId": "SILO_TIME_SERIES",
			"NamedPropertySetTypePropertyId": "latitude"
		},
		{
			"SensorTypeName": "ConnectedSilos",
			"CapabilityName": "SILO_TIME_SERIES",
			"CapabilityPropertyId": "longitude",
			"PropertySetTypeId": "<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES",
			"NamedPropertySetTypeId": "SILO_TIME_SERIES",
			"NamedPropertySetTypePropertyId": "longitude"
		}]
	}],
	"SensorTypes": [{
		"Name": "ConnectedSilos",
		"SensorTypeCapabilities": [{
			"Capability": {
				"Name": "SILO_TIME_SERIES",
				"Properties": [{
					"Name": "temperature",
					"DataType": "Double",
					"UnitOfMeasure": "C"
				},
				{
					"Name": "humidity",
					"DataType": "Double"
				},
				{
					"Name": "fillLevelTons",
					"DataType": "Double"
				}]
			},
			"Type": "measure"
		}]
	}]
}
```
Note the generated Sensor Type Id for Sensor creation later.
Note the generated SensorType Mapping Id for Sensor creation later.

### Thing Onboarding

#### Authorizations

Create an Object Group to enable authorizations on the content as explained in [Tenant Administrative Applications](https://help.sap.com/viewer/500ea53fcd9a4974a338747cebf1d350/1905a/en-US/fe2da581d6ad42ba947747fcd7ac0b2c.html) or by using API's explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/94c98d6a5fbe4aa0ad80d000667e4755.html).

Note the generated ObjectGroupId once an Object Group has been created.

#### Business Partner
Create Business Partners ( Companies & Persons ) by using Tenant Administrative Application as explained [here](https://help.sap.com/viewer/500ea53fcd9a4974a338747cebf1d350/1905a/en-US).

Alternatively Business Partners can be created by using the API's as explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/501da6a39f3749578e56ae44bf0289d9.html).

```
Service End Point : business-partner
```

Here is a sample payload to create a Person
```json
{
	"basicData": {
		"tenant": "<<TENANT_GUID>>"
	},
	"personName": {
		"familyName": " ",
		"givenName": "BPNAME"
	},
	"communicationData": {
		"emailAddress": "EMAIL_ADDRESS",
		"cityName": "CITY",
		"postalCode": "POSTAL_CODE",
		"country": "COUNTRY_CODE",
		"countryDescription": "DESCRIPTION"
	},
	"objectGroup": "<<ObjectGroupId>>"
}
```
Replace the "ObjectGroupId" with the generated id from Authorizations Step.

Note the generated Business Partner Id to use it during thing onboarding.

#### Location
Create Locations by using API's as explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/fa38e508c45743cc88dbedee2dd82464.html).


```
Service End Point : location
```

Here is a sample payload to create a Location
```json
{ 	
    "basicData": {
           "tenant"             : "<<TENANT_GUID>>"
    },
    "locationData": {
           "streetName"         : "streetName",
           "houseNumber"        : "houseNumber",
           "cityName"           : "cityName",
           "district"           : "district",
           "postalCode"         : "postalCode",
           "country"            : "country",
           "countryDescription" : "countryDescription",
           "region" 		: "region",
           "regionDescription"  : "regionDescription",
           "longitude"          : "longitude",
           "latitude"           : "latitude"
    }
}
```

Note the generated Location Id to use it during thing onboarding.

#### Thing

Thing onboarding can be done by using either Fiori Launchpad Applications or via API's

##### Option 1: Using Fiori Launchpad Applications

##### Artifacts from SAP Internet Of Things

###### Device
Create a Device in SAP Internet Of Things Cockpit as explained [here](https://help.sap.com/viewer/9a8cae62b9ab4278af1f39e188b11bc7/Cloud/en-US/35ed9598f4c04222bfa0cdc86ffeb3f6.html#341e499154594ccb9460d62167aac7bd.html).

###### Sensor
Create a Sensor based out of "ConnectedSilo" Sensor Type under the above created Device in SAP Internet Of Things Cockpit as explained [here](https://help.sap.com/viewer/9a8cae62b9ab4278af1f39e188b11bc7/Cloud/en-US/35ed9598f4c04222bfa0cdc86ffeb3f6.html#loio6ba1638c98bc45c680d1c124c1c95230).

##### Artifacts from SAP Leonardo IoT

###### Thing & Thing Assignment
Create a Thing and configure the connectivity part as explained [here](https://help.sap.com/viewer/e057ad687acc4d2d8f2893609aff248b/1905a/en-US/d1eacdde3e2e48499bfb11cbdaf8d7de.html)

##### Option 1: Using API's
There are API's that enable auto creation of Things, Devices, Sensors and Assignment via single API as explained [here]

```
Service End Point: appiot-mds
```

Here is a sample structure to create these artifacts.

```json
{
	"_externalId": "<<DeviceId>>",
	"_name": "<<DeviceId>>",
	"_description": {
		"en": "Connected Silo"
	},
	"_thingType": ["<<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:ConnectedSilos"],
	"_objectGroup": "<<ObjectGroupId>>",
	"_location":"<<LocationId>>",
	"_customer":"<<PersonId>>",
	"_assignment": {
		"_devices": [{
			"_name": "<<DeviceId>>",
			"_gatewayName": "<<GATEWAY_ID>>",
			"_sensors": [{
				"_name": "<<DeviceId>>",
				"_sensorTypeId": "<<SensorTypeId>>"
			}]
		}],
		"_mappingId": "<<SensorTypeMappingId>>"
	}
}
```

Replace the TENANT-PACKAGE-NAMESPACE,ObjectGroupId,LocationId,PersonId,SensorTypeId,SensorTypeMappingId

Obtain the Gateway ID from SAP Internet Of Things Cockpit More information can be found [here](https://help.sap.com/viewer/9a8cae62b9ab4278af1f39e188b11bc7/Cloud/en-US/97697d4d27fc4147b77d12f02e1deefb.html#) and replace GATEWAY_ID.

## Data Ingestion
Ingest the measured values for the onboarded devices in SAP Internet Of Things by any of the approaches explained in below links.

[Send Data with REST](https://help.sap.com/viewer/d5f07bf9e1d646959a006f98d4cce321/Cloud/en-US).

[Send Data with MQTT](https://help.sap.com/viewer/e765b2a5b99540ce84da397c20cc1993/Cloud/en-US).

## Scenarios

### Monitor Fill Level measures of Silos
The targetted scenario is to notify the business users as and when the fill level of a thing has been reduced to less than 10%

This scenario can be achieved by configuring the Rules & Actions as explained below.

#### Rule Contexts
Create a Rule context based out of TimeSeries PST
```
 Example : <<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES.
```

#### Rules
Create a Streaming/Scheduled Rule based out of the Rule Context created in the above step and add a Rule condition as fill level is less than 10

#### Configure SMTP Settings for Email/In-App Notifications
Define Mail Server Configuration in Notifications & Email Templates.

#### Actions
Create an Action based out of Rule to trigger In-App notification as per below criteria
```
Basic Information:-

Triggered by: Event From Rule
Rule : Choose the rule created in the previous steps.
Thing Type: <<TENANT-PACKAGE-NAMESPACE>>.com.connected.silos:SILO_TIME_SERIES.
Action Type: In-App Notification

```
```
In-App Inforaiotn:-
Recipients: Provide valid email id of the business user to be notified.
Text: Low Fill Level has been detected for ${thing.name}.
```