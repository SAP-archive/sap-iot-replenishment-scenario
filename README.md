# SAP Leonardo IoT Reference Application for Replenishment

## Description

This iot reference application is meant to make it simpler for you to build your own iot application. It walks you through all of the steps and provides you with all configuration and source code required for you to be able to reproduce the application 1:1.

It features the use of SAP Leonardo IoT and a Web-based UI.

We used Connected Silo at SAP as the example devices to be monitored and to help SAP facilities with the replenishment of Connected Silos.

## Prerequisites
* [SAP Cloud Platform Account](https://cloudplatform.sap.com/index.html) with a Neo sub-account and a Cloud Foundry sub-account
* [A subscription to Leonardo IoT](https://cloudplatform.sap.com/capabilities/product-info.SAP-Leonardo-Internet-of-Things.1e3dd0d0-a355-4a0a-bc3e-36285eae4cbe.html) and an instance of [iot (service) for cloud foundry](https://help.sap.com/viewer/2f1daa938df84fd090fa2a4da6e4bc05/Cloud/en-US). **Note: These are commericial paid products.** 
* [Multi-Target Application Archive Builder](https://tools.hana.ondemand.com/#cloud)
*  [MultiApps CF CLI Plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin)

## Download

[Download the files from GitHub as a zip file](../../archive/master.zip), or [clone the repository](https://help.github.com/articles/cloning-a-repository/) on your desktop.

## Installation

As the source code needs to be deployed in cloud platform account, Please follow the typical approach for managing source code, [Building MTA applications](https://help.sap.com/viewer/58746c584026430a890170ac4d87d03b/Cloud/en-US/9f778dba93934a80a51166da3ec64a05.html) and [Deploying MTA applications](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin#usage) to cloud platform. 

## Configuration

We provided some example configuration for e.g. the Connected Silo in the source files that might be helpful to get you started. We also illustrated the Thing Model and you can configure it in Leonardo IoT via the Thing Modeler apps.

## Documentation

We provided the complete documentation inside [docs](/docs) folder.

## Support

The content is provided "as-is". There is no guarantee that raised issues will be answered or addressed in future releases.

## License
Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the SAP Sample Code License, v1.0 except as noted otherwise in the [LICENSE file](/LICENSE).

