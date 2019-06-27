class WebTagEvent {
    constructor(eventName, data) {
        this._event = new Event(eventName, {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        this._event['data'] = data;
    }
    dispatch(targetElement) {
        targetElement.dispatchEvent(this._event);
    }
}
class WebTag extends HTMLElement {
    static Make(tagName, classItem, options) {
        customElements.define(tagName, classItem);
        return classItem;
    }
    static Invent(tagName, options) {
        let methods = [];
        for (var key in options.methods) {
            methods.push(`
            ${options.methods[key].toString().replace('function', key).replace('call_super()', 'super(arguments)')}`);
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
    connectedCallback() {
        if (this['isConnected']) {
            (new WebTagEvent('connected')).dispatch(this);
        }
    }
    disconnectedCallback() {
        (new WebTagEvent('disconnected')).dispatch(this);
    }
    adoptedCallback() {
        (new WebTagEvent('adopted')).dispatch(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        (new WebTagEvent('attribute-changed', {
            name: name,
            oldValue: oldValue,
            newValue: newValue
        })).dispatch(this);
    }
    on(eventName, handler) {
        this.addEventListener(eventName, handler);
    }
}
console.log("WebTag Lib Ready");
