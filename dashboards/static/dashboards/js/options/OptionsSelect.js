
import { OptionsInput } from './OptionsInput.js';
import { Label, Select } from '../builders/BuildingBlocks.js';


export class OptionsSelect extends OptionsInput {
    constructor(context, uuid, input_data) {
        super(uuid, input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input = new Select().attachTo(this);
        this.input.addClass("form-control");
        this.input.setOptions(input_data.options);        
        this.input.setValue(input_data.value);

        $(this.input.dom).on('change', () => {
            context.signals.onOptionChanged.dispatch(uuid, this.getData());
        });
    }
         
}