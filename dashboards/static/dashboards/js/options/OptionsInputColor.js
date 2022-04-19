
import { OptionsInput } from './OptionsInput.js';
import { Label, InputColor } from '../builders/BuildingBlocks.js';


export class OptionsInputColor extends OptionsInput {
    constructor(input_data) {
        super(input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input = new InputColor().attachTo(this);
        this.input.addClass("form-control");
        this.input.setValue(input_data.value);
    }
         
}