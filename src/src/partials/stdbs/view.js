import { Partial, Env } from "/src/partials/common.js";
import { SpinnerLoading } from "/src/partials/stdbs/loading.js";
import { gUrl } from "/src/modules/urlinfo.js";
import { FetchEnv, gFetch } from "/src/modules/fetch.js";
class EnvBS extends Env{
    #_isBody=false;
    #logged=false;
    #session;
    createNodes(){
        let json = [{n:"div",a:{
            class:`${this.#_isBody?"v":""}h-100`},
            c:[this.PRT.appendChild("template",new Partial())]
        }];
        return json;
    }
    createEvents(){
        this.setLoading(()=>{
            return new SpinnerLoading();
        });
    }
    getSession(){
        if(this.#logged){
            return this.#session;
        }return null;
    }
    async login(token){
        if(!this.#logged){
            this.ApiRest.appendHeaders({"Authorization":`Bearer ${token}`});
            await this.ApiRest.get("/user").then(
                json=>{
                    this.#session=json;
                    this.#logged=true;
                    localStorage.setItem("session-token",token);
                }
            ).catch((e)=>{
                this.#logged=false;
                throw e;
            });
        }return new Promise(resolve=>{resolve(this.#session);});
    }
    async logout(){
        await this.ApiRest.get("/logout").then(json=>{
            this.#session=null;
            this.#logged=false;
            localStorage.removeItem("session-token");
        }).catch((e)=>{throw e;});
        return new Promise(resolve=>{resolve(this.#session);});
    }
    constructor(root){
        super(root);
        this.#_isBody=(root==document.body);//Intentar verificar si el entorno ocupa toda la pagina
        this.ApiRest=gFetch;
    }
}
export {EnvBS};