import { uNode, uObject } from "/src/modules/utils.js";

import { Partial } from "/src/partials/common.js";
import { gFetch } from "/src/modules/fetch.js";
import { gThemes } from "/src/modules/themes.js";
import { gLocales } from "/src/modules/locales.js"
class MainNavBar extends Partial{
    createNodes(){
        let json=[{n:"div",a:{class:`navbar navbar-expand-md bg-${this.styles.background} shadow`, id:this.DOM.getId("navbar")},c:[
            {n:"div",a:{class:"container-fluid"},c:[
                {n:"a",spa:true,a:{class:"navbar-brand d-flex gap-2",href:"/"},c:[
                    {n:"img",a:{src:"/assets/img/logo.svg",width:"40",height:"40",class:"d-inline-block align-text-top"}},
                    {n:"h1",a:{class:"align-self-center fw-bold fs-3"},t:this.data.title}
                ]},
                {n:"div",a:{class:"gap-2 justify-content-end",id:this.DOM.getId("collapse")},c:[
                    {n:"div",a:{class:"d-flex gap-2 justify-content-end",id:this.DOM.getId("profile")}},
                ]}
            ]}
        ]}];
        return json;
    }
    createEvents(){
        uNode.setInterpolation(this.DOM.getNodeById("navbar"),
            {"marginTop":["-3rem", "0rem"]}, .5
        );
        this.nProfile=this.DOM.getNodeById("profile");
        this.updateProfile();
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
                {n:"div",c:[
                    {n:"button",a:{"type":"button","class":"btn","data-bs-toggle":"dropdown","aria-expanded":"false"},c:[{n:"div",a:{"class":"d-flex align-items-center gap-2"},
                    c:[{n:"span",t:`${session.username}`},{n:"img",a:{"src":"/assets/img/profile.jpg","width":"30","height":"30","class":"rounded-circle"}}]}]},{n:"ul",a:{"class":"dropdown-menu dropdown-menu-end"},
                    c:[
                        {n:"h5",a:{class:"mx-3 text-center"},t:`${session.nombres} ${session.apellidos??""}`},
                        session.rol=="Administrador"?{n:"li",c:[
                        {n:"a",spa:true,spa:true,a:{"class":"dropdown-item","href":"/dashboard/productos"},t:"Dashboard"}]}:{},
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
    constructor(data={}, styles={}){
        super();
        this.data=data;
        this.styles=styles;
    }
}
//Plantilla por defecto
class MainTemplate extends Partial{
    createNodes(){
        let json=[{n:"div",a:{class:"h-100 d-flex flex-column"},c:[{n:"nav",c:[this.PRT.appendChild("nav", new MainNavBar(this.data,this.styles))]},
            {n:"main",a:{class:"overflow-scroll h-100", id:this.DOM.getId("main")},c:[this.PRT.appendChild("main", new Partial())]}]}
        ];
        return json;
    }
    createEvents(){
        this.cNavBar=this.getChild("nav");
        this.updateProfile();

    }
    updateProfile(){
        this.cNavBar.updateProfile();
    }
    constructor(data={}, styles={}){
        super();
        this.data=uObject.assign(data,{
            title:"DiceDrop",
        });
        this.styles=uObject.assign(styles,{
            background:"primary",
        });
    }
}
await gThemes.importCssJson([
    {n:".bg-primary",a:{
        "background-color": "rgba(var(--bs-success-rgb), var(--bs-bg-opacity)) !important"
    }}
],"ReyDadoTheme");
export {MainTemplate};