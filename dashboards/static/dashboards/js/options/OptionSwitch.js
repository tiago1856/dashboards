
import { OptionInput } from './OptionInput.js';
import { Label, Input, Div } from '../builders/BuildingBlocks.js';

export class OptionSwitch extends OptionInput {
    constructor(context, component_data, input_data) {
        super(input_data);
        
       
        const cont = new Div().attachTo(this);
        cont.addClass('mb-2');
        cont.dom.style.width = '100%';
    
        new Label(input_data.label).attachTo(cont);

        const group = new Div().attachTo(cont);
        group.addClass('mx-auto');
            
        this.input = new Input().attachTo(group);
        this.input.addClass('text-center');
        this.input.setAttribute('type', 'checkbox');

        const value = component_data.options[input_data.id];
        if (((value==='' || typeof value === 'undefined')?input_data.value:value) === input_data.on) {
            this.input.setAttribute('checked', true);
        }
        this.input.setAttribute('data-toggle', 'toggle');
        this.input.setAttribute('data-on', "<i class='fas fa-thumbs-up'></i> " + input_data.on);
        this.input.setAttribute('data-off', "<i class='fas fa-thumbs-down'></i> " + input_data.off);
        this.input.setAttribute('data-onstyle', 'success');
        this.input.setAttribute('data-offstyle', 'danger');
        this.input.setAttribute('data-width', '100%');
        $(this.input.dom).bootstrapToggle({
          on: input_data.on,
          off: input_data.off
        });
    

        $(this.input.dom).on('change', () => {
            console.log(this.getData());
            context.signals.onOptionChanged.dispatch(component_data.uuid, this.getData());
        });
        

    }

    getData() {
        if (this.input) {
            const value = $(this.input.dom).prop('checked')?this.input_data.on:this.input_data.off;
            return {id: this.input_data.id, value: value};
        } else {
           return {id: this.input_data.id, value: null};
        }
   };    
    
}