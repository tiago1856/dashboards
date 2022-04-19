
import { OptionsInput } from './OptionsInput.js';
import { Label, InputText } from '../builders/BuildingBlocks.js';

export class OptionsInputText extends OptionsInput {
    constructor(input_data) {
        super(input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input = new InputText().attachTo(this);
        this.input.addClass("form-control");
        this.input.setValue(input_data.value);
    }
    
}