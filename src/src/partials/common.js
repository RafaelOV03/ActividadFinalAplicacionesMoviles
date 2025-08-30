import {gUrl} from "/src/modules/urlinfo.js";
import { lFetch } from "/src/modules/fetch.js";
import { uError, uNode, uTime, uUrl } from "/src/modules/utils.js";
let ID=0;
class Partial{
    //Nodo padre del partial
    #_parentNode=null;
    //Lista de nodos creados con createNodes()
    #_partialNodes=[];
    //Lista de nodos guardados
    #_savedNodes={};
    //Lista de hijos pendientes
    #_pendingChildren={};
    //Lista de hijos Partial
    #_children=[];
    //Scripts que se ejecutaran cuando se cree un nuevo nodo
    #_nodeScripts={
        byProp:{
            ...uNode.nodeScripts.byProp,
            key:(node,json)=>{this.#_savedNodes[json.key]=node;},
            spa:(node,json)=>{if(json.spa)node.addEventListener("click",(e)=>{e.preventDefault();this.env.goToView(e.currentTarget.href);});},
        },
        byName:{
            ...uNode.nodeScripts.byName,
            PARTIAL:(node)=>{
                const name=node.getAttribute("name");
                const child=this.getChild(name);
                if(child){
                    child.DOM.setParent(node.parentNode);
                    child.DOM.appendJsonList(child.createNodes(),node.parentNode, true);
                    this.#_pendingChildren[name]=child;
                    for(const cNode of child.DOM.getNodes())uNode.insertNodeAfter(node,cNode);
                }else console.warn(`No se encontro el hijo "${name}" en el nodo ${this.ID}`);
                node.remove();
            }
        }
    }

