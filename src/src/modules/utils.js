//Funciones de manipulación del DOM
class uNode {
    //Remover todos los nodos hijos de un elemento
    static removeChildren(parent){
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }
    //Similar a querySelectorAll solo que incluye el nodo padre
    static querySelectorSelf(node, selector){
        return [node, ...node.querySelectorAll(selector)].filter(n => n.matches(selector));
    }
    //Asignar atributos a un nodo a partir de un json
    static assignAttributes(node,json){
        for(let key in json)node.setAttribute(key,json[key]);
    }
    //Asignar eventos a un nodo a partir de un json
    static assignEvents(node,json){
        for(const name in json)node.addEventListener(name, json[name]);
    }
    static nodeScripts={
        byProp:{
            a:(node,json)=>{this.assignAttributes(node,json.a);},
            t:(node,json)=>{node.textContent=json.t},//Por motivos de compatibilidad, quitar luego
            e:(node,json)=>{this.assignEvents(node,json.e);},
        },
        byName:{}
    }
    //Agregar una lista de nodos json a un nodo padre
    static appendJson(parent, json, scripts=uNode.nodeScripts){
        let node=this.createFromJson(json, scripts);
        if(node){
            parent.appendChild(node);
            for(const name in scripts.byName){
                if(node.tagName===name)scripts.byName[name](node,json);
            }
        }return node;
    }
    /**
     * Crea un nodo en base a un json
     * @param {*} json El objeto JS
     * @param {*} scripts las funciones que se ejecutarán despues de crear un nodo
     * @returns El nodo creado
     */
    static createFromJson(json, scripts=uNode.nodeScripts){
        let node=null;
        if(json.hasOwnProperty("n")){
            node=document.createElement(json["n"]);
            if(json.hasOwnProperty("c")){
                for(const child of json["c"])this.appendJson(node,child,scripts);
            }for(const name in scripts.byProp){
                if(json.hasOwnProperty(name))scripts.byProp[name](node,json);
            }
        }else{
            if(json.t)node=document.createTextNode(json.t);
        }return node;
    }
    //Reemplazar los hijos de un padre por un json
    static replaceJsonChildren(parent,jsonList,scripts=uNode.nodeScripts){
        this.removeChildren(parent);
        for(const json of jsonList)this.appendJson(parent,json,scripts);
        return parent.childNodes;
    }
    //Insertar un nodo despues de otro
    static insertNodeAfter(sibling, newNode){
        sibling.parentNode.insertBefore(newNode,sibling.nextSibling);
    }
    //Insertar una lista de nodos despues de otro
    static insertNodeListAfter(sibling, newNodeList){
        for(let i=newNodeList.length-1;i>=0;i--) {
            sibling.parentNode.insertBefore(newNodeList[i],sibling.nextSibling);
        }
    }
    //Insertar un json despues de otro, devuelve el nuevo nodo
    static insertJsonAfter(sibling,json,scripts=uNode.nodeScripts){
        let newNode = this.appendJson(sibling.parentNode,json,scripts);
        this.insertNodeAfter(sibling, newNode);
        return newNode;
    }
    static insertJsonListAfter(sibling,json,scripts=uNode.nodeScripts){
        let newNodeList = [];
        for(const item of json){
            newNodeList.push(this.appendJson(sibling.parentNode,item,scripts));
        }this.insertNodeListAfter(sibling, newNodeList);
        return newNodeList;
    }
    //Obtiene el índice de un nodo dentro de su padre
    static childIndex(node){
        let i=0;while((node=node.previousSibling)!=null)++i;
        return i;
    }
    //Crea una animacion para un nodo
    static async setInterpolation(node, attr, time=.3, startAt=.0, easing="ease-in-out"){
        node.style.transition=`all 0s`;
        for(let name in attr)node.style[name]=attr[name][0];
        void node.offsetWidth;
        await new Promise(r => setTimeout(r, startAt*1000));
        node.style.transition=`all ${time}s ${easing}`;
        for(let name in attr)node.style[name]=attr[name][1];
        await new Promise(r => setTimeout(r, time*1000));
    }
    //Sincroniza el tamaño y el scroll del nodo target con el nodo src
    //Devuelve un ResizeObserver para poder llamar a disconnect posteriormente
    static syncSizeAndScroll(target, src){
        const scroll=[src.scrollLeft,src.scrollTop];
        const setSizeAndScroll=()=>{
            target.style.width=src.offsetWidth+"px";
            target.style.height=src.offsetHeight+"px";
            requestAnimationFrame(()=>{target.scrollTo(...scroll);});
        };target.style.overflow="hidden";
        const observer = new ResizeObserver(setSizeAndScroll);
        observer.observe(src);
        setSizeAndScroll();
        return observer;
    }
}
class uObject {
    /*Asigna valores por defecto a un objeto, permitiendo asignar
    valores a arreglos, objetos anidados y valores primitivos.*/
    static assign(target,defaults){
        if(typeof defaults==="object"){
            if(Array.isArray(defaults)){
                if(!Array.isArray(target))target=[];
                for(const i in target){
                    target[i]=this.assign(target[i],defaults[0]);
                }
            }else{
                if(typeof target!=="object")target={};
                for(const i in defaults){
                    target[i]=this.assign(target[i],defaults[i]);
                }
            }
        }return target??(defaults===undefined?this.undefValue++:defaults);
    }
}
class uError {
    //Obtener el stack en formato JSON
    static getStackInfo(error){
        let stackValues=[];
        for(const line of error.stack.split("\n")){
            let stackLine = {};
            let i = line.indexOf("@");
            stackLine.function = line.substring(0, i);
            let fileStr = line.substring(i + 1);
            i = fileStr.lastIndexOf(":");
            let j = fileStr.lastIndexOf(":", i - 1);
            stackLine.column = fileStr.substring(i + 1);
            stackLine.file = fileStr.substring(0, j);
            stackLine.line = fileStr.substring(j + 1, i);
            stackValues.push(stackLine);
        }stackValues.pop();
        return stackValues;
    }

    static ignoreIncludes=[];//"/src/partials/common.js","/src/modules/"];
    
    //Devuelve un string con el formato por defecto de un error
    static formatError(error){
        let stack = this.getStackInfo(error).filter(stackLine => {
            return !this.ignoreIncludes.some(include => stackLine.file.includes(include));
        });
        return `Ocurrio un error!\n${error.name}: ${error.message}\n${stack.map(i => `${i.function}():\n\t${i.file} linea ${i.line}`).join("\n")}`;
    }
}
class uTime{
    static async sleep(time){
        await new Promise(r => setTimeout(r, time))
    }
}
class uUrl{
    //Convierte un directorio a url
    static normalize(url){
        if(url instanceof URL)return url;
        if(url.startsWith("/"))url=window.location.origin+url;
        return new URL(url);
    }
    //Obtiene la url sin queries
    static getHref(url){
        return url.href.split('?')[0];
    }
}
export {uNode, uObject, uError, uTime, uUrl};