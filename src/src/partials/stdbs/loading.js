import { Loading } from "/src/partials/common.js";
import { gLocales } from "/src/modules/locales.js"
import { uObject, uError, uNode, uTime } from "/src/modules/utils.js";


class SpinnerLoading extends Loading{
    #_cancel=()=>{};
    #_created=false;
    #_observer;
    createNodes(){
        let info={};let json={};
        if(this.data.info)info={n:"span",a:{id:this.DOM.getId("info"),class:"text-center"},t:gLocales(this.cancelled?"Cancelled":"Loading")};
        if(this.cancelled){
            json=[{n:"div",a:{class:"h-100 d-flex flex-column align-items-center justify-content-center"},c:[{n:"button",a:{id:this.DOM.getId("retry"),type:"button",class:"btn bg-secondary rounded-circle bg-opacity-75","style":"width:2.5rem;height:2.5rem"},c:[{n:"i",a:{class:"fa fa-redo","aria-hidden":"true"}}]},info]}];
        }else{
            let cancel={};if(this.data.cancelable) cancel={n:"button",a:{"hidden":"",id:this.DOM.getId("cancel"),type:"button",class:"btn bg-secondary rounded-circle bg-opacity-75 h-100 w-100"},c:[{n:"i",a:{class:"fa fa-times","aria-hidden":"true"}}]};
            json=[{n:"div",a:{class:"h-100 d-flex flex-column align-items-center justify-content-center"},c:[{n:"div",a:{id:this.DOM.getId("all"),"style":"width:2.3rem;height:2.3rem",class:"d-flex justify-content-center align-items-center"},c:[
                {n:"div",a:{id:this.DOM.getId("spinner"),class:`spinner-${this.styles.spinner} h-100 w-100`,"role":"status"},c:[
                    {n:"span",a:{class:"visually-hidden"},t:"Cargando..."}
                ]},cancel]},info]}];
        }
        return json;
    }
    createEvents(){
        //Agregar estilos a la encapsulacion
        this.#show();
        this.nSpinner=this.DOM.getNodeById("spinner");
        if(this.data.info) this.nMessage=this.DOM.getNodeById("info");
        if(this.cancelled){
            this.nRetry=this.DOM.getNodeById("retry");
            this.nRetry.addEventListener("click",async ()=>{
                this.cancelled=false;
                this.DOM.drawAll();this.refresh();
            });
        }else if(this.data.cancelable){
            this.nAll=this.DOM.getNodeById("all");
            this.nCancel=this.DOM.getNodeById("cancel");
            this.nAll.addEventListener("mouseenter",()=>{this.nCancel.hidden=false;this.nSpinner.hidden=true;});
            this.nAll.addEventListener("mouseleave",()=>{this.nSpinner.hidden=false;this.nCancel.hidden=true;});
            this.nCancel.addEventListener("click",()=>{this.cancelled=true;this.#_cancel();this.DOM.drawAll();});
        }
        this.setPartialEvents(async()=>{
            await this.#fade();
        }, async(e)=>{
            if(e instanceof Error) console.error(uError.formatError(e));
            if(this.data.destroyOnFail){this.destroy();}
            else{
                this.cancelled=true;
                this.DOM.drawAll();
                if(this.data.info) this.nMessage.textContent=e.message;
            }
        });
    }
    create(){
        if(this.#_created)return;
        this.#_created=true;
        this.nGroup=uNode.createFromJson(
            {n:"div", a:{class:"position-relative"},c:[
                {n:"div", a:{class:"position-absolute top-50 start-50 translate-middle h-100 w-100 z-1"}},
                {n:"div"},
            ]}
        );
        this.nLoading=this.nGroup.children[0];
        this.nContent=this.nGroup.children[1];
        //Sincronizar el tamaño y el scroll del nodo contenido con el nodo padre
        this.#_observer=uNode.syncSizeAndScroll(this.nContent,this.nDrawParent);
        //Mover todos los elementos al nuevo grupo
        while (this.nDrawParent.firstChild) {
            this.nContent.appendChild(this.nDrawParent.firstChild);
        }this.nDrawParent.appendChild(this.nGroup);
        this.DOM.setParent(this.nLoading);
        this.DOM.drawAll();
    }
    destroy(){
        if(!this.#_created)return;
        this.#_created=false;
        this.#_observer.disconnect();
        while (this.nContent.firstChild) {
            this.nDrawParent.appendChild(this.nContent.firstChild);
        }
        this.DOM.removeAll();
        this.DOM.setParent(this.nDrawParent);
        this.nGroup.remove();
    }
    async #show(){
        await Promise.all([
            uNode.setInterpolation(this.nContent, {opacity:[1,0.5]}, .2),
            uNode.setInterpolation(this.nLoading, {opacity:[0,1]}, .2)
        ]);
    }
    async #fade(){
        await Promise.all([
            uNode.setInterpolation(this.nContent, {opacity:[0.5,0]}, .3),
            uNode.setInterpolation(this.nLoading, {opacity:[1,0]}, .2)
        ]);
    }
    setCancel(cancel){
        this.#_cancel=cancel;
    }
    static defData={
        info:true,
        cancelable:false,
        destroyOnFail:true,
    }
    static defStyles={
        spinner:"border",
    }
    constructor(data={}, styles={}){
        super(data,styles);
        this.data=uObject.assign(data,SpinnerLoading.defData);
        this.styles=uObject.assign(data,SpinnerLoading.defStyles);
        this.cancelled=false;
    }
}
export {Loading, SpinnerLoading};