import { Partial } from "/src/partials/common.js";
import { gFetch } from "/src/modules/fetch.js";
import { gLocales } from "/src/modules/locales.js";
import { Button, Form, InputGroup } from "/src/partials/stdbs/inputs.js";
class MainPage extends Partial{
    createNodes(){
        let content=[
            {n:"div",a:{class:"card w-75 m-auto"},c:[
                {n:"div",a:{class:"card-body d-flex flex-column gap-3"},c:[
                    {n:"h1",a:{class:"h3 mb-3 text-center"},t:"Inicio de sesion"},
                    this.PRT.appendChild("form",new Form({
                        validation:true,
                        rows: [
                            {name:"username", label:gLocales("User"),args:{placeholder:gLocales("User"),}},
                            {name:"password", label:gLocales("Password"),args:{placeholder:gLocales("Password"),type:"password"}},
                            {name:"remember_me", label:"", type:"switch",args:{placeholder:gLocales("Remember me"),}},
                    ]})),
                    this.PRT.appendChild("login", new Button({placeholder:gLocales("Login")})),
                ]},
            ]},
        ];
        let json=[{n:"div",a:{class:"container py-5"},c:content}];
        return json;
    }
    createEvents(){
        this.cLogin=this.getChild("login");
        this.cForm=this.getChild("form");
        this.cLogin.setClickEvent(async ()=>{
            let token = "";
            console.log(this.cForm);

            try{
                await gFetch.post("/login",this.cForm.getValue()).then(json=>{token=json.token;})
                await this.env.login(token);
                await this.env.callTemplate("updateProfile");
                await this.env.goToView("/");
            }catch(e){
                if (e instanceof Error) throw e;
                this.cForm.setValidation(e.errors,false);
            }
            /*await gFetch.post("/login",this.cForm.getValue()).then(async json=>{
                await this.env.login(json.token).then(async s=>{
                    await this.env.callTemplate("updateProfile");
                    await this.env.goToView("/");
                });
            }).catch(e=>{
                if (e instanceof Error) throw e;
                this.cForm.setValidation(e.errors,false);
            });*/
        });
    }
    constructor(){
        super();
        this.page={
            name:gLocales("Login"),
        };
    }
}
export {MainPage};