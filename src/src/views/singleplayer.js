import { Partial } from "/src/partials/common.js";
import { Dado } from "/src/partials/custom/dado.js";
import { uTime } from "/src/modules/utils.js";
import { Table } from "/src/partials/stdbs/table.js";
import { Button } from "/src/partials/stdbs/inputs.js";
class MainPage extends Partial{
    constructor(){
        super();
        this.page={
            name:"DiceDrop",
        };
    }
    createNodes(){
        let json = [
            {n:"div", key:"container", a:{class:"overflow-y-hidden container py-4 h-100 d-flex flex-column"}, c:[
                {n:"h1", key:"title",a:{class: "text-center"}, t:"Toca el dado para tirarlo"},
                {n:"div", a:{class:"d-flex justify-content-center align-items-center h-100"},c:[
                    {n:"div", a:{class:"h-100 w-50 d-flex align-items-center justify-content-center"},c:[
                        this.PRT.appendChild("dice", new Dado({size: window.innerWidth>700?"300px":"50vw"})),
                    ]},
                    {n:"div", key:"score", a:{class:"user-select-none h-100 display-1 d-flex align-items-center justify-content-center d-none",
                        style:"transition: opacity 0.5s, width 0.5s;font-size:15rem;font-weight:600; width:0;"
                    }}
                ]},
                {n:"div", key:"results", a:{class:"d-none text-center fs-2 d-flex gap-4 flex-column",
                    style:"transition: opacity 0.5s, height 0.7s;opacity:0; height:0px;"
                },c:[
                    {n:"div", a:{class:"card p-2", style:"height:40vh;"}, c:[
                        {n:"div", a:{class:"table-responsive overflow-scroll"}, c:[
                            this.PRT.appendChild("table", new Table({head:{"r":{name:"Resultados"}}})),
                        ]}
                    ]},
                    this.PRT.appendChild("restart", new Button({placeholder:"Empezar de nuevo"})),
                ]}
            ]}
        ];
        return json;
    }
    createEvents(){
        this.nContainer=this.DOM.getNode("container");
        this.nScore=this.DOM.getNode("score");
        this.nResults=this.DOM.getNode("results");
        this.nTitle=this.DOM.getNode("title");
        this.cDice=this.getChild("dice");
        this.cTable=this.getChild("table");
        this.cButton=this.getChild("restart");
        this.results=[];
        
        this.dadoClick=async()=>{
            this.cDice.nParent.removeEventListener("click", this.dadoClick);
            await this.diceValue();
            this.results.unshift({"r":this.result});
            this.cTable.setRows(this.results);
            await this.#throwDice(this.result,-200,3,.7);
            await this.#showResults();
        };
        this.cButton.setClickEvent(async (e)=>{
            await this.#start();
        });
        this.#start();
    }
    //Obtener nuevo valor del dado
    async diceValue(){
        this.result=Math.floor(Math.random()*6)+1;
    }
    //Iniciar animacion del dado
    async #start(){
        this.nTitle.textContent="Toca el dado para tirarlo";
        this.cDice.nParent.addEventListener("click", this.dadoClick);
        this.nScore.classList.add("d-none");
        this.nScore.style.width="0px";
        this.nScore.style.opacity="0";
        this.nResults.classList.add("d-none");
        this.nResults.style.height="0px";
        this.nResults.style.opacity="0";
        this.cDice.rotate(0, [
            { transform:'rotateY(2turn) rotateX(1turn)' },
        ], {duration:1000,iterations:Infinity});
        this.cDice.move(1, [
            { transform:'translateY(1000px)' },
            { transform:'translateY(0px)' },
        ], {duration:1000,easing: 'ease-out'});
    }
    //Animacion de tirar el dado
    async #throwDice(result, distance, times, mul, time=200){
        let scale=1;const scaleMul=0.9;
        let totalTime=time*times*1.9;
        let rotResult=Dado.faceAngle(result, 45);
        this.cDice.rotate(0,[
            { transform:`rotateX(${Math.random()*4-2}turn) rotateY(${Math.random()*4-2}turn)` },
            { transform:`rotateX(${rotResult[0]}deg) rotateY(${rotResult[1]}deg) rotateZ(${rotResult[2]}deg)` },
        ], {duration:totalTime, fill: 'forwards'});
        for(let i=0; i<times; i++){
            await this.cDice.move(1, [
                { transform: `translateY(0) scale(${scale})`},
                { transform: `translateY(${distance}px) scale(${scale*scaleMul})`},
            ], {duration:time,easing: 'ease-out', fill: 'forwards'});
            scale*=scaleMul;
            await this.cDice.move(1, [
                { transform: `translateY(${distance}px) scale(${scale})`},    // primer impacto
                { transform: `translateY(0) scale(${scale*scaleMul})`},
            ], {duration:time,easing: 'ease-in', fill: 'forwards'});
            scale*=scaleMul;distance*=mul;time*=0.9;
        }
        let newResult=Dado.faceAngle(result,0);
        await uTime.sleep(500);
        await Promise.all([
            this.cDice.move(1,[
                {transform:`scale(${scale})`},
                {transform:`scale(1)`}
            ],{duration:100, fill: 'forwards'}),
            this.cDice.rotate(0,[
                {transform:`rotateX(${rotResult[0]}deg) rotateY(${rotResult[1]}deg) rotateZ(${rotResult[2]}deg)`},
                {transform:`rotateX(${newResult[0]}deg) rotateY(${newResult[1]}deg) rotateZ(${newResult[2]}deg)`}
            ],{duration:100, fill: 'forwards'}),
        ]);
    }
    //Mostrar los resultados
    async #showResults(){
        await uTime.sleep(300);
        this.nScore.classList.remove("d-none");
        void this.nScore.offsetWidth;
        this.nScore.style.width="40%";
        this.nScore.style.opacity="1";
        this.nScore.textContent=this.result;
        await uTime.sleep(500);
        this.nResults.classList.remove("d-none");
        void this.nResults.offsetWidth;
        this.nResults.style.height="100%";
        await uTime.sleep(700);
        void this.nResults.offsetWidth;
        this.nTitle.textContent="Fin del juego";
        this.nResults.style.opacity="1";
        await uTime.sleep(500);
    }

}
export {MainPage};