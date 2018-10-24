sap.ui.define([
    "sap/ui/base/Object"
], function(BaseObject) {
    "use strict";

    return BaseObject.extend("br.com.idxtec.pessoas.model.pessoas",{

        constructor: function(){
            return {
                "id": 0,
                "nome": "",
                "cnpj": "",
                "inscricao": "",
                "telefone": ""
            };
        },

        insert: function(objeto){
            let model = this.getOwnerComponent().getModel();
            let self = this;
            
            self.ok = true;

            model.create("/Pessoas", objeto, function(data){
                    console.log(data);
                },function(error){
                    console.log(error);
                    self.ok = false;
                }
            );

            return self.ok;
        }

    })
});