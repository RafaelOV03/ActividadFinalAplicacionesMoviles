import { Partial } from "/src/partials/common.js";
import { gFetch } from "/src/modules/fetch.js";
import { gLocales } from "/src/modules/locales.js";
import { Button, Form, InputGroup } from "/src/partials/stdbs/inputs.js";
class MainPage extends Partial{
    createNodes(){
        let content=[
            {n:"div",a:{class:"card w-75 m-auto"},c:[
                {n:"div",a:{class:"card-body d-flex flex-column gap-3"},c:[
                    {n:"h1",a:{class:"h3 mb-3 text-center"},t:"Codigo de acceso"},
                    this.PRT.appendChild("form",new Form({
                        validation:true,
                        rows: [
                            {name:"code", label:"",args:{placeholder:"Codigo",}},
                    ]})),
                    this.PRT.appendChild("join", new Button({placeholder:"Unirse"})),
                ]},
            ]},
        ];
        let json=[{n:"div",a:{class:"container py-5"},c:content}];
        return json;
    }
    createEvents(){
        this.cjoin=this.getChild("join");
        this.cForm=this.getChild("form");
        this.cjoin.setClickEvent(async ()=>{
            let token = "";
            try{
                await gFetch.post("/join",this.cForm.getValue()).then(json=>{token=json.token;})
                await this.env.join(token);
                await this.env.callTemplate("updateProfile");
                await this.env.goToView("/");
            }catch(e){
                if (e instanceof Error) throw e;
                this.cForm.setValidation(e.errors,false);
            }
        });
    }
    constructor(){
        super();
        this.page={
            name:gLocales("join"),
        };
    }
}
export {MainPage};