    //Funciones de creación por defecto
    createNodes(){return [];}
    createEvents(){}
    //Enlazar partials hijos con el padre
    #bindChild(name,child){
        this.#_children[name]=child;
        child.parent=this;
        child.env=this.env;
    }
    //Reemplazar hijo por un nuevo partial
    replaceChild(name, newChild){
        let child = this.#_children[name];
        if(child){
            newChild.DOM.setParent(this.#_children[name].DOM.getParent());
            this.#_children[name].DOM.removeAll();
            this.#bindChild(name,newChild);
            this.#_children[name].DOM.drawAll();
        }else (console.warn(`No se encontro el hijo "${name}" en el nodo ${this.ID}`));
    }
    getChild(...children){
        let curPartial=this;
        for(const i of children){
            curPartial=curPartial.#_children[i];
            if(!curPartial)break;
        }return curPartial;
    }
    getChildren(){
        return this.#_children;
    }
    constructor(){
        this.ID=(++ID);
        this.env=null;
        this.nodeData={};
        this.parent=null;
        this.#_children={};
        this.data={};
        this.style={};
        this.PRT={
            //Obtener hijo, nieto, etc.
            getChild:(...children)=>{
                let curPartial=this;
                for(const i of children){
                    curPartial=curPartial.#_children[i];
                    if(!curPartial)break;
                }return curPartial;
            },
            //Reemplazar un hijo por otro partial
            replaceChild:(name, newChild)=>{
                let child = this.#_children[name];
                if(child){
                    newChild.DOM.setParent(this.#_children[name].DOM.getParent());
                    this.#_children[name].DOM.removeAll();
                    this.#bindChild(name,newChild);
                    this.#_children[name].DOM.drawAll();
                }else (console.warn(`No se encontro el hijo "${name}" en el nodo ${this.ID}`));
            },
            //Agregar hijo a un json
            appendChild:(name,child)=>{
                if(!this.#_children.hasOwnProperty(name)){
                    this.#bindChild(name,child);
                    return {n:`partial`,a:{name:name}};
                }console.warn(`Ya existe el hijo "${name}"`);
                return {};
            },
        };
        this.DOM={
            //Eliminar a todos los nodos e hijos
            removeAll:()=>{
                for(const c in this.#_children){
                    this.#_children[c].DOM.removeAll();
                }
                for(const n of this.#_partialNodes){
                    n.remove();
                }this.#_partialNodes=[];
                this.#_pendingChildren=[];
                this.#_children={};
                this.#_savedNodes={};
            },
            //Crear todos los nodos y mostrarlos en parent, null para crearlo en el padre por defecto
            drawAll:(parent=null)=>{
                if(parent)this.DOM.setParent(parent);
                this.DOM.removeAll();
                if(this.#_parentNode){
                    try{
                        this.#_partialNodes=this.DOM.appendJsonList(this.createNodes(),this.#_parentNode,true);
                        this.DOM.createChildrenEvents();
                        this.createEvents();
                    }catch(e){console.error(uError.formatError(e));}
                }else console.error(uError.formatError(new Error(`El Nodo "${this.ID}" es huerfano`)));
            },
            //Crear un nuevo nodo a partir de un JSON
            appendJson:(json, parent=this.#_parentNode)=>{
                let node = uNode.appendJson(parent,json,this.#_nodeScripts);
                this.DOM.createChildrenEvents();
                return node;
            },
            //Crear un nuevo nodo a partir de un Vector de JSON (similar a createNodes)
            appendJsonList:(jsonList, parent=this.#_parentNode, mainNodes=false)=>{
                let nodes=[];
                for(const i of jsonList){
                    nodes.push(uNode.appendJson(parent,i,this.#_nodeScripts));
                }if(mainNodes)this.#_partialNodes=nodes;
                else this.DOM.createChildrenEvents();
                return nodes;
            },
            createChildrenEvents:()=>{
                for(const name in this.#_pendingChildren){
                    this.#_pendingChildren[name].DOM.createChildrenEvents();
                    this.#_pendingChildren[name].createEvents();
                }this.#_pendingChildren={};
            },
            getParent:()=>{return this.#_parentNode;},
            getNodes:()=>{return this.#_partialNodes;},
            getId:(subID=null)=>{return `${this.ID}${subID?`-${subID}`:''}`;},
            getNode:(key)=>{
                return this.#_savedNodes[key];
            },
            getNodeById:(subID=null)=>{
                return document.getElementById(this.DOM.getId(subID));
            },
            setParent:(nParent)=>{this.#_parentNode=nParent;},
        };
    }
};
class Loading extends Partial{
    #_response=async(partial)=>{partial.destroy()};
    #_load=async()=>{};
    #_pSuccess=async()=>{};
    #_pError=async(e)=>{console.error(e);this.destroy()};
    set(parent, load=this.#_load, response=this.#_response){
        this.nDrawParent=parent;
        this.setLoadEvents(load, response);
        return this;
    }
    async refresh(){
        this.create();
        try{
            await this.#_load(this);
        }catch(e){
            //Si ocurre un error, se cancela la carga
            await this.#_pError(e);
            return;
        }
        await this.#_pSuccess(this);
        this.destroy();
        this.#_response(this);
    }
    create(){}
    destroy(){}
    setLoadEvents(load, response=this.#_response){
        this.#_load=load;
        this.#_response=response;
    }
    setPartialEvents(success=this.#_pSuccess, error=this.#_pError){
        this.#_pSuccess=success;
        this.#_pError=error;
    }
    constructor(){
        super();
        this.nDrawParent=this.DOM.getParent();
    }
}
class Env extends Partial{
    static #HOOKID=0;
    #_templates={};
    #_getLoading=()=>{return new Loading();};
    #curMain=null;
    #curTemplate=null;
    #_hooks={
        main:{
            onLoad:{},
            onEnd:{},
        },
        template:{
            onLoad:{},
            onChangeMain:{},
            onEnd:{},
        },
    };
    #appendHook(hook, name, type, removeOnEnd, ID){
        this.#_hooks[name][type][ID]=hook;
        if(removeOnEnd){
            let newID=ID+"-del";
            this.#appendHook(()=>{
                delete this.#_hooks[name][type][ID];
                delete this.#_hooks[name].onEnd[newID];
            }, name, "onEnd", false, newID);
        }
        return ID;
    }
    createNodes(){
        let json = [this.PRT.appendChild("template",new Partial())];
        return json;
    }
    createEnv(){
        this.DOM.drawAll(this.root);
    }
    async loadTemplate(id){
        let imp=await import(`/src/templates/${id}.js`);
        let template = new imp.MainTemplate(this);
        if(!this.#_templates.hasOwnProperty(id))this.#_templates[id]=template;
    }
    callTemplate(callback,...args){
        if(typeof this.#curTemplate[callback] === "function")this.#curTemplate[callback](...args);
    }
    callMain(callback,...args){
        if(typeof this.#curMain[callback] === "function")this.#curMain[callback](...args);
    }
    changeTemplate(id){
        if(!this.#_templates.hasOwnProperty(id)){
            console.error(`Plantilla "${id}" no encontrada`);
            return;
        }
        for(const hook in this.#_hooks.template.onEnd)this.#_hooks.template.onEnd[hook](this.#curTemplate);
        this.#curTemplate=this.#_templates[id];
        this.PRT.replaceChild("template", this.#curTemplate);
        for(const hook in this.#_hooks.template.onLoad)this.#_hooks.template.onLoad[hook](this.#curTemplate);
    }
    async goToView(url,replace=false){
        const nUrl = uUrl.normalize(url);
        const nCurUrl = uUrl.normalize(window.location.href);
        if(replace){
            history.replaceState({},"",url);
        }else{
            if(uUrl.getHref(nUrl)===uUrl.getHref(nCurUrl)){
                return;
            }history.pushState({},"",url);
        }await this.loadMain(url);
    }
    async loadMain(url=window.location){
        this.urlInfo=gUrl.getPathInfo(url);//Obtener la informacion de la URL
        let template = this.getChild("template");
        if(template.getChild("main")){
            this.#_getLoading().set(template.DOM.getNodeById("main"),
                async (p)=>{
                    try{
                        let imp;
                        try{
                            imp=await import(`/src/views${this.urlInfo.fileName}`);
                        }catch(e){
                            let status=Number.parseInt(e.message);
                            if(isNaN(status)){status=404;
                                console.error(uError.formatError(e));
                            }imp=await import(`/src/views_status/${status}.js`);
                        }
                        let newMain = new imp.MainPage(this);
                        for(const hook in this.#_hooks.main.onEnd)this.#_hooks.main.onEnd[hook](this.#curMain);        
                        this.#curMain=newMain;
                    }catch(e){
                        console.error(uError.formatError(e));
                    }
                },()=>{
                    if(this.#curMain.page){
                        document.title=this.#curMain.page.name;
                        template.PRT.replaceChild("main", this.#curMain);
                    }for(const hook in this.#_hooks.main.onLoad)this.#_hooks.main.onLoad[hook](this.#curMain);
                }
            ).refresh();
        }else console.warn("No se encontro la vista main, asegurate de vincular un partial 'main' en la plantilla");
    }
    setLoading(load){
        this.#_getLoading=load;
    }
    constructor(root){
        super();
        this.root=root;
        this.urlInfo=gUrl.getPathInfo(window.location);
        this.env=this;//Asignarse a si mismo como entorno para heredarselo a lo hijos
        this.HOOK={
            onLoadMain:(hook, destroySelf=true, ID=`env:${Env.#HOOKID++}`)=>{
                this.#appendHook(hook, "main", "onLoad", destroySelf, ID);
            },
            onEndMain:(hook, destroySelf=true, ID=`env:${Env.#HOOKID++}`)=>{
                this.#appendHook(hook, "main", "onEnd", destroySelf, ID);
            },
            onLoadTemplate:(hook, destroySelf=true, ID=`env:${Env.#HOOKID++}`)=>{
                this.#appendHook(hook, "template", "onLoad", destroySelf, ID);
            },
            onChangeMain:(hook, destroySelf=true, ID=`env:${Env.#HOOKID++}`)=>{
                this.#appendHook(hook, "template", "onChangeMain", destroySelf, ID);
            },
            onEndTemplate:(hook, destroySelf=true, ID=`env:${Env.#HOOKID++}`)=>{
                this.#appendHook(hook, "template", "onEnd", destroySelf, ID);
            },
            remove:(ID)=>{
                for(const hook in this.#_hooks.main.onLoad){
                    if(this.#_hooks.main.onLoad[hook].ID===ID){
                        delete this.#_hooks.main.onLoad[hook];
                    }
                }
                for(const hook in this.#_hooks.main.onEnd){
                    if(this.#_hooks.main.onEnd[hook].ID===ID){
                        delete this.#_hooks.main.onEnd[hook];
                    }
                }
                for(const hook in this.#_hooks.template.onLoad){
                    if(this.#_hooks.template.onLoad[hook].ID===ID){
                        delete this.#_hooks.template.onLoad[hook];
                    }
                }
                for(const hook in this.#_hooks.template.onChangeMain){
                    if(this.#_hooks.template.onChangeMain[hook].ID===ID){
                        delete this.#_hooks.template.onChangeMain[hook];
                    }
                }
                for(const hook in this.#_hooks.template.onEnd){
                    if(this.#_hooks.template.onEnd[hook].ID===ID){
                        delete this.#_hooks.template.onEnd[hook];
                    }
                }
            }
        }
    }
}
export {Partial, Loading, Env};