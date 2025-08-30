import { Partial } from "/src/partials/common.js";
import { gFetch } from "/src/modules/fetch.js";
import { uNode } from "/src/modules/utils.js";
import { gLocales } from "/src/modules/locales.js";
import { Jugador } from "/src/partials/custom/jugador.js";
class MainPage extends Partial{
    createNodes(){
        let json=[
            {n:"div",a:{"class":"row h-100"},c:[
                {n:"div",a:{"class":"col-7 h-100"},c:[
                    {n:"div",a:{"class":"d-flex flex-column gap-3 h-100"},c:[
                        {n:"div",a:{"class":"card h-100"},c:[
                            {n:"div",a:{"class":"card-body d-flex flex-column gap-3"}},
                        ]},
                        {n:"div",a:{"class":"card h-100"},c:[
                            {n:"div",a:{"class":"card-body d-flex flex-column gap-3"}},
                        ]}
                    ]},
                ]},
                {n:"div",a:{"class":"col-5 ps-0"},c:[
                    {n:"div",a:{"id":"carrito-cart","class":"card h-100"},c:[
                        {n:"div",a:{"class":"card-body d-flex flex-column gap-3"},c:[
                            {n:"h1",a:{"class":"h3 mb-2 text-center"},t:"Jugadores"},{n:"div", a:{class:"d-flex flex-column fs-5 gap-3"},c:[
                                this.PRT.appendChild("jugadores", new Jugador([
                                    {username:"Jugador 1"},
                                    {username:"Jugador 2"}]
                                ))
                            ]}
                        ]}
                    ]}
                ]}
            ]},
        ];
        json=[{n:"div",a:{class:"p-3 h-100"},c:json}];
        return json;
    }
    createEvents(){

    }
    constructor(){
        super();
        this.page={
            name:gLocales("Producto"),
        };
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get('id');
        if(!id)id=1;
        this.id=parseInt(id);
    }
}
export {MainPage};