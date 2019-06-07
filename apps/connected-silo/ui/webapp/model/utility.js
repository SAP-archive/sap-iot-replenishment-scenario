sap.ui.define([], function () {
	"use strict";

	var oMapRestModel;

	return {

		setMapRestModel: function (oModel) {
			oMapRestModel = oModel;
		},

		getMapRestModel: function () {
			return oMapRestModel;
		}
	};
});