# Creating Smart Business Charts and Consuming in the Application

Access the Smart Business Tiles from the Launchpad. This is the same launchpad used for all the Thing Modeler configurations.

## Creating KPI

Click on "Create KPI" tile to open the Application. Enter the KPI Title under Parameters and choose **BusinessSystem01** as Source System, **IoT Discoverer Based** as Service Discovery Mechanism and select your Thing Type and PST which needs to be used for the KPI. OData URL gets pre-populated and the Entity Set needs to be selected as **aggregates**. According to the use case and thing type, user needs to select the Value measure. Below screenshot will give you an idea on how this looks.

![Creating KPI](images/smbaas1.png)

Click on Activate. This will save and activate the KPI.

## Create Evaluation

After creating the KPI, we need to create Evaluation under this KPI. Go back to home and click on "Create Evaluation" tile. Select KPI and give an Evaluation Title. In case you need filters to be added to the Evaluations, it can be configured in the last section called **Input Parameters and Filters**.

Note: time and duration are necessary to be added as filters for the OData that is being used to create the Smart Business Charts.

The different values that can be passed as filter for duration are documented in this [help](https://help.sap.com/viewer/350cb3262cb8496b9f5e9e8b039b52db/1.73.0.0/en-US/4889f896a14749d581db25666e525ae8.html) document.

![Add Evaluation](images/smbaas2.png)

After configuring the filters, click on Activate to create and activate the evaluation.

## Configure KPI Drill-down

The last step before configuring the smart business charts in the UI is configuring the KPI drill down. Go to Home and click on **Configure KPI Drill-down** Select the Evaluation that has been created and click on **Configure** button in the footer. This takes you to Drill-Down Chart Configuration screen where type of visualization, dimensions and measures are selected. Dimension is usually selected as time in case of the *aggregates* OData. Give a view title and select appropriate options from Visualization Type. Click on Save View.

![Configuring KPI Drill Down](images/smbaas3.png)

## Adding Smart Business Charts in ThingPage

Navigate to the application's webapp folder and go to views->ThingPage.view.xml. This is the place where all the different sections of the Thing Page are configured to be displayed during the runtime. To add the smart business chart in the this view, add the following snippet into a new section or replace an existing section from the Object Page Layout.

```xml
<ObjectPageSection title="{i18n>analyticsSubTitle1}">
	<subSections>
		<ObjectPageSubSection title="Smart Business Control">
			<blocks>
				<businesscontrol:Kpi evaluationId="<evaluationId>" showAggregate="false" showFilters="false" showMiniChart="true" showChart="true"
					showKpiTitle="false" showEvaluationTitle="false" height="700px"/>
			</blocks>
		</ObjectPageSubSection>
	<subSections>
</ObjectPageSection>
```

The **evaluationId** has to be replaced by the evaluation ID that has been created for your use case. To find out this ID, go to Launchpad and click on "KPI Workspace", select the KPI created by you and select one of the evaluation ID for this KPI. A single KPI can have multiple evaluation IDs. Other properties like showAggregate, showFilters etc. can be configured based on your use case.
