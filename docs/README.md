

## Onboarding Documentation

### Leonardo IoT Service Instance

[SAP Leonardo IoT - SAP Help Portal](https://help.sap.com/viewer/product/SAP_Leonardo_IoT/1905a/en-US)

Create the Service Instances of SAP Leonardo IoT inside the tenant space.
A detailed information to create a service instance can be found [here](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/8221b7434d8e484fab5ec5d219b7bf64.html).

Create the Service Keys for the above created Service Instance for later uses.
A detailed information to create service keys can be found [here](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/4514a14ab6424d9f84f1b8650df609ce.html).

Note down the service instance name and uaa credentials of Leonardo IoT Service.

* Now launch the Terminal/MS-DOS prompt and navigate to the cloned repository location.
* Login to Cloud Foundry using "[cf login](https://docs.cloudfoundry.org/cf-cli/getting-started.html#login)"

### Whitelisted Redirection URL's

As this OData service will be called through a JWT Token that was issued based out of SAML Token through Authorization Code. The respective redirection url's need be whitelisted in Leonardo IoT Service to use this reference application.

Below are the currently whitelisted Redirection URL's

```
https://bocauth.us1.sapbusinessobjects.cloud:443
```

<b>NOTE</b>: This reference application will not work if the SAC Redirection URI are not whitelisted as per the above list. So Please make sure it has been listed above. If the SAC Redirect URI is not listed then please send a request to whitelisting.

### Application Setup

This reference application contains a Node Js application.

Please follow the below sections to setup the application.

#### Configure Destination URL

As this Reference application interacts with Content Manager Adaptor that was hosted by Leonardo IoT Service, Content Manager Adaptor URL needs to be provided in the destinations environment variable of this application before the deployment.

Currently destinations environment has been maintained in the [manifest.yml](../manifest.yml) file currently with one entry whose name is "live". The url property of this entry needs to be replaced with the Content Manager adaptor URL. This URL depends on the Region in which the Leonardo IoT application has been subscribed.

So please use the respective Content Manager Adaptor URL based out of the region the subscription was made as provided below.

|Region|Content Manager Adaptor URL|
|---|---|
|EU10|https://sap-iot-noah-live-cm-sac-adaptor.cfapps.eu10.hana.ondemand.com|
|US10|https://sap-iot-ae-noah-live-cm-sac-adaptor.cfapps.us10.hana.ondemand.com|


### Application Deployment

* Deploy the Node JS application by executing the below command from [repoository](../) folder

```
cf push -f manifest.yml
```

Note down the generated host URL for the approuter application after the successful deployment. This url has been referred as "ODATA_WRAPPER_HOST" variable wherever required.

### Creaion of a End-to-End Scenario

#### Creation of Dependend artifiacts
* Create the respective Package, Property Set Types ( Masterdata (optional and as per scenario requirement) & Timeseries ), Thing Types.
* Onboard things, post PST masterdata and Ingest Timeseries data.

#### Data Model Creation in Content Manager
* Create a Data Model in Content Manager by choosing the respective dimensions & measures from the Named Property Set Types.
* Activate the Data Model.
* Node the Data Model Name that was activated.

#### Create OData Connection in SAC

Prequisites
Capture the required information of all the variables handy before proceeding further.
Please sure the respective business user have Role with "cm.User" scope.

|Variable Name|Comment|Example If any|
|---|---|---|
|DESTINATION_NAME|Name of the destination that was bound in the application environment. ideally it will be a static string as "live"||
|TENANT_NAME|Sub Account Name or Tenant Name. This can be captured from "uaa.identityzone" property of Leonardo IoT Service Instance Credentials||
|AUTHENTICATION_HOST| Authentication Host URL retrieved from "uaa.url" property of Leonardo IoT Service Instance credentials| Ex: https://<<TENANT_NAME>>.authentication.eu10.hana.ondemand.com|
|CLIENT_ID| OAuth Client Id that can be captured from "uaa.clientid" property of Leonardo IoT Service Instance credentials| |
|CLIENT_SECRET| OAuth Client secret that can be used to generated JWT Token for Service Calls. This can be captured from "uaa.clientsecret" property of Leonardo IoT Service Instance credentials||
|OAUTH_TOKEN_URL|OAuth Token URL to generate JWT Token. This can be generated as per this pattern : <<AUTHENTICATION_HOST>>/oauth/token|Ex: https://<<TENANT_NAME>>.authentication.eu10.hana.ondemand.com|oauth/token|
|OAUTH_AUTHORIZE_URL|OAuth Authorize URL to generate oAuth Authorization Code. This can be generated as per this pattern : <<AUTHENTICATION_HOST>>/oauth/authorize|Ex: https://<<TENANT_NAME>>.authentication.eu10.hana.ondemand.com|oauth/authorize|
|DATA_MODEL_NAME_UPPERCASE| Name of the Data Model of Content Manager that was activated in the #Data Model Creation in Content Manager step in Upper case letters||
|ODATA_WRAPPER_HOST| Hostname of the Node JS application that was generated when deployed this reference application||
|MODEL_SPECIFIC_ODATA_URL| OData Service URL to access the aggregates of a Data Model as OData Service. Pattern to Generate This URL is <<ODATA_WRAPPER_HOST>>/odata/<<DESTINATION_NAME>>/<<DATA_MODEL_NAME_UPPERCASE>>||



* Go to SAP Analytics Cloud Tenant
* Authenticate with credentials
* Click on Connection
* Click on Add Connection "+" icon
* Under Acquire Data => Choose OData Services
* A dialog will be opened and there are several configurations need to be provided which are listed below in the table.

|Property Name|Mandatory| Value|
|---|---|---|
|Connection Name|Yes|Provide a Connection Name|
|Description|No| Provide a description for Connection Name|
|Connect To an SAP OData service|No|Leave it unchecked|
|Connect to an On-Premise OData service|No|Leave it unchecked|
|Data Service URL|Yes|Provide the OData service URL as per the MODEL_SPECIFIC_ODATA_URL variable|
|Authentication Type|Yes| Choose "OAuth 2.0 Authorization Code"|
|OAuth Client ID|Yes| Provide clientId. Value from CLIENT_ID variable|
|Secret|Yes|Provide Client Secret. Value from CLIENT_SECRET variable|
|Token URL|Yes|Provide OAuth Token URL. Value from OAUTH_TOKEN_URL variable|
|Authorization URL|Yes|Provide OAuth Authorization URL. Value from OAUTH_AUTHORIZE_URL variable|
|Scope|No| Leave It Blank|
|Redirect URI|No|This is a readly test which was prefilled. Please make sure that the value shown for this field has been maintained in the #whitelisted-redirection-url's section. If this field is not in the whitelisted list then please reach out to SAP Contact to request whitelisting.||

* Fill the values in the form as explained in the above table and click "Create" connection.
* This will open a dialog to authenticate the user.
* Provide your username & password and login
* On Successful authentication and role varification, Dialog will close and the connection will be created.
* All set on connection and please proceed further on Model & Story creation.
