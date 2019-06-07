sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.iot.noah.connectedsilo.controller.ThingListPage", {
		onInit: function () {
			this.filterTokenCount = 0;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("thinglistpage").attachMatched(this._onRouteMatched, this);
			
			//Setting up the i18n Model
			var i18nModel = this.getOwnerComponent().getModel("i18n");
			this.getView().setModel(i18nModel, "i18nNew");
		},
		//method on click of value help option of multiInput 
		onClickValueHelpRequest: function (oEvent) {
			var that = this;
			var sColumnName = oEvent.getSource().data("filterColumn");
			var oMultiInput = oEvent.getSource();
			var oVBox = new sap.m.VBox({
				id: "idVBoxFilterContainer"
			});
			this.filterContentTemplate(sColumnName);
			var pstDialog = new sap.m.Dialog({
				id: "idDialogFilter",
				title: "Filter",
				content: oVBox,
				resizable: true,
				draggable: true,
				beginButton: new sap.m.Button({
					enabled: false,
					text: "{i18n>OK}",
					press: function () {
						var aItems = oVBox.getItems();
						for (var i = 0; i < aItems.length; i++) {
							var sTokenValue = that.tokenCreation(aItems[i]);
							if (sTokenValue) {
								oMultiInput.addToken(new sap.m.Token({
									key: aItems[i].getItems()[2].getValue(),
									text: sTokenValue,
									tooltip: sTokenValue
								}));
								that.filterTokenCount++;
							}
						}
						pstDialog.close();
						pstDialog.destroy();
					}
				}),
				endButton: new sap.m.Button({
					text: "{i18n>Close}",
					press: function () {
						pstDialog.close();
						pstDialog.destroy();
					}
				})
			});
			//to get access to the global model
			this.getView().addDependent(pstDialog);
			pstDialog.open();
		},
		//adding items to dialog 
		filterContentTemplate: function (sColumnName) {
			var that = this;
			var aOption = [];
			var allEntityTypes = this.byId("idIoTThingList").getModel().getServiceMetadata().dataServices.schema[0].entityType;
			var sType = "";

			for (var i = 0; i < allEntityTypes.length; i++) {
				for (var j = 0; j < allEntityTypes[i].property.length; j++) {
					if (allEntityTypes[i].property[j].name == sColumnName) {
						sType = allEntityTypes[i].property[j].type;
						break;
					}
				}
			}
			if (sType.split(".")[1] == "String") {
				aOption = ["contains", "equal to"];
			} else if (sType.split(".")[1] == "Int32" || "Double") {
				aOption = ["contains", "equal to", "greater than", "less than"];
			}
			var oInputColumn = new sap.m.Input({
				value: sColumnName,
				tooltip: sColumnName,
				enabled: false
			});

			var oCombo = new sap.m.ComboBox().addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginEnd");
			aOption.forEach(function (options) {
				oCombo.addItem(new sap.ui.core.ListItem({
					key: options,
					text: options
				}));
			});
			oCombo.setSelectedKey(oCombo.getItems()[0].getKey());

			var oInput = new sap.m.Input({
				liveChange: this._validate
			});

			var addButton = new sap.m.Button({
				icon: "sap-icon://add",
				type: sap.m.ButtonType.Transparent,
				press: function () {
					that.filterContentTemplate(sColumnName);
				}
			});

			var oHBox = new sap.m.HBox({
				items: [oInputColumn, oCombo, oInput, addButton]
			}).addStyleClass("sapUiTinyMargin");

			sap.ui.getCore().byId("idVBoxFilterContainer").addItem(oHBox);
		},

		//text input for the filters
		onTextChange: function (oEvent) {
			var text = oEvent.getParameter("newValue");
			var oMultiInput = oEvent.getSource();
			oMultiInput.setValue("");
			oMultiInput.addToken(new sap.m.Token({
				key: text,
				text: "=" + text
			}));
		},

		// method to create tokens for multiInput
		tokenCreation: function (hBox) {
			var sTokenValue;
			var sComboValue = hBox.getItems()[1].getValue();
			var sInputValue = hBox.getItems()[2].getValue().trim();
			if (sInputValue) {
				if (sComboValue == "contains") {
					sTokenValue = "*" + sInputValue + "*";
				} else if (sComboValue == "equal to") {
					sTokenValue = "=" + sInputValue;
				} else if (sComboValue == "greater than") {
					sTokenValue = ">" + sInputValue;
				} else if (sComboValue == "less than") {
					sTokenValue = ">" + sInputValue;
				}
				return sTokenValue;
			}
		},

		//method to get the application filters
		getApplicationFilters: function () {
			var oBindingInfo = this.byId("idIoTThingList").oThingTable.getBindingInfo("items");
			if (oBindingInfo.binding.aApplicationFilters.length > 0) {
				var aFilterArray = oBindingInfo.binding.aApplicationFilters[0].aFilters;
				for (var i = 0; i < aFilterArray.length; i++) {
					if (aFilterArray[i].aFilters && aFilterArray[i].aFilters.hasOwnProperty("bSearchField")) {
						this.aFilterFromSearch.push(aFilterArray[i]);
					} else if (aFilterArray[i].aFilters[i] && aFilterArray[i].aFilters[i].aFilters.hasOwnProperty("bSearchField")) {
						this.aFilterFromSearch.push(aFilterArray[i].aFilters[i]);
					}
				}
			}
		},

		// method on token deletion
		onTokenUpdate: function (e) {
			var that = this;
			if (e.getParameter("type") == "removed") {
				this.filterTokenCount--;
				if (this.filterTokenCount == 0) {
					this.getApplicationFilters();
					if (this.aFilterFromSearch.length > 0) {
						this.byId("idIoTThingList").oThingTable.getBinding("items").filter(new sap.ui.model.Filter(this.aFilterFromSearch, true), sap.ui
							.model.FilterType.Application);
					} else {
						this.byId("idIoTThingList").oThingTable.getBinding("items").filter([], sap.ui.model.FilterType.Application);
					}
				}
			}
		},
		_validate: function () {
			var dFlag = "true";
			var nVBox = sap.ui.getCore().byId("idVBoxFilterContainer").getItems();
			nVBox.forEach(function (count) {
				if (count.getItems()[2].getValue() == null) {
					dFlag = "false";
				}
			});
			if (dFlag == "true") {
				sap.ui.getCore().byId("idDialogFilter").getBeginButton().setEnabled(true);
			}
		},
		//on click of go button filtering based of multiInput tokens 
		onSearch: function (oEvent) {
			var aSelecetdList = oEvent.getParameter("selectionSet");
			var vOperation = "";
			var aColumnFilter = [];
			var oCombinedFilter = [];
			this.aFilterFromSearch = [];
			var operatorMap = {
				"=": sap.ui.model.FilterOperator.EQ,
				"*": sap.ui.model.FilterOperator.Contains,
				">": sap.ui.model.FilterOperator.GT,
				"<": sap.ui.model.FilterOperator.LT
			};
			this.getApplicationFilters();
			aSelecetdList.forEach(function (oSel) {
				var aFilter = [];
				if (oSel.getTokens().length > 0) {
					oSel.getTokens().forEach(function (oToken) {
						var oTypeofFilter = oToken.getText().charAt(0);
						var oFreeText = oTypeofFilter == "*" ? oToken.getText().substr(1).slice(0, -1) : oToken.getText().substr(1).slice(0);
						var oCol = oSel.data("filterColumn");
						var oFilter = new sap.ui.model.Filter({
							path: oCol,
							operator: operatorMap[oTypeofFilter],
							value1: oFreeText
						});
						aFilter.push(oFilter);
					});
					var aNewFilter = new sap.ui.model.Filter(aFilter, false);
					aColumnFilter.push(aNewFilter);
				}
			});
			if (this.aFilterFromSearch.length > 0) {
				oCombinedFilter.push(new sap.ui.model.Filter(this.aFilterFromSearch, true));
			}
			if (aColumnFilter.length > 0) {
				oCombinedFilter.push(new sap.ui.model.Filter(aColumnFilter, true));
			}
			if (oCombinedFilter.length > 0) {
				this.byId("idIoTThingList").oThingTable.getBinding("items").filter(new sap.ui.model.Filter(oCombinedFilter, true), sap.ui.model.FilterType
					.Application);
			} else {
				oCombinedFilter = [];
				this.byId("idIoTThingList").oThingTable.getBinding("items").filter(oCombinedFilter, sap.ui.model.FilterType.Application);
			}
		},

		_onRouteMatched: function (oEvent) {
			sap.ui.getCore().byId("idBusy").close();
		},

		handleNavBackPress: function () {
			window.history.back();
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			}
		},

		onThingListPress: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				sap.ui.getCore().byId("idBusy").open();
			}
			var oData = oEvent.getParameter("thing").getModel().oData;
			var sPath = oEvent.getParameter("thing").sPath.substr(1);
			var oObject = oData[sPath];

			this.getOwnerComponent().getRouter().navTo("thingpage", {
				thingId: oObject.ThingId,
				thingType: oObject.ThingType,
				highSeverity: oObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.High || 0,
				mediumSeverity: oObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Medium || 0,
				lowSeverity: oObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Low || 0
			});
		}

	});
});