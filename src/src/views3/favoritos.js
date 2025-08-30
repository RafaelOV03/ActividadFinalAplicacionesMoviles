import { Partial } from "/src/partials/common.js";
import { SpinnerLoading } from "/src/partials/stdbs/loading.js";
import { gFetch } from "/src/modules/fetch.js";
import { uNode } from "/src/modules/utils.js";
class MainPage extends Partial{
    createNodes(){
        let json = [
            {n:"div", a:{class:"container my-4"}, c:[
                {n:"h2", a:{class:"mb-4"},t:"Libros Destacados"},
                {n:"div", a:{id:this.DOM.getId("catalogo"),class:"d-flex flex-wrap gap-4",style:"min-height:400px;"}, c:[
                    
                ]}
            ]}

        ];
        return json;
    }
    createEvents(){
        let query = new URLSearchParams(window.location.search);
        this.nCatalogo=this.DOM.getNodeById("catalogo");
        let json={};
        new SpinnerLoading({destroyOnFail:false}).set(
            this.nCatalogo,async ()=>{
                json = JSON.parse(localStorage.getItem("favs"))||{};
            },()=>{
                console.log(json);
                if(json){
                    this.nCatalogo.innerHTML="";
                    let nodeList=[];
                    for(const k in json){
                        const v = json[k];
                        nodeList.push({n:"div", a:{class:"card", style:"width: 12rem;"}, c:[
                            {n:"img", a:{src:v.volumeInfo.imageLinks?.thumbnail||"/assets/img/notfound-icon.png", class:"card-img-top", alt:v.volumeInfo.title}},
                            {n:"div", a:{class:"card-body"}, c:[
                                {n:"h5", a:{class:"card-title"}, t:v.volumeInfo.title},
                                {n:"p", a:{class:"card-text"}, t:v.volumeInfo.authors?.join(", ")||"Desconocido"},
                                {n:"button", a:{id:this.DOM.getId("remove-"+k),class:"btn btn-primary"}, t:"Eliminar de favoritos",}
                            ]}
                        ]});
                    };
                    uNode.appendJson(nodeList,this.nCatalogo);
                    for(const k in json){
                        this.DOM.getNodeById("remove-"+k).addEventListener("click",()=>{
                            let favoritos = JSON.parse(localStorage.getItem("favs"));
                            if(!favoritos) favoritos={};
                            delete favoritos[json[k].id];
                            localStorage.setItem("favs",JSON.stringify(favoritos));
                            this.nCatalogo.innerHTML="";
                            this.createEvents();
                        });
                    }
                }else{
                    this.nCatalogo.innerHTML="<p>No se encontraron libros.</p>";
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