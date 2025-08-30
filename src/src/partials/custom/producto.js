import { uObject } from "/src/modules/utils.js";

import { Partial } from "/src/partials/common.js"
import { gFetch } from "/src/modules/fetch.js";
class Producto extends Partial{
    #data={};#s={}
    createNodes(){
        let name=this.data.nombre;
        let imagen=this.data.imagenes;
        if(!(imagen.length))imagen=[{url:"/assets/img/notfound-icon.png"}];

        if(name.length>14)name=name.substring(0,11)+"...";
        let json=[{n:"div",a:{"class":"card","style":"width: 14rem;"},c:[
            {n:"a",spa:true,a:{"href":`/producto?id=${this.data.id}`,"style":"height: 222px; transition: filter 0.3s; filter: brightness(100%);","onmouseover":"this.style.filter='brightness(70%)'","onmouseout":"this.style.filter='brightness(100%)'"},
                c:[{n:"img",a:{"src":imagen[0].url,"class":"img-fluid card-img-top p-3","alt":"..."}}]
            },{n:"div",a:{"class":"card-body pt-0"},c:[{n:"h4",a:{"class":"card-title text-center"},t:name},{n:"h5",a:{"class":"card-text"},t:`BOB${this.data.precio}`},{n:"a",spa:true,a:{"href":`/producto?id=${this.data.id}`,"class":"btn btn-secondary rounded-5 w-100 mb-1"},c:[{n:"i",a:{"class":"fa fa-info-circle","aria-hidden":"true"}},{n:"span",t:"Detalles"}]},{n:"button",a:{"id":this.DOM.getId("cart"),"class":"btn btn-primary rounded-5 w-100"},c:[{n:"i",a:{"class":"fa fa-shopping-cart","aria-hidden":"true"}},{n:"span",t:"Agregar al carrito"}]}]}]}
        ];
        return json;
    }
    createEvents(){
        this.nCart = this.DOM.getNodeById("cart");
        this.nCart.addEventListener("click",async (e)=>{
            let response=await gFetch.isLogged();
            if(response==null){
                this.env.goToView("/login");
            }else{
                gFetch.get("/carrito/agregar/"+this.data.id).then(json=>{
                    ////Display.tAlert("Producto agregado al carrito");
                })
            }
        });
    }
    static defaultData={
        url:[],
        nombre:"Sin nombre",
        precio:" (Sin definir)",
        id:1,
    }
    constructor(data={}){
        super();
        this.data=uObject.assign(data,Producto.defaultData);
    }
}
class Catalogo extends Partial{
    #data={};#s={};
    #catalogo=[];
    createNodes(){
        let productos = [];
        let json=[{n:"div",a:{"class":"container pt-4"},c:[{n:"h2",a:{"class":"mb-4"},t:this.data.titulo},{n:"div",a:{"class":"scroll-container",style:"height:387px;"},c:[
            {n:"button",a:{"class":"scroll-btn scroll-btn-left",id:this.DOM.getId("lbutton")},t:"←"},
            {n:"div",a:{"class":`scroll-wrapper`,"id":this.DOM.getId("scroll")},
            c:[],
        },{n:"button",a:{"class":"scroll-btn scroll-btn-right",id:this.DOM.getId("rbutton")},t:"→"}]}]}];
        return json;
    }
    createEvents(){
        this.nScroll=this.DOM.getNodeById("scroll");
        gFetch.get(this.data.url).then(json=>{
            if(!json.error){
                this.#catalogo=json;
                let productos=[];
                for(const i in this.#catalogo){
                    productos.push({n:"div",a:{"class":"item"},c:[this.PRT.appendChild(i,new Producto(this.#catalogo[i]))]});
                }this.DOM.appendJson(productos,this.nScroll);
                //this.DOM.drawChildren();
            }
        })
        this.DOM.getNodeById("lbutton").addEventListener("click",()=>{
            this.scroll(-200);
        });
        this.DOM.getNodeById("rbutton").addEventListener("click",()=>{
            this.scroll(200);
        });
        this.scroll(-10000);
    }

    scroll(value){
        this.nScroll.scrollBy({left: value,behavior: 'smooth'});
    }

    static defaultData={
        titulo:"Catalogo",
        url:"/",
    }
    constructor(data={}){
        super();
        this.data=uObject.assign(data,Catalogo.defaultData);
    }
}
export {Producto, Catalogo};