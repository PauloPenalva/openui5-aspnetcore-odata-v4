sap.ui.define([
    "br/com/idxtec/pessoas/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function(BaseController, MessageBox, JSONModel) {
    'use strict';
    
    return BaseController.extend("br.com.idxtec.pessoas.controller.UpdatePage",{
        
        onInit: function(){
            let oRouter = this.getRouter();
            
            this.sId = null;

            oRouter.getRoute("update").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched : function (oEvent) {
            let oJSONModel, oView, oModel, sId, oArgs;
            let that = this;

            this.sId = oEvent.getParameter("arguments").id;
            
            oModel = this.getOwnerComponent().getModel();
            oModel.read("/Pessoas(" + this.sId + ")", {
                success: (oData)=>{
                    oJSONModel = new JSONModel(oData);
                    oView = that.getView();
                    oView.setModel(oJSONModel,"model");
                }, 
                error: (oError)=>{
                    console.log(oError.message);
                    return;
                }
            });

		},
        
        onBtnSalvarPress: function(e){
            let oView, oModel, oJSONModel, oData;
            let that = this;

            oView = this.getView();
            oJSONModel = oView.getModel("model");
            oData = oJSONModel.oData;

            oModel = this.getOwnerComponent().getModel();

            oModel.update("/Pessoas("+ this.sId +")", oData, {
                success: function(data){
                    MessageBox.success("Dados gravados !",{
                        styleClass: "sapUiSizeCompact",
                        onClose: function(sAction){
                            that.onNavBack();
                        }
                    })
                }, 
                error: function(error){
                    MessageBox.error(error.responseText, {
                        title: error.statusCode
                    });
                }
            });
        },

        onBtnCancelarPress: function(e){
            this.onNavBack();
        }

    });
});