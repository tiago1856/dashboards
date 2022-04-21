
import { Div, Hx, Span, AwesomeIconAndButton } from '../builders/BuildingBlocks.js';
import { OptionInputColor } from './OptionInputColor.js';
import { OptionInputText } from './OptionInputText.js';
import { OptionSelect } from './OptionSelect.js';
import { OptionSlider } from './OptionSlider.js';
import { OptionSwitch } from './OptionSwitch.js';
import { subStr } from '../utils/jsutils.js';
import { getComponentProperties } from '../Components/ComponentType.js';


 export class OptionsMenu extends Div {
    constructor(context, component, top=100, left=100, onClose = null) {
        super();
        const properties = getComponentProperties(component.data.component_type, component.data.visualization.visualization_type);
        const options_data = properties.options;

        //const values = component.data.hasOwnProperty('options') ? component.data.options: null;
        const self = this;
        this.onClose = onClose;
        this.inputs = [];
        
        this.addClass('m-1 text-white options-nf');
        this.setStyle('top', top + 'px');
        this.setStyle('left', left + 'px');
        
        const title_area = new Div().attachTo(this);
        title_area.addClass('text-center p-2 options-nf-title');
        const title = new Hx(4).attachTo(title_area);
        title.addClass("p-0 m-0");
        const title_text = new Span().attachTo(title);
        const title_str = (component.data.title && component.data.title !== '')? component.data.title : "Sem titulo!"
        title_text.setTextContent(subStr(title_str,16,16));               

        const close_btn = new AwesomeIconAndButton('','fas fa-times').attachTo(title_area);
        close_btn.addClass('btn btn-danger btn-sm options-nf-close-button');
        close_btn.setAttribute('type','button');
        close_btn.setAttribute('data-toggle','tooltip');
        close_btn.setAttribute('title','Remover component');


        const menu_area = new Div().attachTo(this);
        menu_area.addClass('options-nf-options-area');

        const accordion_area = new Div().attachTo(menu_area);
        //accordion_area.addClass('options-nf-options-area');
        /*
        accordion_area.setStyle('overflow-y','auto');
        accordion_area.setStyle('height','100%');
        */

       
        ((typeof options_data === 'undefined' || !options_data)?[]:options_data).forEach(section => {
           const new_section = OptionsMenu.createSection(section.section_name, accordion_area);
           
            section.inputs.forEach(input => {
                switch (input.type) {
                    case 'text': 
                        this.inputs.push(new OptionInputText(context, component.data, input).attachTo(new_section));
                        break;
                    case 'color': 
                        this.inputs.push(new OptionInputColor(context, component.data, input).attachTo(new_section));
                        break;
                    case 'select': 
                        this.inputs.push(new OptionSelect(context, component.data, input).attachTo(new_section));
                        break;  
                    case 'slider': 
                        this.inputs.push(new OptionSlider(context, component.data, input).attachTo(new_section));
                        break;  
                    case 'switch':
                        this.inputs.push(new OptionSwitch(context, component.data, input).attachTo(new_section));
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

    restore() {

    }
    
    getData() {
        const data = {};
        this.inputs.forEach(option => {
            const value = option.getData();
            data[value.id] = value.value;
        });
        return data;
    }
    
    static createSection(name, parent) {
        const section_title = new Hx(3).attachTo(parent);
        section_title.setTextContent(name);
        section_title.addClass('options-nf-section-title');
        const section = new Div().attachTo(parent);
        section.addClass('p-2');
        return section;
    }
    
    
}