# OData Service ( V2 ) Wrapper for Leonardo IoT Content Manager

## Description
This IoT reference application is meant to generate a OData service wrapper for Leonardo IoT Content Manager.
It walks you through all of the steps and provides you with all configuration and source code required for you to be able to reproduce the application 1:1.

## Prerequisites
* [SAP Cloud Platform Account](https://cloudplatform.sap.com/index.html) with a cloud foundry sub-account.
* [A subscription to SAP Leonardo IoT](https://cloudplatform.sap.com/capabilities/product-info.SAP-Leonardo-Internet-of-Things.1e3dd0d0-a355-4a0a-bc3e-36285eae4cbe.html) and an instance of [iot (service) for cloud foundry].
* a Cloud foundry space under the sub-account.
* A service Instance of Leonardo IoT.
* Space Quota : Application Instance Memory of atleast 2GB, Disk Memory of atleast 1GB.

## Download
[Download the files from GitHub as a zip file](../../archive/master.zip), or [clone the repository](https://help.github.com/articles/cloning-a-repository/) on your desktop.

## Installation

## Configuration

## Version Compatibility

### SAP Leonardo IoT
Release : 2006B

### SAP Analytics Cloud
Version 2020.12

### OData 
Version V2

## Limitations/ Boundary conditions
* $filter,$orderby query parameters are not supported.
* Consumption of the OData service is only intended for the Data Import requirements in SAC incase Live Connection is not able to cater to the required business cases.
* OData service should be called with a bearer JWT token which was generated through User SAML Token ideally through Authorization_code workflow. This had been explained in detail in the documentation.

## Documentation
We provided the complete documentation inside [docs](/docs) folder.

## Support

The content is provided "as-is". There is no guarantee that raised issues will be answered or addressed in future releases.

## License
Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the SAP Sample Code License, v1.0 except as noted otherwise in the [LICENSE file](/LICENSE).