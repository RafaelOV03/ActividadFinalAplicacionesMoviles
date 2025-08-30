import { uNode, uObject } from "/src/modules/utils.js";

import { Partial } from "../common.js"
import { gFetch } from "/src/modules/fetch.js";
import { gThemes } from "/src/modules/themes.js";

await gThemes.importCssFile("/assets/css/dado.css");

class Dado extends Partial{
  #_animations={};
  createNodes(){
    let json = [
      {n:"div",a:{class:"cube-body"},c:[
        {n:"div",a:{class:"cube",id:this.DOM.getId("cube")},c:
          Array(6).fill({n:"div",a:{class:"cube-face"}})
        }
      ]},
    ];
    return json;
  }
  createEvents(){
    this.nCube=this.DOM.getNodeById("cube");
    this.nParent=this.nCube.parentNode;
    this.setSize(this.data.size);
  }
  setSize(size){
    this.nParent.style.setProperty("width", size);
    this.nParent.style.setProperty("height", size);
    size=this.nParent.clientWidth;
    this.nCube.style.fontSize=(size/5)+"px";
    this.nParent.style.perspective=(size*2)+"px";
  }
  async move(ID, anim,config={}){
    this.stopAnimation(ID);
    this.#_animations[ID] = this.nParent.animate(anim,config);
    if(config.duration!==Infinity){
      await new Promise(r => setTimeout(r, config.duration));
    }
  }
  async rotate(ID, anim,config={}){
    this.stopAnimation(ID);
    this.#_animations[ID] = this.nCube.animate(anim,config);
    if(config.duration!==Infinity){
      await new Promise(r => setTimeout(r, config.duration));
    }
  }
  stopAnimation(ID){
    if(this.#_animations.hasOwnProperty(ID)){
      this.#_animations[ID].cancel();
      delete this.#_animations[ID];
    }
  }
  finishAnimation(ID){
    if(this.#_animations.hasOwnProperty(ID)){
      this.#_animations[ID].finish();
      delete this.#_animations[ID];
    }
  }
  static defaultData={size: "200px"};
  static faceAngle(face, inclination=0){
    const angle=[[0,0,0],[0,-90,0],[90,0,0],[270,0,0],[0,90,0],[180,0,0]];
    let result=angle[face-1];
    switch(face){
      case 2:result[2]-=inclination;break;
      case 5:result[2]+=inclination;break;
      default:result[0]+=inclination;
    }return result;
  }
  constructor(data={}){
    super();
    this.data=uObject.assign(data,Dado.defaultData);
  }
}

export {Dado};