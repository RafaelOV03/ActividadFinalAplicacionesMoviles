import { Partial } from "../common.js"
class Jugador extends Partial{
    constructor(data,style){
        super();
        this.data=data;
    }
    createNodes(){
        let profiles=[];
        for(let pf of this.data){
            profiles.push({n:"div",a:{class:"w-100 d-flex align-items-center gap-3"},c:[
                {n:"img",a:{"src":pf.profile??"/assets/img/profile.jpg","width":"40","height":"40","class":"rounded-circle"}},
                {n:"span",t:pf.username},
            ]});
        }
        return profiles;
    }
    updateProfiles(data=[]){
        this.data=data;
        this.PRT.drawAll();
    }
}
export {Jugador};