


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
        /*
        context.signals.onXCommOutput.add((name, uuid, output, add=true) => {
            //console.log("<< OUT >> [" + name + "]", output);
            const _existing_option = $(this.origin.dom).find(`[data-uuid='${uuid}'][value='${output}']`);
            if (add) {
                if (_existing_option.length > 0) return;
                CommLink.createItem(this.origin, name, output, uuid);
            } else {
                _existing_option.remove();
            }
            this.origin.checkStatus();
        });

        context.signals.onXCommInput.add((name, uuid, input, add=true) => {
            //console.log("<< IN >> [" + name + "]", input);

            const _existing_option = $(this.destination.dom).find(`[data-uuid='${uuid}'][value='${input}']`);
            if (add) {
                if (_existing_option.length > 0) return;
                CommLink.createItem(this.destination, name, input, uuid);
            } else {
                _existing_option.remove();
            }

            this.destination.checkStatus();
        });
        */

        context.signals.onComponentNameChanged.add((uuid, old_name, new_name) => {
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
        return getCommData();
    }
    
    //input: Object { component: undefined, pin: null }    
    getCommData() {
        const origin = $(this.origin.dom);
        const destination = $(this.destination.dom);
        //console.log();
        return {
            from: 
                {component: origin.find(":selected").attr('data-uuid'), pin: origin.val()}, 
            to: 
                {component: destination.find(":selected").attr('data-uuid'), pin: destination.val()}
        };
    }

    removeAllLinksFromComponent(uuid) {
        const _existing_option_to = $(this.destination.dom).find(`[data-uuid='${uuid}']`);
        _existing_option_to.remove();
        const _existing_option_from = $(this.origin.dom).find(`[data-uuid='${uuid}']`);
        _existing_option_from.remove();
    }

    setPinsForComponent(uuid, data) {
        data.outputs.forEach(output_pin => {
            CommLink.createItem(this.origin, data.name, output_pin, uuid);
        });
        data.inputs.forEach(input_pin => {
            CommLink.createItem(this.destination, data.name, input_pin, uuid);
        });

        this.destination.checkStatus();
        this.origin.checkStatus();
    }

    /**
     * 
     * @param {object} data {uuid: {inputs: inputs, outputs: outputs, name: name}, ...}
     */
    setFields(data) {
        for (const key in data) {
            for (const k_output in data[key].outputs) {                
                const output = data[key].outputs[k_output];
                CommLink.createItem(this.origin, data[key].name, output, key);
            }
            for (const k_output in data[key].inputs) {                
                const input = data[key].inputs[k_output];
                CommLink.createItem(this.destination, data[key].name, input, key);
            }            
        }
        this.origin.checkStatus();
        this.destination.checkStatus();
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
     * @param {*} parent Parent node.
     * @param {*} component Component's name.
     * @param {*} text Pin name.
     * @param {*} uuid Component's uuid.
     */
    static createItem(parent, component, text, uuid = null) {
        const option = new Option(text, "[" + component + "] " + text).attachTo(parent);
        option.setAttribute('data-component', component);
        option.setAttribute('data-uuid', uuid);
    }

}
