import { Partial } from "../src/partials/common.js";
import { gFetch } from "../src/modules/fetch.js";
import { gLocales } from "../src/modules/locales.js";
import { Form } from "../src/partials/inputs.js";
class MainPage extends Partial{
    createNodes(){
        let content=[
            {n:"div",a:{class:"card w-75 m-auto"},c:[
                {n:"div",a:{class:"card-body d-flex flex-column gap-3"},c:[
                    {n:"h1",a:{class:"h3 mb-3 text-center"},t:gLocales("Register")},
                    this.PRT.appendChild("form",new Form({
                        cancelable:false,
                        validation:true,
                        rows: [
                        [
                            {name:"nombres", label:gLocales("Nombre"),input:{type:"text",placeholder:gLocales("Nombre"),args:{}}},
                            {name:"apellidos", label:gLocales("Apellido"),input:{type:"text",placeholder:gLocales("Apellido"),args:{}}}
                        ],
                        {name:"username", label:gLocales("User"),input:{type:"text",placeholder:gLocales("User"),args:{}}},
                        {name:"password", label:gLocales("Password"),input:{type:"password",placeholder:gLocales("Password"),args:{}}},
                        {name:"password_confirmation", label:gLocales("Confirm Password"),input:{type:"password",placeholder:gLocales("Confirm Password"),args:{}}},
                    ]}),),
                    {n:"button",a:{type:"button",class:"btn btn-primary w-100", id:this.DOM.getId("register")},t:gLocales("Register")},
                ]},
            ]},
        ];
        let json=[{n:"div",a:{class:"container py-5"},c:content}];
        return json;
    }
    createEvents(){
        this.nRegister=this.DOM.getNodeById("register");
        this.nRegister.addEventListener("click",async (e)=>{
            e.target.setAttribute("disabled","");
            let data=this.child.form.getValue();
            if(!data) return;
            await gFetch.login("/register",data,async (json)=>{
                if(json.error){
                    this.child.form.setValidation(false,json.errors);
                    return;
                }
                await gFetch.login("/login",data,async (json)=>{
                    if(json.error){return;}
                    this.env.c.template.setSession();
                    this.env.goToView("/");
                });
            });
            e.target.removeAttribute("disabled");
        });
    }
    constructor(){
        super();
        this.page={
            name:gLocales("Register"),
        };
    }
}
export {MainPage};