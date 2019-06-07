# Initial Setup

## Onboarding Documentation
[Obtaining Global Account - SAP Help Portal](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/144e1733d0d64d58a7176e817fa6aeb3.html)

[SAP Leonardo IoT - SAP Help Portal](https://help.sap.com/viewer/product/SAP_Leonardo_IoT/1905a/en-US)

[SAP Internet Of Things - SAP Help Portal](https://help.sap.com/viewer/product/SAP_CP_IOT_CF/Cloud/en-US)

Create the Service Instances of SAP Leonardo IoT and SAP Internet Of Things inside the tenant space.
A detailed information to create a service instance can be found [here](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/8221b7434d8e484fab5ec5d219b7bf64.html).

Create the Service Keys for the above created Service Instances for later uses.
A detailed information to create service keys can be found [here](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/4514a14ab6424d9f84f1b8650df609ce.html).

Note the endpoints list from service keys of SAP Leonardo IoT Service instance and refer them wherever "Service End Point" has been mentioned in the later sections.

SAP Internet Of Things Cockpit credentials to be persisted in SAP Leonardo IoT to automatically create the SAP Internet Of Things artifacts from SAP Leonardo IoT as explained [here](https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/1905a/en-US/3dcef1070de645099bfa814f969408ca.html).

```
Service End Point: tm-data-mapping
```
Here is a sample structure of payload
```json
{
   "user": "USERNAME",
   "password":"PASSWORD",
   "host": "<<INSTANCE_ID>>.<<LANDSCAPE>>.cp.iot.sap",
   "instanceId": "<<INSTANCE_ID>>",
   "iotTenantId": "<<TENANT_ID>>"
}
```