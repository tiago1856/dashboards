
import { Div, Hx, Span, AwesomeIconAndButton } from '../builders/BuildingBlocks.js';
import { OptionsInputColor } from './OptionsInputColor.js';
import { OptionsInputText } from './OptionsInputText.js';
import { subStr } from '../utils/jsutils.js';
import { getComponentProperties } from '../Components/ComponentType.js';


 export class OptionsMenu extends Div {
    constructor(context, component = null, top=100, left=100, onClose = null) {
        super();
        const properties = getComponentProperties(component.data.component_type, component.data.visualization.visualization_type);
        const options_data = properties.options;
        const values = component ? (component.data.hasOwnProperty('options') ? component.data.options: null) : null;
        const self = this;
        this.onClose = onClose;
        this.options = [];
        
        this.addClass('m-1 text-white options-nf');
        this.setStyle('top', top + 'px');
        this.setStyle('left', left + 'px');
        
        const title_area = new Div().attachTo(this);
        title_area.addClass('text-center p-2 options-nf-title');
        const title = new Hx(4).attachTo(title_area);
        title.addClass("p-0 m-0");
        const title_text = new Span().attachTo(title);
        title_text.setTextContent(subStr(component.data.title,16,16));               

        const close_btn = new AwesomeIconAndButton('','fas fa-times').attachTo(title_area);
        close_btn.addClass('btn btn-danger btn-sm options-nf-close-button');
        close_btn.setAttribute('type','button');
        close_btn.setAttribute('data-toggle','tooltip');
        close_btn.setAttribute('title','Remover component');


        const accordion_area = new Div().attachTo(this);

       
        ((typeof options_data === 'undefined' || !options_data)?[]:options_data).forEach(section => {
           const new_section = OptionsMenu.createSection(section.section_name, accordion_area);
           
           section.inputs.forEach(input => {
               switch (input.type) {
                   case 'text': 
                       this.options.push(new OptionsInputText(context, component.data.uuid, input).attachTo(new_section));
                       break;
                   case 'color': 
                       this.options.push(new OptionsInputColor(context, component.data.uuid,input).attachTo(new_section));
                       break;
                   default:                       
               }
           });
        });



        $(this.dom).draggable();
        $(accordion_area.dom).accordion({
            collapsible: true,
            heightStyle: "content",
            autoHeight: true,
            clearStyle: true, 
        });
       
        $(close_btn.dom).on('click', function() {
            self.close();
        });        
    }

    close() {
        if (this.onClose) this.onClose();
        $(this.dom).remove();
    }
    
    getData() {
        const data = {};
        this.options.forEach(option => {
            const value = option.getData();
            data[value.id] = value.value;
        });
        return data;
    }
    
    static createSection(name, parent) {
        const section_title = new Hx(3).attachTo(parent);
        section_title.setTextContent(name);
        const section = new Div().attachTo(parent);
        section.addClass('p-2');
        return section;
    }
    
    
}