
import { OptionInput } from './OptionInput.js';
import { Label, InputColor } from '../builders/BuildingBlocks.js';
import { RGBAtoHEX } from '../utils/jscolor.js';

export class OptionInputColor extends OptionInput {
    constructor(context, component_data, input_data) {
        super(input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input = new InputColor().attachTo(this);
        this.input.addClass("form-control");
        const value = component_data.options[input_data.id];
        //console.warn(component_data.options, input_data.id, value, RGBAtoHEX(value));
        $(this.input.dom).val(value===''?input_data.value:(value.indexOf('#')==-1?RGBAtoHEX(value):value));

        $(this.input.dom).on('change paste', () => {
            context.signals.onOptionChanged.dispatch(component_data.uuid, this.getData());
        });
    }
         
}