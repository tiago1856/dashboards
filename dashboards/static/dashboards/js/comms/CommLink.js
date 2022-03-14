


import { Div, AwesomeIconAndButton, Option } from '../builders/BuildingBlocks.js';
import { SimpleCard } from '../builders/SimpleCard.js';
import { FieldSelector } from './FieldSelector.js';

export class CommLink extends SimpleCard {
  /**
   * Constructor.
   */
    constructor(context, id, onRemove=null) {
        super();        
        this.addClass('CommLink');

        const self = this;

        const row = new Div().attachTo(this.getBody());
        row.addClass('row');

        const origin_col = new Div().attachTo(row);
        origin_col.addClass('col-5');
        this.origin = new FieldSelector(context,() => {}).attachTo(origin_col);
        this.origin.addClass('comm-origin-field');

        const arrow = new Div().attachTo(row);
        arrow.addClass('col-1 text-center');
        arrow.setTextContent('--->');

        const destination_col = new Div().attachTo(row);
        destination_col.addClass('col-5');
        this.destination = new FieldSelector(context,() => {}).attachTo(destination_col);
        this.destination.addClass('comm-destination-field');

        const action = new Div().attachTo(row);
        action.addClass('col-1');
        const remove_btn = new AwesomeIconAndButton('','fa fa-times').attachTo(action);
        remove_btn.addClass('btn btn-danger btn-lg');
        remove_btn.setAttribute('type','button');

        $(remove_btn.dom).on('click', function() {
            if (onRemove) onRemove(id);
            $(self.dom).remove();
        })

        context.signals.onXCommOutput.add((name, output, add=true) => {
            console.log("<< OUT >> [" + name + "]", output);
            const _existing_option = $(this.origin.dom).find(`[data-component='${name}'][value='${output}']`);
            if (add) {
                if (_existing_option.length > 0) return;
                const option = new Option(output, "[" + name + "] " + output).attachTo(this.origin);
                option.setAttribute('data-component', name);
            } else {
                _existing_option.remove();
            }
            this.origin.checkStatus();           
        });

        context.signals.onXCommInput.add((name, input, add=true) => {
            console.log("<< IN >> [" + name + "]", input);
            destination.checkStatus();
        });
    }

    save() {

    }

    /**
     * 
     * @param {object} data {comp_name: {inputs: inputs, outputs: outputs}, ...}
     */
    setFields(data) {
        for (const key in data) {
            for (const k_output in data[key].outputs) {
                const output = data[key].outputs[k_output];
                const option = new Option(output, "[" + key + "] " + output).attachTo(this.origin);
                option.setAttribute('data-component', key);
            }
        }
        this.origin.checkStatus();
    }

}
