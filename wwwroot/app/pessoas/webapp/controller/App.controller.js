sap.ui.define([
	"br/com/idxtec/pessoas/controller/BaseController",
	"br/com/idxtec/pessoas/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox"
], function(BaseController, formatter, Filter, FilterOperator, Sorter, Dialog, MessageBox) {
	"use strict";

	return BaseController.extend("br.com.idxtec.pessoas.controller.App", {

		formatter: formatter,

		onInit: function () {
			let oView = this.getView();
			let oTable = this.byId("table");

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			/* 
			var oNomeColumn = oView.byId("nome");
			oView.byId("table").sort(oNomeColumn, sap.ui.table.SortOrder.Ascending); 
			*/

			oTable.clearSelection();
		},

		onBtnAtualizarPress: function(e){
			this.getOwnerComponent().getModel().refresh();
		},

		onFiltro: function(e){
			let sQuery = e.getParameter("query");
			let oFilter = new Filter([
				new Filter("nome", FilterOperator.Contains, sQuery)
			]);
			this.byId("table").getBinding("rows").filter(oFilter, "Application");
		},

		onBtnIncluirPress: function(e){
			let oContext, dialog;
			let oBinding;

			oBinding = this.byId("table").getBinding("rows");
			oContext = oBinding.create({
						"nome": "",
						"cnpj": "",
						"inscricao": "",
						"telefone": ""
					});
			
			this.byId("table").setSelectedIndex(0);

			dialog = this.byId("IncluiPessoaDialog");
			dialog.setBindingContext(oContext);
			dialog.open();

			oContext.created().then(function(){
				oBinding.refresh();
			}, function(error){
				MessageBox.error(error.message);
			});

		},

		onBtnOkDialogIncluir: function(e){
			let that = this;
			let fnError = function(error){
				MessageBox.error(error.message);
			}.bind(this);

			this.getOwnerComponent().getModel().submitBatch("UpdateGroup").then(
				function(){
					that.byId("IncluiPessoaDialog").close();	
				}, fnError );
		},

		onBtnCancelarDialogIncluir: function(e){
			this.byId("table").getBinding("rows").resetChanges();
			this.byId("IncluiPessoaDialog").close();
		},

		onBtnAlterarPress: function(e){
			let oContext = this.onSelectItem(e);
			if (oContext){
				let id = oContext.getObject().id;
				
				this.byId("table").clearSelection();
				this.getOwnerComponent().getRouter().navTo("update",{
					"id": id
				});
			} else {
				sap.m.MessageBox.warning("Selecione um item na tabela.");
			}
			
		},

		onBtnRemoverPress: function(e){
			let that = this;
			let oContext;

			oContext = that.onSelectItem(e);
			
			if (oContext){
				sap.m.MessageBox.warning(
					"Deseja realmente remover o item selecionado ?", {
						actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES],
						styleClass: "sapUiSizeCompact",
						onClose: function(sAction) {
							if (sAction == "YES"){
								oContext.delete("$auto").then(function(){
									that.byId("table").clearSelection();
									MessageBox.success("Item removido com sucesso.");
								}.bind(that), function(error){
									MessageBox.error(oError.message);
								});
							}
						}
					}
				);
			} else {
				sap.m.MessageBox.warning("Selecione um item na tabela.");
			}
		},

		onSelectItem: function(e) {
			let oContext = null;
			let oTable = this.byId("table");
			let nIndex = oTable.getSelectedIndex();
			
			if (nIndex > -1){
				oContext = oTable.getContextByIndex(nIndex);
			}
			return oContext;
		},

		clearFilter: function(){
			let oTable, oListBinding;
			let iCols;

			oTable = this.byId("table");
			oTable.clearSelection();
			iCols = oTable.getColumns().length;

			oListBinding = oTable.getBinding();
			if (oListBinding) {
				oListBinding.filter([]);
			}

			for (let i = 0; i < oTable.getColumns().length; i++) {
				oTable.getColumns()[i].setFilterValue("");
				oTable.getColumns()[i].setFiltered(false);
			}
		}
	});
});