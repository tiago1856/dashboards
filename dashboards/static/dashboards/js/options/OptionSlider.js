
import { OptionInput } from './OptionInput.js';
import { Label, Input, InputNumber } from '../builders/BuildingBlocks.js';

export class OptionSlider extends OptionInput {
    constructor(context, component_data, input_data) {
        super(input_data);
        
        this.addClass('form-group');
        const label = new Label().attachTo(this);
        label.setTextContent(input_data.label);
        
        this.input_range = new Input().attachTo(this);
        this.input_range.addClass("form-control");
        this.input_range.setAttribute('type','range');
        this.input_range.setAttribute('max', input_data.max);
        this.input_range.setAttribute('min', input_data.min);
        this.input_range.setAttribute('step', input_data.step);
        this.input_range.setValue(input_data.value);
        
        this.input = new InputNumber().attachTo(this);
        this.input.addClass("form-control");
        this.input.setAttribute('max', input_data.max);
        this.input.setAttribute('min', input_data.min);
        this.input.setAttribute('step', input_data.step);
        this.input.setValue(input_data.value);

        $(this.input_range.dom).on('change', () => {
            this.input.setValue(this.input_range.getValue());
            context.signals.onOptionChanged.dispatch(component_data.uuid, this.getData());
        });         
        $(this.input.dom).on('change paste', () => {
            this.input_range.setValue(this.input.getValue());
            context.signals.onOptionChanged.dispatch(component_data.uuid, this.getData());
        });

        $(this.input_range.dom).on('input', () => {
            this.input.setValue(this.input_range.getValue());
        }); 
                
    }
    
}