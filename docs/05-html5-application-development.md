
## Creating Runtime UI Applications

This is a technical documentation on creating a Launchpad site consisting of template based SaaS applications using Web-IDE that can run based on a particular Thing Type. The steps are documented below in a sequential manner.

Below links will be help the user in setting up the platform for development of the portal site and the Web IDE based applications.

1.	[Developing SAP Fiori Launchpad site with portal service on SAP Cloud platform - Part 1](https://blogs.sap.com/2018/10/28/develop-your-first-sap-fiori-launchpad-site-with-portal-service-on-sap-cloud-platform-multi-cloud/)

2.	[Developing SAP Fiori Launchpad site with portal service on SAP Cloud platform - Part 2](https://blogs.sap.com/2018/10/29/develop-your-first-sap-fiori-launchpad-site-with-portal-service-on-sap-cloud-platform-multi-cloud-chapter-2/)


### Creating template based IoT Applications

#### Enabling IoT Templates in Web-IDE

Login to the Web-IDE, go to Settings, and click on Extensions. Search for Leonardo IoT and enable it. This will enable the user to use IoT based controls and templates in the Application.

#### Creating IoT Applications

Instead of creating a new HTML5 module inside the Multi-target application, user can choose **Project from Template** and choose IoT Applications (Environment - Cloud Foundry) to continue. Give the required info to create the project and click on next. From the service dropdown, choose `IOT-ADVANCEDLIST-THING-ODATA` to continue and choose the Thing Type created by the user. After this, select all the PSTs under this Thing type so that all of them are available for consumption in the application. In case the user has multiple Thing types created, common PSTs need to be selected before continuing continue. By default all IoT template pages will be selected, click on Next.

Description about the 4 templates and how this can be configured is given [here](https://help.sap.com/viewer/86ce311577794701bae493bddd753aa3/1.30.0.0/en-US/3cfde6689409490384cae9b73d1def0e.html).

Proceeding on these steps will create an IoT Application for the selected thing type. Inside the application folder, there is a folder called webapp which contains the content of your fiori application. This contains a manifest.json file which is called the Application descriptor. This needs to have a value for `sap.app.crossNavigation`. If this object does not exist in the json, then add this object in the json. A sample is shown below:

```json
"crossNavigation": {
	"inbounds": {
		"intent1": {
			"signature": {
				"parameters": {},
				"additionalParameters": "allowed"
			},
			"semanticObject": "connectedsilo",
			"action": "display",
			"title": "Connected Silos"
		}
	}
}
```

The semanticObject and action can be any string. This is used to navigate to your application from the launchpad, and this combination needs to be unique for different applications. This will be visible in the URL when the application has been deployed with this semanticObject and action.

Another point to note is that the application id given in the manifest has to be same as the `appId` which is used in CommonDataModel.json file inside the flp site folder. Also, the intentHintId has to be same as the `semanticObject-action` that is used in the manifest.json.

```json
"groups": [{
	"_version": "2.8",
	"identification": {
		"id": "defaultGroupId",
		"title": "{{title}}",
		"entityType": "group",
		"i18n": "i18n/defaultGroupId.properties"
	},
	"payload": {
		"tiles": [{
			"id": "sap.iot.noah.connectedsilo",
			"appId": "sap.iot.noah.connectedsilo",
			"intentHintId": "connectedsilo-display"
		}]
	}
}]
```

#### Structure of WEB-IDE Project

The structure of this repository is different than the one created by the web-ide. The web-ide creates 4 different packages inside the multi-target application. These packages are for different purposes explained below -

1.	**appRouter** - This gets created by-default by the web-ide and is used for authenticated routing between your UI application and the services which are used to retrieve data. The routes which are generic and not application specific are kept in this Approuter package. This folder contains a file called `xs-app.json`. This files contains a `route` array which has all the individual routes.
	
2.	**flp-module** - This contains the configuration of the Launchpad. The theme that has to be set to the launchpad and the tiles that need to be rendered. In case a specific UI5 version needs to be used for the launchpad, that is also specified in this file. This gets created by the web-ide when an FLP Module site is created. This is done in the steps documented in the blog link give at the beginning of this documentation. The link between the applications and the launchpad is the CommonDataModel.json file which has the appId and the intentHintId as explained above.
	
3.	**ui** Application - This is the HTML5 Module which is created by the user where the IoT Templates are consumed. This content is deployed in the html-apps-repo which is then served by another service from the object store during the runtime. This is where the application code resides, any application specific changes go inside this application. If there are any application specific routes they need to be maintained inside the `xs-app.json` file of this folder.
	
4.	**ui_deployer** - This is the deployer application created by the web-ide by default. This takes care of the deployment of the html5 content into the html5-apps-repo.
	
The deployment when done through the web-ide deploys the complete application together, along with the approuter, flp-module and the UI application. This means if there are 2 different individuals working on the same launchpad, the launchpad would be down during the deployment of any one of the application. To get rid of this, the structure has been modified in this repository so that the deployment of the html application is independent from the deployment of the approuter and launchpad.

The repository structure has launchpad and approuter kept together in a single mta.yaml, and all other applications in separate mta.yamls.

#### Changes to be made to the WEB-IDE Project

After the structure of the application is modified, there needs to be some changes made to the application, which are explained below:

1.	Routes to be added in the approuter's `xs-app.json`

	a.	To enable notification-service
	```json
	{
		"source": "^/ns/(.*)",
		"service": "com.sap.leonardo.iot",
		"endpoint": "notifications",
		"target": "$1"
	}
	```
	
	b.	To enable creation and consumption of smart business charts and services
	```json
	{
		"source": "^/sap/fiori/sapsmartbusiness/destinations/BusinessSystem01/(.*)$",
		"service": "com.sap.leonardo.iot",
		"endpoint": "analytics-thing-sap",
		"csrfProtection": false,
		"target": "$1"
	}, {
		"source": "(.*)/ssbservice/(.*)$",
		"destination": "IOT_SMART_BUSINESS_SERVICE",
		"target": "$2",
		"csrfProtection": false,
		"authenticationType": "xsuaa"
	}, {
		"source": "^/sap/fiori/sapsmartbusiness/sap/(.*)$",
		"destination": "IOT_SMART_BUSINESS",
		"target": "/sap/$1",
		"csrfProtection": false
	}, {
		"source": "^/ssbruntime/sap/smartbusiness/ui/(.*)$",
		"destination": "IOT_SMART_BUSINESS",
		"target": "/sap/smartbusiness/ui/$1",
		"csrfProtection": false
	}
	```
	
	c.	To enable consumption of IoT Thing service, Composite Events service and Image service
	```json
	{
		"source": "^/IOTAS-DETAILS-THING-ODATA/(.*)$",
		"service": "com.sap.leonardo.iot",
		"endpoint": "details-thing-sap",
		"target": "$1",
		"csrfProtection": false
	}, {
		"source": "^/IOTAS-COMPOSITE-EVENTS-ODATA/(.*)$",
		"service": "com.sap.leonardo.iot",
		"endpoint": "composite-events-odata",
		"target": "$1",
		"csrfProtection": false
	}, {
		"source": "/backend-image/things/(.*)$",
		"service": "com.sap.leonardo.iot",
		"endpoint": "appiot-fs",
		"target": "/Files/Things/$1/images/$1.png",
		"csrfProtection": false
	}
	```
	
	d.	To consume the IoT controls and templates
	```json
	{
		"source": "^/resources/sap/ui/iot/(.*)$",
		"destination": "IOTAS_CONTROLS",
		"target": "/sap/ui/iot/$1",
		"csrfProtection": false
	}
	```
	
	e.	To comsume sapui5 library
	```json
	{
		"source": "/resources/(.*)$",
		"destination": "sapui52",
		"target": "$1",
		"csrfProtection": false
	}
	```

2.	Compulsory route to be added to application's xs-app.json. This route takes care of serving the files inside the application itself, using the html5-apps-repo-runtime service using the authentication through xsuaa

	```json
	{
		"source": "^(.*)$",
		"target": "$1",
		"service": "html5-apps-repo-rt",
		"authenticationType": "xsuaa"
	}
	```
	
3.	Register resource path for the iot controls and smart business controls
	
	Following lines of code needs to be added in the `Component.js` of the application at the beginning of the js file. These files will enable register the correct path for IoT controls and Smart Business Controls. The final 2 lines will load the Kpi and Tile control which is used in the smart business control section of the object page.
	
	```js
	jQuery.sap.registerModulePath("sap.ui.iot", "/resources/sap/ui/iot/");
	jQuery.sap.registerModulePath("sap.smartbusiness.ui.control", "/ssbruntime/sap/smartbusiness/ui/control/");
	jQuery.sap.require("sap.smartbusiness.ui.control.Kpi");
	jQuery.sap.require("sap.smartbusiness.ui.control.Tile");
	```
	
4.	Consuming Smart Business Controls

	Configure Smart Business KPI's as explained in [06-creating-smart-business-charts.md](06-creating-smart-business-charts.md).

	After configuring the Business Systems in the Samrt Business Administrative tile, you can create KPIs, Evaluations and Drilldowns. Please refer [Smart Business](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.00/en-US/be5b7ac2ef364fa7b7154cd0bb37a93f.html) documentation for the configuration of these artifacts.
	
	Once these are created, they can be consumed in the `ThingPage.view.xml` under application_folder/views/. The smart business Evaluation ID is used inside the Object Page section by using the following piece of code -
	
	```xml
	<ObjectPageSection title="{i18n>analyticsSubTitle1}">
		<subSections>
			<ObjectPageSubSection title="Smart Business Control">
				<blocks>
					<businesscontrol:Kpi evaluationId="E.7657438657846" showAggregate="true" showFilters="false" showMiniChart="true" showChart="true"
						showKpiTitle="false" showEvaluationTitle="false" height="700px"/>
				</blocks>
			</ObjectPageSubSection>
		<subSections>
	</ObjectPageSection>
	```
	
	This will render a chart in the Thing Page template of the application. Similarly other sections can also be added or replaced in the ObjectPageSection of the ThingPage.
	
5.	Property bindings of a control can be either changed in the Layout Editor of the Web-IDE (where user can select the control to be rendered on a particular page) or the view.xml of the respective file directly.

6.	In case one of the template needs to be removed from the navigation, the changes need to be made in the `manifest.json` file of the application and also the controller file of the page from where the navigation needs to be modified. The default navigation is explained in the [SAP IoT Application Enablement Templates](https://help.sap.com/viewer/86ce311577794701bae493bddd753aa3/1.30.0.0/en-US/3cfde6689409490384cae9b73d1def0e.html). In case other IoT Controls need to be used, they can also be selected in the layout editor. The documentation of these controls can be found [here](https://help.sap.com/viewer/86ce311577794701bae493bddd753aa3/1.30.0.0/en-US/8452dd0d4b4445d39b98e71673a457a6.html)

7. 	Navigation in the sample implementation of Connected Silos -
 
	Default page which is rendered is the ThingListPage.view.xml. Clicking on an item in the list navigates user to ThingPage.view.xml, where the Section to show Measured values is commented. IoTMeasuredValues control can show the current values of the PST. If uncommented, user navigates to the AnalysisPage.view.xml which shows a chart with multiple options for the measure that is clicked.

#### Referencing html5 Application to the Launchpad

	The mta.yaml also called the deployment descriptor of the html5 application contains the name of a service   
	which is of type html5-apps-repo and plan app-host. This service needs to be referenced in the deployment   
	descriptor of the launchpad under the requires section. This makes sure the launchpad can serve the content   
	from the specified service and the service inturn delivers the code of the user created html5 application.


#### Building and Deploying your Project

1.  Extract the mta_archive_builder-x.x.x.jar downloaded from mta_archive_builder-x.x.x.zip under the section "Multi-Target Application Archive Builder
" at [SAP Developer Tools](https://tools.hana.ondemand.com/#cloud).  
Further information about building and deploying the application can be found [here](https://help.sap.com/viewer/58746c584026430a890170ac4d87d03b/Cloud/en-US/9f778dba93934a80a51166da3ec64a05.html). 

2.  Build the HTML5 Application after navigating to the application folder, where the mta.yaml exists. Command to build the app: `java -jar <location of mta.jar> --build-target=CF build` 

3.  Deploy the individual HTML5 Application using the following command - `cf deploy <name_of_the_mtar>.mtar` 

4.  Build and deploy the flp package after navigating to flp/ 
    `
    java -jar <location of mta.jar> --build-target=CF build
    cf deploy flp.mtar
    `
5. Note down the generated HOST URL for the above deployed FLP Moduule
6. Enter the HOST URL in the address bar of the browser to access Fiori Launchpad and click on "Connected Silo" to access Application.