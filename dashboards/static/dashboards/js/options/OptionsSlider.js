
import { OptionsInput } from './OptionsInput.js';
import { Label, Input, InputNumber } from '../builders/BuildingBlocks.js';

export class OptionsSlider extends OptionsInput {
    constructor(context, uuid, input_data) {
        super(uuid, input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input_range = new Input().attachTo(this);
        this.input_range.addClass("form-control");
        this.input_range.setAttribute('type','range');
        this.input_range.setAttribute('max', input_data.max);
        this.input_range.setAttribute('min', input_data.min);
        this.input_range.setValue(input_data.value);
        
        this.input = new InputNumber().attachTo(this);
        this.input.addClass("form-control");
        this.input.setAttribute('max', input_data.max);
        this.input.setAttribute('min', input_data.min);
        this.input.setValue(input_data.value);

        $(this.input_range.dom).on('change', () => {
            this.input.setValue(this.input_range.getValue());
            context.signals.onOptionChanged.dispatch(uuid, this.getData());
        });         
        $(this.input.dom).on('change paste', () => {
            this.input_range.setValue(this.input.getValue());
            context.signals.onOptionChanged.dispatch(uuid, this.getData());
        });
                
    }
    
}