import { uObject, uTime } from "/src/modules/utils.js";

import { Partial } from "/src/partials/common.js";
import { Table } from "./table.js";
import { Pagination, SearchBar, Tab} from "./navigation.js";
import { Modal } from "./modal.js";
import { Form } from "./inputs.js";
import { gLocales } from "/src/modules/locales.js";
import { gFetch } from "/src/modules/fetch.js";

import { SpinnerLoading } from "./loading.js";
class Crud extends Partial{
    #index=0;#curID=0;#curMode="store";
    createNodes(){
        let json=[{n:"div",a:{class:"d-flex flex-column gap-2"},c:[
            this.PRT.appendChild("tab",new Tab({
                data:this.navData
            })),
            {n:"div",a:{class:"d-flex justify-content-between"},c:[
                this.PRT.appendChild("search", new SearchBar()),
                {n:"div",a:{id:this.DOM.getId("buttons"),class:"d-flex justify-content-end gap-1"},c:[
                    {n:"button",a:{type:"button",class:"btn btn-primary",type:"store"},t:gLocales("Create")},
                    {n:"button",a:{type:"button",class:"btn btn-secondary",type:"update"},t:gLocales("Edit")},
                    {n:"button",a:{type:"button",class:"btn btn-danger",type:"delete"},t:gLocales("Delete")},
                ]},
            ]},
            {n:"div",a:{class:"table-responsive"},c:[
                this.PRT.appendChild("table",new Table({
                    hover:{enabled:true, showID:true}
                })),
            ]},
            this.PRT.appendChild("pag",new Pagination()),
        ]}, this.PRT.appendChild("modal",new Modal()) ];
        return json;
    }
    createEvents(){
        this.nButtons=this.DOM.getNodeById("buttons").childNodes;
        //Crear loadings
        this.cTableLoading=new SpinnerLoading({destroyOnFail:false});

        for(const i of this.nButtons)
            i.addEventListener("click",()=>{
                this.#setModalForm(i.getAttribute("type"));
                this.PRT.getChild("modal").openModal();
            });
            this.nButtons[0].addEventListener("click",()=>{
        });
        this.PRT.getChild("pag").setPageEvent(this.#crudUpdateEvent);
        this.PRT.getChild("search").setSearchEvent(()=>{this.#crudUpdateEvent(1);});
        this.PRT.getChild("search").setUpdateEvent(()=>{this.#crudUpdateEvent(1);});
        this.PRT.getChild("tab").setTabEvent((index)=>{
            this.setCrudData(index);
            this.#crudUpdateEvent(1);
        });
        //Guardar ID de tabla:
        this.PRT.getChild("table").setRowEvent((id)=>{
            this.#curID=id;
        });
        //Crear datos:
        this.PRT.getChild("modal").setConfirmEvent(async()=>{
            let values=this.data.values[this.#index];
            let form = this.getChild("modal", "main");
            switch (this.#curMode) {
                case "update":
                case "delete":
                    form.append("_id",this.#curID);
            }
            await gFetch.post(
                `${this.data.url.replace("$PREFIX",values.prefix)}/${this.#curMode}`,form.getValue()).then(
                (json)=>{
                    this.#crudUpdateEvent(this.PRT.getChild("pag").getPageNum());
                    this.PRT.getChild("modal").child.closeModal();
                }).catch((e)=>{
                    if (e instanceof Error) throw e;
                    form.setValidation(e.errors,false);
                });
        });
        this.setCrudData();
    }
    setCrudData(index=0){
        this.#index=index;
        this.PRT.getChild("search").nInput.value="";
        this.PRT.getChild("table").setData(this.data.values[this.#index].columns);
        this.#setModalForm();
    }
    #setModalForm(mode="store"){
        let data = JSON.parse(JSON.stringify(this.data.values[this.#index]));
        this.#curMode=mode;
        let title = "Crear";
        switch(mode){
            case "update":
                data.form.cancelable=true; title="Editar";
            case "store": this.PRT.getChild("modal").setModalMain(new Form(data.form));
                break;
            case "delete":
                this.PRT.getChild("modal").setModalMain(new Form({
                    rows:[{name:"_",label:"¿Estas seguro de que quieres eliminar el dato?",args:{type:"hidden"}},],
                }));break;
        }
    }
    #crudUpdateEvent=async(index)=>{
        if(this.data.values) {
            let values=this.data.values[this.#index];
            let table;
            console.log(this.PRT.getChild("table").nRows);
            this.cTableLoading.set(this.PRT.getChild("table").nRows,
                async (loading)=>{
                    //await uTime.sleep(50000);
                    await gFetch.get(`${this.data.url.replace("$PREFIX",values.prefix)}?page=${index}&search=${this.PRT.getChild("search").getValue()}`,"json",this.ID)
                    .then(json=>{table=json;});/*.catch(e=>{
                        //if (e instance of Error)
                        console.log(e);
                        this.child.table.errorMessage(`Error ${e.name}: ${e.message}`);
                    });*/
                },(loading)=>{
                    this.PRT.getChild("table").setRows(table.data);
                    this.PRT.getChild("pag").setPageSize(table.total);
                }
            ).refresh();
            
        }
    }
    setData(table,pages){
       this.data.table=table;
       this.data.pages=pages;
    }
    setApiUrl(url){
       this.data.url=url;
    }
    static defaultData={
        url:"$PREFIX",
        values:[{name:"",prefix:"",columns:{},form:Form.defaultData}],
        pages:1,
        table:{},
        modalMode:"store",
    }
    constructor(data={}){
        super();
        this.data=uObject.assign(data,Crud.defaultData);
        this.navData = [];
        for(const i in this.data.values) this.navData.push({name:this.data.values[i].name,value:i});
    }
}
export {Crud};