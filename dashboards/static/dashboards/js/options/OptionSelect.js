
import { OptionInput } from './OptionInput.js';
import { Label, Select } from '../builders/BuildingBlocks.js';


export class OptionSelect extends OptionInput {
    constructor(context, component_data, input_data) {
        super(input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input = new Select().attachTo(this);
        this.input.addClass("form-control");
        this.input.setOptions(input_data.options);        
        const value = component_data.options[input_data.id];
        this.input.setValue(value===''?input_data.value:value);

        $(this.input.dom).on('change', () => {
            context.signals.onOptionChanged.dispatch(component_data.uuid, this.getData());
        });
    }
         
}