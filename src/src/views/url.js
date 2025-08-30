import { Partial } from "/src/partials/common.js";
import { Producto, Catalogo} from "/src/partials/custom/producto.js";
import { gFetch } from "/src/modules/fetch.js";
import { gLocales } from "/src/modules/locales.js";
class MainPage extends Partial{
    createNodes(){
        let random = Math.floor(Math.random()*100)%4;
        let values = ["Siemens","Samsung","Sony","Micromax"];
        let carrousel=[{n:"div",a:{"id":this.DOM.getId("captions"),style:"height:24rem","class":"carousel slide","data-bs-ride":"carousel"},c:[
            {n:"div",a:{"class":"carousel-indicators"},c:[
                {n:"button",a:{"type":"button","data-bs-target":"#"+this.DOM.getId("captions"),"data-bs-slide-to":"0","aria-label":"Slide 1"}},
                {n:"button",a:{"type":"button","data-bs-target":"#"+this.DOM.getId("captions"),"data-bs-slide-to":"1","aria-label":"Slide 2",}},
                {n:"button",a:{"type":"button","data-bs-target":"#"+this.DOM.getId("captions"),"data-bs-slide-to":"2","aria-label":"Slide 3","class":"active","aria-current":"true"}}
            ]},{n:"div",a:{"class":"carousel-inner"},c:[{n:"div",a:{"class":"carousel-item"},c:[
                {n:"img",a:{"src":"/assets/img/carrousel1.jpg","class":"d-block w-100","alt":"..."}},
                {n:"div",a:{"class":"carousel-caption d-none d-md-block bg-secondary text-start p-2 rounded-2", style:"--bs-bg-opacity: .6;"},c:[
                    {n:"h3",a:{class:"mb-1"},t:"Tecnología de Vanguardia."},
                    {n:"p",a:{class:"mb-1"},t:"Descubre los últimos dispositivos electrónicos con las innovaciones más avanzadas."},
                    {n:"a",spa:true,a:{"class":"btn btn-lg btn-primary","href":"#"},t:"Ver catalogo"}
                ]}
            ]},{n:"div",a:{"class":"carousel-item"},c:[
                {n:"img",a:{"src":"/assets/img/carrousel2.jpg","class":"d-block w-100","alt":"..."}},
                {n:"div",a:{"class":"carousel-caption d-none d-md-block bg-secondary p-2 rounded-2", style:"--bs-bg-opacity: .6;"},c:[
                    {n:"h3",a:{class:"mb-1"},t:"Ofertas Exclusivas."},
                    {n:"p",a:{class:"mb-1"},t:"Aprovecha descuentos especiales en laptops, tablets y accesorios. ¡Solo por tiempo limitado! Equipa tu hogar u oficina con tecnología de calidad al mejor precio."},
                    {n:"a",spa:true,a:{"class":"btn btn-lg btn-primary","href":"/login"},t:"Iniciar sesion"}
                ]}
                ]},{n:"div",a:{"class":"carousel-item active"},c:[
                {n:"img",a:{"src":"/assets/img/carrousel3.jpg","class":"d-block w-100","alt":"..."}},
                {n:"div",a:{"class":"carousel-caption d-none d-md-block bg-secondary text-end p-2 rounded-2", style:"--bs-bg-opacity: .6;"},c:[
                    {n:"h3",a:{class:"mb-1"},t:"Experiencia Multimedia."},
                    {n:"p",a:{class:"mb-1"},t:"Sumérgete en el entretenimiento con nuestros televisores 4K, audífonos con cancelación de ruido y sistemas de sonido envolvente. La mejor experiencia audiovisual está aquí."},
                    {n:"a",spa:true,a:{"class":"btn btn-lg btn-primary","href":"#"},t:"Acerca de nosotros"}
                ]}
                ]}]},{n:"button",a:{"class":"carousel-control-prev","type":"button","data-bs-target":"#"+this.DOM.getId("captions"),"data-bs-slide":"prev"},c:[
                        {n:"span",a:{"class":"carousel-control-prev-icon","aria-hidden":"true"}},
                        {n:"span",a:{"class":"visually-hidden"},t:"Previous"}]},{n:"button",a:{"class":"carousel-control-next","type":"button","data-bs-target":"#"+this.DOM.getId("captions"),"data-bs-slide":"next"},c:[
                        {n:"span",a:{"class":"carousel-control-next-icon","aria-hidden":"true"}},
                        {n:"span",a:{"class":"visually-hidden"},t:"Next"}
                    ]}
                ]},
                this.PRT.appendChild("catalogo",new Catalogo({
                    titulo:"Catalogo", url:"/producto?limit=20"
                })),
                this.PRT.appendChild("nuevo",new Catalogo({
                    titulo:"Lo más nuevo", url:"/producto?new=1&limit=20"
                })),
                this.PRT.appendChild("categoria1",new Catalogo({
                    titulo:"Categoria: "+values[random], url:`/producto?category=${random}`
                })),
                this.PRT.appendChild("categoria2",new Catalogo({
                    titulo:"Categoria: "+values[(random+1)%4], url:`/producto?category=${random+1}`
                })),
                this.PRT.appendChild("categoria3",new Catalogo({
                    titulo:"Categoria: "+values[(random+2)%4], url:`/producto?category=${random-1}`
                })),
            ];
        let json = [{n:"div",a:{class:"container-xl mt-2"},c:carrousel
        }];
        return json;
    }
    createEvents(){
    }
    constructor(){
        super();
        this.page={
            name:gLocales("PagName"),
        };
    }
}
export {MainPage};