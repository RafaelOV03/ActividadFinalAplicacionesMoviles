import { uNode, uObject } from "/src/modules/utils.js";

import { Partial, Loading } from "/src/partials/common.js";
import { gLocales } from "/src/modules/locales.js";
class Table extends Partial{
    #data={};
    body=[];
    head=[];
    #prevRowNode=null;
    static getColSpan(head, row){
        const keys=Object.keys(head);
        let colspan={};
        let j=keys[0];
        for(const i of keys){
            colspan[i]=0;
            if(!(row[i]==null&&head[j].colspan))j=i;
            colspan[j]++;
        }return colspan;
    }
    #updateColumns(){
        let head=[];
        for(const h in this.data.head)
            head.push({n:"th",a:{"scope":"col"},t:this.data.head[h].name});
        uNode.replaceJsonChildren(this.nHead, head);
    }
    #updateRows(){
        let rows=[];
        for(const row of this.data.body){
            let columns=Table.getColSpan(this.data.head,row);
            let cells=[];
            for(const col in columns){
                let a={colspan:columns[col]};
                switch(a.colspan){
                    case 0:break;
                    case 1:a={};
                    default:cells.push({n:"td",a:a,t:row[col]});
                }
            }rows.push({n:"tr",c:cells});
        }uNode.replaceJsonChildren(this.nRows, rows);
    }
    #updateRows2(){
        if(this.body&&this.data.hover.enabled)for(const row of nRows){
            row.addEventListener("click",
                async (e)=>{
                    if(this.#prevRowNode)this.#prevRowNode.classList.remove("table-active");
                    (this.#prevRowNode=e.currentTarget).classList.add("table-active");
                    //await this.#rowFunc(e.currentTarget.getAttribute("data-table-id"));
                }
            );
        }
    }
    #dUpdateAll(){
        uNode.removeChildren(this.nHead);
        let head=[];
        for(const h in this.head)
            head.push({n:"th",a:{"scope":"col"},t:this.head[h].name});
        this.DOM.appendJsonList(head,this.nHead);
        this.#updateRows();
    }
    createNodes(){
        let json=[{n:"table",a:{class:`table ${this.data.hover.enabled?"table-hover":""}`},c:[{n:"thead",c:[{n:"tr",a:{id:this.DOM.getId("headRow")}}]},{n:"tbody",a:{id:this.DOM.getId("bodyRows")}}]}];
        return json;
    }
    createEvents(){
        this.nHead=this.DOM.getNodeById("headRow");
        this.nRows=this.DOM.getNodeById("bodyRows");
        this.setColumns();
        //this.#updateColumns();
        //this.nRows.style.minHeight="200px";
        //this.#dUpdateAll();
    }
    setRows(rows){
        this.data.body=rows;
        this.#updateRows();
    }
    setData(head, rows=[]){
        this.body=rows;
        this.head=head;
        this.#dUpdateAll();
    }
    setColumns(columns=this.data.head, append=false){
        if(!append)this.data.head={};
        for(const col in columns){
            columns[col]=uObject.assign(columns[col],Table.rowDef);
            this.data.head[col]=uObject.assign(columns[col],Table.argsDef[columns[col].type]);
        }this.#updateColumns();
    }
    setRowEvent(event){
        //this.#rowFunc=event;
    }
    errorMessage(message){
        uNode.removeChildren(this.nRows);
        this.DOM.appendJsonList([{n:"tr",c:[{n:"td",t:message}]}],this.nRows);
    }
    static defData={
        hover:{
            enabled:false,
            showID:false,
        },
        head:{},
        body:[],
    }
    static rowDef={
        type:"default",
        colspan:false,//Verdadero si la celda puede ocupar varias columnas si estan vacias
    }
    static argsDef={
        id:{hidden:false},
        img:{create:(value)=>{new Image(value);}},
        custom:{map: (nCell, row)=>{}},
        default:{format:"%"}
    }
    constructor(data={}){
        super();
        this.data=uObject.assign(data,Table.defData);
    }
    /*
        Sintaxis:
            Head:
                {"Columna 1":{name:"",type:"",...},...}
                Tipos de columnas:
                "id": Define una id que se utilizara en eventos
                    args:
                        hidden:false
                "img": Celda con imagen
                    args:
                        create:(value)=>{new Image(value);}
                "custom": Celda personalizada
                    args:
                        map: (nCell, row)=>{}
                default: Texto por defecto
                    args:
                        format:"%"
            Body:
                [{"Columna 1":"value"}]
    */
}
export {Table}