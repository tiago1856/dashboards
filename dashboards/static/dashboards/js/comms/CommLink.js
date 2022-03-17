


import { Div, AwesomeIconAndButton, Option } from '../builders/BuildingBlocks.js';
import { SimpleCard } from '../builders/SimpleCard.js';
import { FieldSelector } from './FieldSelector.js';

/**
 * 
 */
export class CommLink extends SimpleCard {

    /**
     * 
     * @param {*} context 
     * @param {*} id 
     * @param {*} onRemove 
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
        CommLink.defaultIOs(this.origin);

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
            //console.log("<< OUT >> [" + name + "]", output);
            const _existing_option = $(this.origin.dom).find(`[data-component='${name}'][value='${output}']`);
            if (add) {
                if (_existing_option.length > 0) return;
                CommLink.createItem(this.origin, name, output);
            } else {
                _existing_option.remove();
            }
            this.origin.checkStatus();           
        });

        context.signals.onXCommInput.add((name, input, add=true) => {
            //console.log("<< IN >> [" + name + "]", input);

            const _existing_option = $(this.destination.dom).find(`[data-component='${name}'][value='${input}']`);
            if (add) {
                if (_existing_option.length > 0) return;
                CommLink.createItem(this.destination, name, input);
            } else {
                _existing_option.remove();
            }

            this.destination.checkStatus();
        });

        context.signals.onComponentNameChanged.add((old_name, new_name) => {
            $(this.origin.dom).find(`[data-component='${old_name}']`).each(function() {
                $(this).attr('data-component', new_name);
                //const key = $(this).val();
                //$(this).text("[" + new_name + "] " + key);
                const old_text = $(this).text();
                $(this).text(old_text.replace(old_name, new_name)); 
            })
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
                CommLink.createItem(this.origin, key, output);
            }
        }
        this.origin.checkStatus();
    }


    /**
     * 
     * @param {*} outputs 
     * @param {*} inputs 
     */
    static defaultIOs(outputs, inputs) {
        // GLOBAL CALENDAR
        CommLink.createItem(outputs, 'Global Calendar', 'Data Inicio');
        CommLink.createItem(outputs, 'Global Calendar', 'Data Fim');
        CommLink.createItem(outputs, 'Global Calendar', 'Ano Inicio');
        CommLink.createItem(outputs, 'Global Calendar', 'Mês Inicio');
        CommLink.createItem(outputs, 'Global Calendar', 'Dia Inicio');
        CommLink.createItem(outputs, 'Global Calendar', 'Ano Fim');
        CommLink.createItem(outputs, 'Global Calendar', 'Mês Fim');
        CommLink.createItem(outputs, 'Global Calendar', 'Dia Fim');
    }

    /**
     * 
     * @param {*} parent 
     * @param {*} component 
     * @param {*} text 
     */
    static createItem(parent, component, text) {
        const option = new Option(text, "[" + component + "] " + text).attachTo(parent);
        option.setAttribute('data-component', component);        
    }

}
