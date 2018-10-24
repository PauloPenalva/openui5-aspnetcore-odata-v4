sap.ui.define([
    "br/com/idxtec/pessoas/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "br/com/idxtec/pessoas/model/pessoas"
], function(BaseController, MessageBox, JSONModel, Pessoas) {
    'use strict';
    
    return BaseController.extend("br.com.idxtec.pessoas.controller.AddPage",{
        
        onInit: function(){
            let oRouter = this.getRouter();
            oRouter.getRoute("add").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched : function (oEvent) {
            

		},
        
        onBtnSalvarPress: function(e){
           
        },

        onBtnCancelarPress: function(e){
            this.onNavBack();
        }
    });
});