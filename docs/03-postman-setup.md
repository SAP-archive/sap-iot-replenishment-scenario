# Using Postman Collection
We have added a postman collection which can be helpful to create modeler configurations. 

# Prerequisites
* [Postman](https://www.getpostman.com/products)

## Download
You can download the postman collection at [apps/connected-silo/postman](../apps/connected-silo/postman)

## Installation
* Install Postman Tool
* Import both "connected-silo.postman_collection.json" and "connected-silo.postman_environment.json" into postman. You should be a new Collection Called "Connected Silos" in the list and an environment called "Connected Silos"

## Configuration
Configure the environment variables in "Connected Silos" Environment as described below.

* Replace the place holders as explained below.

| Place holder Name                            | Description                                    | More Information                                                                                                                |
|----------------------------------------------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| &lt;&lt;TENANT_NAME&gt;&gt;                              | Tenant Name / Identity Zone                    |                                                                                                                                 |
| &lt;&lt;CLIENT_ID&gt;&gt;                                | UAA clientId for Leonardo IoT Instance         |                                                                                                                                 |
| &lt;&lt;CLIENT_SECRET&gt;&gt;                            | UAA clientSecret for Leonardo IoT Instance     |                                                                                                                                 |
| &lt;&lt;TENANT-PACKAGE-NAMESPACE&gt;&gt;                 | Tenant Namespace                               | [Documentation](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/462b49382316427aa59fe671a75fa39e.html) |
| &lt;&lt;TENANT-PACKAGE-NAMESPACE_WITH_UNDERSCORE&gt;&gt; | Tenant Name by replacing dots with underscores |                                                                                                                                 |
| &lt;&lt;TENANT_GUID&gt;&gt;                              | Tenant GUID / Subaccount Id                    |                                                                                                                                 |