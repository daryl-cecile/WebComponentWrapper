declare const call_super;

class WebTagEvent{
    private _event:Event;
    constructor(eventName:string,data?:any){
        this._event = new Event(eventName,(<any>{
            bubbles: true,
            cancelable : true,
            composed : true
        }));
        this._event['data'] = data;
    }

    dispatch(targetElement:HTMLElement){
        targetElement.dispatchEvent(this._event);
    }
}

interface WebTagOptions{
    methods?:{
        [name:string]:Function
    },
    attributes?:string[],
    useShadowDOM?:boolean
}

interface WebTagLiteOptions{
    useShadowDOM?:boolean
}

class WebTag extends HTMLElement{

    public static Make(tagName:string,classItem,options?:WebTagLiteOptions){
        customElements.define(tagName, classItem);
        return classItem;
    }

    public static Invent(tagName:string,options:WebTagOptions){

        let methods = [];

        for(var key in options.methods){
            methods.push(`
            ${options.methods[key].toString().replace('function',key).replace('call_super()','super(arguments)')}`);
        }

        let useShadow = !!options.useShadowDOM;

        let classScaffold = `
            return class extends HTMLElement{

                ${methods.join('\n')}

                static get observedAttributes() {
                    return [${options.attributes.map(k => `'` + k + `'`).join(',')}];
                }

                connectedCallback(){
                    if (this['isConnected']){
                        (new WebTagEvent('connected')).dispatch(this);
                    }
                }
            
                disconnectedCallback(){
                    (new WebTagEvent('disconnected')).dispatch(this);
                }
            
                adoptedCallback(){
                    (new WebTagEvent('adopted')).dispatch(this);
                }
            
                attributeChangedCallback(name, oldValue, newValue){
                    (new WebTagEvent('attribute-changed',{
                        name:name,
                        oldValue:oldValue,
                        newValue:newValue
                    })).dispatch(this);
                }

                on(eventName,handler){
                    this.addEventListener(eventName,handler);
                }

            }
        `;

        let classGenerator = new Function(classScaffold);

        let classItem = (classGenerator)();

        customElements.define(tagName, classItem);

        return classItem;

    }

    private shadow;

    connectedCallback(){
        if (this['isConnected']){
            (new WebTagEvent('connected')).dispatch(this);
        }
    }

    disconnectedCallback(){
        (new WebTagEvent('disconnected')).dispatch(this);
    }

    adoptedCallback(){
        (new WebTagEvent('adopted')).dispatch(this);
    }

    attributeChangedCallback(name, oldValue, newValue){
        (new WebTagEvent('attribute-changed',{
            name:name,
            oldValue:oldValue,
            newValue:newValue
        })).dispatch(this);
    }

    on(eventName,handler){
        this.addEventListener(eventName,handler);
    }

}

console.log("WebTag Lib Ready");