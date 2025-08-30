import { Partial } from "/src/partials/common.js";
import { gThemes } from "/src/modules/themes.js";

await gThemes.importCssFile("/src/partials/debug/highlight/default.min.css");
import hljs from "./highlight/highlight.min.js";
import javascript from './highlight/languages/javascript.min.js';
hljs.registerLanguage('javascript', javascript);

await gThemes.importCssFile("/src/partials/debug/editor.css");

class PartialData{
    constructor(){
        this.name;
        this.nodeJsonList={};
        this.eventScripts={};
        this.classScripts={};
    }
}
class Editor extends Partial{
    createNodes(){
        let json=[{n:"div", a:{class:"editor-div minsize"},c:[
            {n:"div", a:{class:"editor-main-view"},c:[
                {n:"div",a:{class:"editor-preview"},c:[
                    {n:"label",t:"Vista previa:"},
                ]},
                {n:"div",a:{class:"editor-sidebar"},c:[
                    {n:"div",a:{class:"editor-div"},c:[
                        {n:"label",t:"Nodos:"},
                    ]},
                    {n:"div",a:{class:"editor-div"},c:[
                        {n:"label",t:"Scripts:"},
                        {n:"pre", a:{class:"editor-code"}, c:[
                            {n:"code", a:{class:"language-javascript"}, 
                            t:`
                            class MyPartial extends Partial{
                                constructor(){
                                    super();
                                }
                            };
                            `},
                        ]}
                    ]},
                ]}
            ]}
        ]}];
        return json;
    }
    createEvents(){
        
        console.log(hljs.highlight(javascript, `
                            class MyPartial extends Partial{
                                constructor(){
                                    super();
                                }
                            };
                            `));
    }
}
export {Editor};