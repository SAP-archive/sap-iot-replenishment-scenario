jQuery.sap.registerModulePath("sap.ui.iot", "/resources/sap/ui/iot/");
jQuery.sap.registerModulePath("sap.smartbusiness.ui.control", "/ssbruntime/sap/smartbusiness/ui/control/");
jQuery.sap.require("sap.smartbusiness.ui.control.Kpi");
jQuery.sap.require("sap.smartbusiness.ui.control.Tile");

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"sap/iot/noah/connectedsilo/model/model"
], function (UIComponent, Device, MessageBox, models) {
	"use strict";

	return UIComponent.extend("sap.iot.noah.connectedsilo.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			sap.m.BusyDialog("idBusy").open();

			//Timeout dialog
			this.isTimedOut = false;
			this.rBundle = this.getModel("i18n").getResourceBundle();
			this.solutionText = this.rBundle.getText("solutionText");
			this.suggestionText = this.rBundle.getText("suggestionText");
			this.timeoutDialogTitle = this.rBundle.getText("timeoutDialogTitle");
			this.reloadButtonText = this.rBundle.getText("reloadButtonText");
			var that = this;
			this.getModel().attachRequestFailed(function (oEvent) {
				//for handling timeout for main model
				var oParams = oEvent.getParameters();
				var that = this;
				if (oParams.response.statusCode === 503) {
					this.isTimedOut = true;
					this.showTimeoutMessage();
				}
			}, that);
			if (this.getModel("events") !== undefined) {
				//for handling timeout for event model
				this.getModel("events").attachRequestFailed(function (oEvent) {
					var oParams = oEvent.getParameters();
					var that = this;
					if (oParams.response.statusCode === 503) {
						this.isTimedOut = true;
						this.showTimeoutMessage();
					}
				}, that);
			}
			window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
				//for handling timeout while fetching ui controls
				var cause = new Object();
				var errObj = errorObj;
				while (errObj.hasOwnProperty("cause")) {
					errObj = errObj.cause;
				}
				cause = errObj;
				if (cause.status === undefined) {
					cause.status = errorObj.status;
				}
				if (cause.status === 503 || cause.statusCode === 503) {
					this.isTimedOut = true;
					this.showTimeoutMessage();
				}
			}.bind(that);
			$(document).ajaxError(function (event, xhr, options, exc) {
				//for handling timeout for AJAX calls
				if (xhr.status === 503) {
					this.isTimedOut = true;
					this.showTimeoutMessage();
				}
			}.bind(that));
			//for handling timeout of dynamically created thing models
			if (this.getModel("thingModel1") !== undefined) {
				this.getModel("thingModel1").attachRequestFailed(function (oEvent) {
					var oParams = oEvent.getParameters();
					if (oParams.response.statusCode === 503) {
						this.isTimedOut = true;
						this.showTimeoutMessage();
					}
				}, this);
			}
		},
		showTimeoutMessage: function () {
			//for showing the timeout dialog
			var that = this;
			MessageBox.error(
				that.solutionText, {
					id: "serviceErrorMessageBox",
					icon: MessageBox.Icon.WARNING,
					details: that.suggestionText,
					title: that.timeoutDialogTitle,
					actions: [that.reloadButtonText, MessageBox.Action.CLOSE],
					initialFocus: that.reloadButtonText,
					onClose: function (sAction) {
						if (sAction === this.reloadButtonText) {
							window.location.reload();
						} else {
							sap.ui.getCore().byId("idBusy").close();
						}
					}.bind(that)
				}
			);
		},
		destroy: function () {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
			sap.ui.getCore().byId("idBusy").destroy();
			var applicationContainer = document.getElementsByClassName("sapUShellApplicationContainer")[3].getAttribute("id");
			if (sap.ui.getCore().byId(applicationContainer + "-component---thingpage--idEventList--idEventTable-PersoDialog-Dialog")) {
				sap.ui.getCore().byId(applicationContainer + "-component---thingpage--idEventList--idEventTable-PersoDialog-Dialog").destroy();
				sap.ui.getCore().byId(applicationContainer + "-component---thingpage--idEventList--idEventTable-PersoDialog-cb").getParent()
					.destroy();
			}

		}
	});
});