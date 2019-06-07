# Fiori Launchpad Setup

This repository contains few sample applications that correspond to different use cases and can be deployed by an end user to realise respective scenarios.

Project consists of 2 folders, the flp and approuter packaged togerther and all the applications maintained together. FLP and Approuter co-exist inside the flp/ folder. All HTML5 apps exist in the apps/ folder. "flp" folder has a mta.yaml which builds the FLP and approuter and deploys them. The apps/ folder contains separate UI applications with their own mta.yaml files.

## FLP Module

### Path: flp/flp-module/

An SAP Fiori launchpad site is one of the site templates offered by SAP Cloud Platform Portal. A launchpad site displays a home page with Business Applications as tiles that an end user can launch.

The launchpad site contains all content configuration, e.g CommonDataModel, theme configuration, launchpad services like Notifications, etc and relevant translation files.

During deployment, the SAP Fiori launchpad site is created and activated in the project space.

## The CommonDataModel.json file

Here is an example of a CommonDataModel.json file. It contains the site apps, and the related configuration entities, e.g. catalogs, and groups, and site settings.

```json
{
    "_version": "2.8",
    "identification": {
        "id": "{{bundleId}}",
        "entityType": "bundle"
    },
    "payload": {
    }
}
```

### Catalogs
Catalogs represent a grouping of related apps for authorization purposes. Every app must be assigned to a catalog. Catalogs and their associated apps are displayed in the AppFinder.

```json
{
    "catalogs": [{
        "_version": "2.8",
        "identification": {
            "id": "defaultCatalogId",
            "title": "{{title}}",
            "entityType": "catalog",
            "i18n": "i18n/defaultCatalogId.properties" 
        },
        "payload": {
            "appDescriptors": [{
                "id": "app1",
                "intentHintId": "semantic-action"
            }, {
                "id": "app2",
                "intentHintId": "semantic-action"
            }, {
                "id": "app3",
                "intentHintId": "semantic-action"
            }]
        }
   }]
}
```

### Groups
Groups are a grouping of apps in the UI level. Your launchpad may contain a large number of apps. You can group them together according to a certain criteria. In this example, the group contains two tiles and a link that launch three different apps.  
```json
{
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
                "id": "tileId-1",
                "appId": "app1",
                "intentHintId": "semantic-action"
            }, {
                "id": "tileId-2",
                "appId": "app2",
                "intentHintId": "semantic-action"
            }],
            "links": [{
                "id": "tileId-3",
                "appId": "app3",
                "intentHintId": "semantic-action"
            }] 
        }
   }]
}
```

Apps are defined in the group section. To add a new tile/link, add another code block using the same format as the example above. The app ID is taken from the app manifest.json (app folder → webapp → manifest.json).  To change the configuration of the tile/link, open the app manifest.json → Navigation tab.  

### Sites
In this section you can define the site settings.

The following settings can be configured:
* Personalization – enablePersonalization (enabled by default) 
* Theme selection – you can replace the value of "theme.id" with any of the values that appear in "theme.active" array
* SAPUI5 - you can change the  value of "ui5VersionNumber" to a different one

```json
   {
        "sites": [{
            "_version": "2.8",
            "identification": {
                "id": "{{siteId}}",
                "entityType": "site",
                "title": "SAP Fiori launchpad site on Cloud Foundry",
                "description": "SAP Fiori launchpad site on Cloud Foundry, deployed from SAP Web IDE"
            },
            "payload": {
                "config": {
                    "ushellConfig": {
                        "renderers": {
                            "fiori2": {
                                "componentData": {
                                    "config": {  
                                        "enableRecentActivity": false,
                                        "applications": {
                                            "Shell-home": {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "groups": [ 
                    "defaultGroupId"
                ],
                "sap.cloud.portal": { 
                    "config": { 
                        "theme.id": "sap_belize",
                        "theme.active": ["sap_belize","sap_belize_plus","sap_belize_hcb","sap_belize_hcw"],
                        "ui5VersionNumber": "1.61"
                    }
                }
            }
         }]
    }}
}    
```

## Handling translation
* Translation of the launchpad entities (catalogs, groups., etc.) is maintained per entity.
* Each entity defines the properties file of the master language (default language). For example: defaultCatalogId.properties.
* To add translation to a certain language, create a new file. Use the same name as the master language file , and add _locale at the end. For example: defaultCatalogId_de.properties.
* Place all translation files in the i18n folder.
* To activate the translation, build the mta project and deploy the mtar.

# Approuter

All common routes exist in the xs-app.json of the approuter, and any application specific route has to exist inside the xs-app.json of the respective application.

# Building and Deploying individual Apps

1.  Extract the mta_archive_builder-x.x.x.jar downloaded from mta_archive_builder-x.x.x.zip under the section "Multi-Target Application Archive Builder
" at [SAP Developer Tools](https://tools.hana.ondemand.com/#cloud).  
    Further information about building and deploying the application can be found [here](https://help.sap.com/viewer/58746c584026430a890170ac4d87d03b/Cloud/en-US/9f778dba93934a80a51166da3ec64a05.html). 

2.  Build the individual HTML5 Applications after navigating to each of the application folders, where the mta.yaml exists. Command to build the app - `java -jar <location of mta.jar> --build-target=CF build` 

3.  Deploy the individual HTML5 Application using the following command - `cf deploy <name_of_the_mtar>.mtar` 

4.  Build and deploy the flp package after navigating to flp/  
    `
    java -jar <location of mta.jar> --build-target=CF build
    cf deploy flp.mtar
    `

# Adding a new tile

1.  Create another application folder inside the app/ folder having a similar structure as the existing app. Existing Scenarios can be found [here](apps).

2.  Add another section in the CommonDataModel.json having the app ID as the new component's ID.  

3.  Update the mta.yaml of the flp/ folder to contain the service instance of html5-apps-repo, plan app-host of the new HTML5 application, and add in the requires section of flp.  

4.  After this, if the new HTML5 app is built and deployed, following which the flp is built and deployed, it will add another tile in the launchpad.  

5.  This makes the deployment of individual apps possible without redeploying the complete mtar. Owners of different HTML5 apps can work simultaneously to build and deploy apps.
