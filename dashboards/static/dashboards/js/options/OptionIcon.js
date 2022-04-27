
import { OptionInput } from './OptionInput.js';
import { Div, Label, I } from '../builders/BuildingBlocks.js';


 export class OptionIcon extends OptionInput {
    constructor(context, component_data, input_data) {
        super(input_data);
        this.input = input_data.value;

        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        const xxx = new Div().attachTo(this);
        xxx.addClass("w-50 mx-auto");		
        const icon_preview = new Div().attachTo(xxx);
        icon_preview.addClass("icon-preview");
        const icon = new I().attachTo(icon_preview);
        const value = component_data.options[input_data.id];
        icon.addClass((typeof value === 'undefined' || value===null||value==='')?input_data.value:value);
        
        $(icon.dom).on('click', () => {
            context.signals.onIconSelectionModal.dispatch(value, (new_icon) => {
                const data = {id: this.input_data.id, value: new_icon}
                context.signals.onOptionChanged.dispatch(component_data.uuid, data);
                icon.removeClass();
                icon.addClass(new_icon);
            })
        });

       

    };
    /*
    getData() {       
        return {id: this.input_data.id, value: this.input};       
   };
   */
}