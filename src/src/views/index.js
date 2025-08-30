import { Partial } from "/src/partials/common.js";
import { Dado } from "/src/partials/custom/dado.js";
class MainPage extends Partial{
    createNodes(){
        let json = [
            {n:"div", a:{class:"container py-4 h-100 d-flex flex-column justify-content-between"}, c:[
                {n:"img",a:{class:"mx-auto", src:"/assets/img/title.png", height:"80", width:"auto"}},
                
                {n:"div", a:{class:"d-flex justify-content-evenly py-5 w-100"},c:[
                    {n:"div", a:{class:"pb-3"},c:[
                        this.PRT.appendChild("dado1", new Dado({size: window.innerWidth>500?"200px":"30vw"})),
                    ]},
                    {n:"div", a:{class:"pt-3"},c:[
                        this.PRT.appendChild("dado2", new Dado({size: window.innerWidth>500?"240px":"35vw"})),
                    ]},
                ]},
                {n:"div", a:{id:this.DOM.getId("menu"), class:"text-center d-flex flex-column h-25 gap-2"}, c:[
                    {n:"button", a:{class:"btn btn-success h-100 fs-2"}, t:"Un Jugador"},
                    {n:"div", a:{class:"text-center d-flex h-100 gap-2"}, c:[
                        {n:"button", a:{class:"btn btn-success w-50 fs-2"}, t:"Crear sala"},
                        {n:"button", a:{class:"btn btn-success w-50 fs-2"}, t:"Unirse"},
                    ]}
                ]},
            ]}

        ];
        return json;
    }
    #urls=["/singleplayer", "/create", "/join"];
    createEvents(){
        this.nMenu=this.DOM.getNodeById("menu");
        this.nButtons=this.nMenu.querySelectorAll("button");
        this.nButtons.forEach((button, index)=>{
            button.addEventListener("click", async ()=>{
                this.env.goToView(this.#urls[index]);
            });
        });
        this.getChild("dado1").rotate(0, [
            { transform:'rotateY(2turn) rotateX(1turn)' },
        ], {duration:5000,iterations:Infinity});
        this.getChild("dado2").rotate(0, [
            { transform:'rotateY(-1turn) rotateX(-2turn)' }
        ], {duration:6000,iterations:Infinity});
    }
    constructor(){
        super();
        this.page={
            name:"DiceDrop",
        };
    }
}
export {MainPage};