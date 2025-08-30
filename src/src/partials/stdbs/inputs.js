import { uObject } from "/src/modules/utils.js";

import { Partial } from "/src/partials/common.js";
import { EventValidation } from "/src/modules/validation.js";
import { SearchBar } from "/src/partials/stdbs/navigation.js";
/*
    Datos de input:
    {   
        cancelable: //Verdadero si quieres que tenga una opcion para cancelar (puede ser usado para inputs que manejan muchos datos)
        inputs:     //Datos de la lista de inputs
        [{  placeholder:    //Place holder de input (usar gLocales para traducir el texto)
            ,type:"text"     //Tipo de input (valores disponibles: "text", "number", "textarea", "date")
            ,args:{"space":false,"number":true,"lowbar":false}}]    //Argumentos adicionales (varia segun el tipo de input)
        }]
    }
*/
class Button extends Partial{
    #_clickEvent=async()=>{};
    createNodes(){
        return [{n:"button",key:"btn",e:{click:async(e)=>{await this.#_clickEvent(e);}},a:{class:"btn btn-primary",type:"button"},t:this.data.placeholder}];
    }
    createEvents(){
        this.nButton=this.DOM.getNode("btn");
    }
    setClickEvent(callback, wait=true){
        if(wait)this.#_clickEvent=async(e)=>{
            try{this.disable();await callback(e);}
            catch(e){throw e;}
            finally{this.enable();}
        };else this.#_clickEvent=callback;
    }
    disable(){this.nButton.setAttribute("disabled","");}
    enable(){this.nButton.removeAttribute("disabled");}
    static defData={placeholder:""};
    constructor(data={}, styles={}){
        super();
        this.data=uObject.assign(data,Button.defData);
    }
}

class TextInput extends Partial{
    getValue(){
        if(this.data.type==="number") return Number.parseFloat(this.nInput.value);
        return this.nInput.value;
    }
    createNodes(){
        return [{n:this.data.type==="textarea"?"textarea":"input",a:{id:this.DOM.getId("input"),rows:this.style.rows, type:this.data.type,class:"form-control", "aria-label":this.data.placeholder, "placeholder":this.data.placeholder}}];
    }
    createEvents(){
        this.nInput=this.DOM.getNodeById("input");
        switch (this.data.type){
            case "number":
                EventValidation.numberInput(this.nInput,this,this.data.typeArgs);
                this.nInput.setAttribute("type","text");
                break;
            default: EventValidation.textInput(this.nInput,this,this.data.typeArgs);
        }
    }
    static defData={type:"text",placeholder:"",typeArgs:{}};
    static defStyles={rows:4};
    constructor(data={}, styles={}){
        super();
        this.data=uObject.assign(data,TextInput.defData);
        this.style=uObject.assign(styles,TextInput.defStyles);
    }
}
class SwitchInput extends Partial{
    getValue(){return this.nInput.checked;}
    createNodes(){
        return [{n:"div",a:{class:"form-check form-switch"},c:[
            {n:"input",a:{class:"form-check-input",type:"checkbox",id:this.DOM.getId("input"),"switch":""}},
            {n:"label",a:{class:"form-check-label","for":this.DOM.getId("input")},t:this.data.placeholder}
        ]}];
    }
    createEvents(){this.nInput=this.DOM.getNodeById("input");}
    static defData={placeholder:""};
    static defStyles={};
    constructor(data={}, styles={}){
        super();
        this.data=uObject.assign(data,SwitchInput.defData);
        this.style=uObject.assign(styles,SwitchInput.defStyles);
    }
}
class FileInput extends Partial{
    getValue(){
        let file = this.nInput.files[0];
        if(file)return file;
        return null;
    }
    createNodes(){
        let json=[{n:"input",a:{id:this.DOM.getId("input"),type:"file",class:"form-control", "aria-label":this.data.placeholder, "placeholder":this.data.placeholder}}];
        if(this.data.multiple) json.a.multiple="";
        return json;
    }
    createEvents(){this.nInput=this.DOM.getNodeById("input");}
    static defData={type:"text",placeholder:"",multiple:false};
    static defStyles={};
    constructor(data={}, styles={}){
        super();
        this.data=uObject.assign(data,FileInput.defData);
        this.style=uObject.assign(styles,FileInput.defStyles);
    }
}
function __newInput(name, args, includeGroup=false){
    switch(name){
        case "input": return new TextInput(args);
        case "switch": return new SwitchInput(args);
        case "file": return new FileInput(args);
        default:
            if(includeGroup&&name==="group")return new InputGroup(args);
            throw new Error(`Input type "${name}" is not supported.`);
    }
}

class InputGroup extends Partial {
    #onlyInput=true;
    getValue(){
        let result=[];
        for(const i in this.data.inputs){
            result.push(this.getChild(i).getValue());
        }return result;
    }
    createNodes(){
        let inputs=[];
        for(const i in this.data.inputs){
            switch(this.data.inputs[i].type){
                case "switch": this.#onlyInput=false;
            }inputs.push(this.PRT.appendChild(i,__newInput(this.data.inputs[i].type,this.data.inputs[i].args,false)));
        }
        if(!this.#onlyInput){
            inputs=[{n:"div",a:{class:"d-flex align-items-center flex-wrap gap-3 w-100"},c:inputs}];
        }
        this.lastInput=inputs.length-1;
        let json=[{n:"div",a:{id:this.DOM.getId("group"),class:this.#onlyInput?"input-group":"d-flex gap-1"},c:inputs}];
        if(json.length>1)json=[{n:"div", a:{class:"col mb-2"}, c:json}];
        return json;
    }
    createEvents(){
        this.nGroup=this.DOM.getNodeById("group");
        this.nInputs=this.nGroup.querySelectorAll("input,textarea");
    }
    static defData = {
        inputs:[{type:"input", args:{}}],
    }
    constructor(data={}, styles={}){
        super();
        this.data=uObject.assign(data,InputGroup.defData);
    }
}
class Form extends Partial {
    getValue(){
        const result = new FormData();
        for(const i in this.getChildren()){
            console.log(i,this.getChild(i));
            let value=this.getChild(i).getValue();
            if(value!=null)result.append(i,value);
        }return result;
    }
    createNodes(){
        let json=[];
        for(const row of this.data.rows){
            let inputGroup=[];
            for(const col of row){
                let inputs=[];
                inputs.push(this.PRT.appendChild(col.name,__newInput(col.type,col.args,true)));
                let child=this.getChild(col.name);
                if(this.data.validation)inputs.push({n:"div", a:{class:"valid-feedback", id:child.DOM.getId("form-val")}});
                inputs.unshift({n:"label",a:{"for":child.DOM.getId("input"),class:"form-label"},t:col.label});
                inputs=[{n:"div",a:{class:"col mb-3"},c:inputs}];
                inputGroup=[...inputGroup,...inputs];
            }
            if(inputGroup.length>1)inputGroup=[{n:"div",a:{class:"row"},c:inputGroup}];
            json=[...json,...inputGroup];
        }
        return [{n:"form",c:json}];
    }
    createEvents(){}
    setValidation(errors,valid=false){
        if(!this.data.validation)return;
        for(const i in errors){
            let cChild=this.getChild(i);
            cChild.nInput.classList[valid?"add":"remove"]("is-valid");
            cChild.nInput.classList[valid?"remove":"add"]("is-invalid");
            let nVal = cChild.DOM.getNodeById("form-val");
            nVal.classList[valid?"add":"remove"]("valid-feedback");
            nVal.classList[valid?"remove":"add"]("invalid-feedback");
            nVal.textContent=Array.isArray(errors[i])?errors[i].join(" "):errors[i];
        }
    }
    static defData = {
        rows:[[{name:undefined,type:"input",label:""}]],
        cancelable:false,validation:true,
    };
    constructor(data={}, styles={}){
        super();
        for(const i in data.rows){
            if(!Array.isArray(data.rows[i]))data.rows[i]=[data.rows[i]];
        }this.data=uObject.assign(data,Form.defData);
    }
}
export {Button, TextInput, SwitchInput, FileInput, InputGroup, Form};