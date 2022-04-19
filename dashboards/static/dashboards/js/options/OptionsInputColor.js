
import { OptionsInput } from './OptionsInput.js';
import { Label, InputColor } from '../builders/BuildingBlocks.js';


export class OptionsInputColor extends OptionsInput {
    constructor(context, uuid, input_data) {
        super(uuid, input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input = new InputColor().attachTo(this);
        this.input.addClass("form-control");
        this.input.setValue(input_data.value);

        $(this.input.dom).on('change paste', () => {
            context.signals.onOptionChanged.dispatch(uuid, this.getData());
        });
    }
         
}