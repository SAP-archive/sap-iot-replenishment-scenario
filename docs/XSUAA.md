# XSUAA Setup

This document is relevant only before SAP Leonardo IoT 2006B release and please don't use the setup explained in this document after 2006B release.

SAC Redirection URL's need to be whitelisted in the XSUAA before using the OData Service in SAP Analytics Cloud.

So this document helps in creating a xsuaa service instance that can be used temporarily until 2006B release.

## XSUAA Service creation

* Go to CLI tool and execute the followinng commands to create the XSUAA Service Instance.

```
cf create-service xsuaa application odata-wrapper-xsapp -c .\xs-security.json
cf create-service-key odata-wrapper-xsapp default
```

* Above commands, create the xsuaa service instance and a default service key.
* The credentials of this service needs to be used to generate JWT Token for odata Calls so retrieve the credentials of this service by running the following commands.

```
cf service-key odata-wrapper-xsapp default
```

* This will print the xsuaa credentials and use these credentials in the SAP Analytics Cloud OData Connection.

