import { Partial } from "/src/partials/common.js";
import { gFetch } from "/src/modules/fetch.js";
import { uNode } from "/src/modules/utils.js";
import { gLocales } from "/src/modules/locales.js"
import { SearchBar } from "/src/partials/stdbs/navigation.js"
class MainNavBar extends Partial{
    createNodes(){
        let li=[{n:"li",a:{class:"nav-item"},c:[
            {n:"a",spa:true,a:{class:"nav-link",href:"/"},t:gLocales("Inicio")},
        ]},
        {n:"li",a:{class:"nav-item"},c:[
            {n:"a",spa:true,a:{class:"nav-link",href:"/favoritos"},t:gLocales("Favoritos")},
        ]}];
        let json=[{n:"div",a:{class:"navbar navbar-expand-md bg-body-tertiary shadow", id:this.DOM.getId("navbar")},c:[{n:"div",a:{class:"container-fluid"},c:[{n:"a",spa:true,a:{class:"navbar-brand d-flex",href:"/"},c:[{n:"img",a:{src:"/assets/img/notfound-icon.png",alt:"Logo",width:"40",height:"40",class:"d-inline-block align-text-top"}},{n:"span",a:{class:"align-self-center"},t:
            "Notificaciones"}]},
            {n:"button",a:{class:"navbar-toggler",type:"button","data-bs-toggle":"collapse","data-bs-target":"#"+this.DOM.getId("collapse"),"aria-controls":this.DOM.getId("collapse"),"aria-expanded":"false","aria-label":"Toggle navigation"},c:[{n:"span",a:{class:"navbar-toggler-icon"}}]},            
            {n:"div",a:{class:"collapse navbar-collapse gap-2",id:this.DOM.getId("collapse")},c:[
                {n:"ul",a:{class:"navbar-nav me-auto",id:this.DOM.getId("items")},c:li},
                {n:"div",a:{class:"my-2 w-100"},c:[this.PRT.appendChild("searchBar",new SearchBar())]},
                {n:"div",a:{class:"d-flex gap-2 justify-content-end",id:this.DOM.getId("profile")}},
            ]}
        ]}]}];
        return json;
    }
    createEvents(){
        uNode.setInterpolation(this.DOM.getNodeById("navbar"),
            {"marginTop":["-3rem", "0rem"]}, .5
        );
        this.nProfile=this.DOM.getNodeById("profile");
        this.cSearch=this.getChild("searchBar");
        this.updateProfile();
        this.cSearch.setSearchEvent((value)=>{
            this.env.goToView("/?q="+value,true);
        });
    }
    updateProfile(){
        let session = this.env.getSession();
        let profile;
        if(session==null){
            profile=[
                {n:"a",spa:true,spa:true,a:{class:"btn btn-primary text-nowrap",href:"/login",role:"button"},t:gLocales("Login")},
            ]
        }else{
            profile=[
                {n:"div",c:[{n:"button",a:{"type":"button","class":"btn","data-bs-toggle":"dropdown","aria-expanded":"false"},c:[{n:"div",a:{"class":"d-flex align-items-center gap-2"},
                    c:[{n:"span",t:`${session.username}`},{n:"img",a:{"src":"/assets/img/profile.jpg","width":"30","height":"30","class":"rounded-circle"}}]}]},{n:"ul",a:{"class":"dropdown-menu dropdown-menu-end"},
                    c:[
                        {n:"h5",a:{class:"mx-3 text-center"},t:`${session.nombres} ${session.apellidos??""}`},
                        session.rol=="Administrador"?{n:"li",c:[
                        {n:"a",spa:true,spa:true,a:{"class":"dropdown-item","href":"/dashboard/productos"},t:"Dashboard"}]}:{},
                        //{n:"li",c:[{n:"a",spa:true,a:{"class":"dropdown-item","href":"#"},t:"Carrito"}]},
                        //{n:"li",c:[{n:"a",spa:true,a:{"class":"dropdown-item","href":"#"},t:"Historial de compras"}]},
                        {n:"li",c:[{n:"hr",a:{"class":"dropdown-divider"}}]},
                        {n:"li",c:[{n:"button",a:{"class":"dropdown-item",id:this.DOM.getId("logout")},t:"Log out"}
                    ]
                }]}]},
            ]
        }
        uNode.removeChildren(this.nProfile);
        this.DOM.appendJsonList(profile,this.nProfile);
        let button=this.DOM.getNodeById("logout");
        if(button){
            button.addEventListener("click",async ()=>{
                this.env.logout().then(()=>{
                    this.env.callTemplate("updateProfile");
                    this.env.goToView("/");
                });
            });
        }
    }
    constructor(){
        super();
    }
}
//Plantilla por defecto
class MainTemplate extends Partial{
    createNodes(){
        let json=[{n:"div",a:{class:"h-100 d-flex flex-column"},c:[{n:"nav",c:[this.PRT.appendChild("nav", new MainNavBar())]},
            {n:"main",a:{class:"overflow-scroll h-100", id:this.DOM.getId("main")},c:[this.PRT.appendChild("main", new Partial())]}]}
        ];
        return json;
    }
    updateProfile(){
        this.cNavBar.updateProfile();
    }
    createEvents(){

    }
    constructor(){
        super();
    }
}
export {MainTemplate};