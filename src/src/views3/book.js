import { Partial } from "/src/partials/common.js";
import { SpinnerLoading } from "/src/partials/stdbs/loading.js";
import { gFetch } from "/src/modules/fetch.js";
import { uNode } from "/src/modules/utils.js";
class MainPage extends Partial{
    createNodes(){
        let json = [
            {n:"div", a:{class:"container my-4"}, c:[
                {n:"h2", a:{class:"mb-4"},t:"Detalles"},
                {n:"div", a:{id:this.DOM.getId("libro"),class:"card mx-auto",style:"min-height:400px; max-width: 500px;"}, c:[]}
            ]}
        ];
        return json;
    }
    createEvents(){
        let query = new URLSearchParams(window.location.search);
        this.nLibro=this.DOM.getNodeById("libro");
        let json={};
        new SpinnerLoading({destroyOnFail:false}).set(
            this.nLibro,async ()=>{
                await gFetch.get("/volumes/"+(query.get("id"))).then(
                j=>{
                    json=j;
                });
            },()=>{
                console.log(json);
                if(json){
                    let nodeList=[
                        {n:"img", a:{class:"card-img-top", src:json.volumeInfo.imageLinks?.thumbnail||"", alt:json.volumeInfo.title||""}},
                        {n:"div", a:{class:"card-body"}, c:[
                            {n:"h5", a:{class:"card-title"}, t:json.volumeInfo.title||""},
                            {n:"p", a:{class:"card-text"}, t:json.volumeInfo.authors?json.volumeInfo.authors.join(", "):""},
                            {n:"p", a:{class:"card-text"}, t:json.volumeInfo.publishedDate||""},
                            {n:"p", a:{class:"card-text"}, t:json.volumeInfo.description||""},
                            {n:"button", a:{id:this.DOM.getId("add"),class:"btn btn-secondary mt-3"}, t:"Agregar a favoritos"},
                        ]}
                    ];
                    uNode.appendJson(nodeList,this.nLibro);
                    this.DOM.getNodeById("add").addEventListener("click",()=>{
                        let favoritos = JSON.parse(localStorage.getItem("favs"));
                        if(!favoritos) favoritos={};
                        favoritos[json.id]=json;
                        localStorage.setItem("favs",JSON.stringify(favoritos));
                    });
                }else{
                    this.nLibro.innerHTML="<p>No se encontro el libro.</p>";
                }
            }
        ).refresh();
        
            
    }
    constructor(){
        super();
        this.page={
            name:"Inicio",
        };
    }
}
export {MainPage};