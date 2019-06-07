sap.ui.define(["sap/ui/core/format/DateFormat", "sap/ui/core/LocaleData"], function (DateFormat, LocaleData) {
	"use strict";

	return {

		/**
		 * Formatter for image, If no image field specified use a default image
		 *
		 * @public
		 * @param {string} sImagePath Image path
		 */
		formatIcon: function (sImagePath, sThingId) {
			if (sImagePath) {
				var filePath = sImagePath.split("/");
				filePath = filePath[filePath.length - 1];
				return "/backend-file/Files/Things/" + sThingId + "/" + filePath;
			} else {
				return "";
			}
		},

		formatImageURL: function (sThingId) {
			if (sThingId) {
				var imageURL = "/backend-image/things/" + sThingId;
				return imageURL;
			} else {

				return "";
			}
		},

		formatTimeStamp: function (sValue) {
			return new Date(Date.parse(sValue)).toString().split(" GMT")[0];
		},

		formatImageURLThingPage: function (sThingId) {

			if (sThingId) {
				var imageURL = "/backend-image/things/" + sThingId;
				this.byId("ObjectPageLayout").getHeaderTitle().setObjectImageURI(imageURL);
				this.byId("idHeaderImage").setVisible(true);
				this.byId("idHeaderIcon").setVisible(false);
				return imageURL;
			} else {
				this.byId("ObjectPageLayout").getHeaderTitle().setObjectImageURI("sap-icon://machine");
				this.byId("idHeaderImage").setVisible(false);
				this.byId("idHeaderIcon").setVisible(true);
				return "";
			}
		},

		formatObjectHeader: function (name) {

			var urgent = this.getView().getModel("thingPageModel").oData["event.severity1count"];
			var important = this.getView().getModel("thingPageModel").oData["event.severity2count"];
			var information = this.getView().getModel("thingPageModel").oData["event.severity3count"];

			var oHeaderImage = this.byId("ObjectPageLayoutHeaderTitle").getAggregation("_objectImage");
			if (!oHeaderImage) {
				oHeaderImage = {};
				oHeaderImage.aCustomStyleClasses = [];
			}
			for (var i = 0; i <= oHeaderImage.aCustomStyleClasses.length; i++) {
				oHeaderImage.aCustomStyleClasses.pop();
			}
			if (urgent > 0) {
				$(".objectPageHeaderImage").css({
					'border-left-color': '#bb0000',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".headerImage").css({
					'border-left-color': '#bb0000',
					'border-left-style': 'solid',
					'border-left-width': '.5rem',
					'color': 'white'
				});
				$(".objectSematicBar").css({
					'background-color': '#bb0000',
					'margin': '0rem'
				});
				//$(".sapUxAPObjectPageHeaderIdentifier .sapUxAPObjectPageHeaderObjectImageForce .sapUxAPObjectPageHeaderStickied .sapUxAPObjectPageHeaderObjectImage").css({'border-left-color': 'red', 'border-left-style': 'solid', 'border-left-width': '.5rem'});
				oHeaderImage.aCustomStyleClasses.push("thingPageRedSematic");
			} else if (important > 0) {
				$(".objectPageHeaderImage").css({
					'border-left-color': '#e78c07',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".headerImage").css({
					'border-left-color': '#e78c07',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".objectSematicBar").css({
					'background-color': '#e78c07',
					'margin': '0rem'
				});
				oHeaderImage.aCustomStyleClasses.push("thingPageOrangeSematic");
			} else if (information > 0) {
				$(".objectPageHeaderImage").css({
					'border-left-color': '#2b7d2b',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".headerImage").css({
					'border-left-color': '#2b7d2b',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".objectSematicBar").css({
					'background-color': '#2b7d2b',
					'margin': '0rem'
				});
				oHeaderImage.aCustomStyleClasses.push("thingPageGreenSematic");
			} else {
				$(".objectPageHeaderImage").css({
					'border-left-color': '#d3d7d9',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".headerImage").css({
					'border-left-color': '#d3d7d9',
					'border-left-style': 'solid',
					'border-left-width': '.5rem'
				});
				$(".objectSematicBar").css({
					'background-color': '#d3d7d9',
					'margin': '0rem'
				});
				oHeaderImage.aCustomStyleClasses.push("thingPageGreySematic");
			}
			oHeaderImage.aCustomStyleClasses.push("sapUxAPObjectPageHeaderObjectImage");
			return name;
		}

	};
});