
// create tag
let AceCard = WebTag.Invent('ace-tag',{
    methods:{
        constructor(name){
            call_super();
            this.shadow = this.attachShadow({mode:"open"});
            console.log('from ace',name);
        }
    },
    attributes:['name']
});

// declare
let a = new AceCard('bob');

// set events
a.on('attribute-changed',function(ev){
    let  p = document.createElement('p');
    p.innerHTML = "hello " + ev.data.newValue;
    a.shadow.appendChild(p);
})

a.on('connected',function(){
    // added to dom
    a.setAttribute('name','roger');
});

// add to body
document.body.appendChild(a);