


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
                {component: origin.find(":selected").attr('data-uuid'), pin: origin.val(), index: origin.find(":selected").attr('data-index')}, 
            to: 
                {component: destination.find(":selected").attr('data-uuid'), pin: destination.val(), index: destination.find(":selected").attr('data-index')}
        };
    }

    removeAllLinksFromComponent(uuid) {
        const _existing_option_to = $(this.destination.dom).find(`[data-uuid='${uuid}']`);
        _existing_option_to.remove();
        const _existing_option_from = $(this.origin.dom).find(`[data-uuid='${uuid}']`);
        _existing_option_from.remove();
    }

    setPinsForComponent(uuid, data) {
        data.outputs.forEach((output_pin, index) => {
            CommLink.createItem(this.origin, data.name, output_pin, uuid, index);
        });
        data.inputs.forEach((input_pin, index) => {
            CommLink.createItem(this.destination, data.name, input_pin, uuid, index);
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
                CommLink.createItem(this.origin, data[key].name, output, key, k_output);
            }
            for (const k_output in data[key].inputs) {                
                const input = data[key].inputs[k_output];
                CommLink.createItem(this.destination, data[key].name, input, key, k_output);
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
        CommLink.createItem(outputs, 'Global Calendar', 'Data Inicio',0);
        CommLink.createItem(outputs, 'Global Calendar', 'Data Fim',1);
        CommLink.createItem(outputs, 'Global Calendar', 'Ano Inicio',2);
        CommLink.createItem(outputs, 'Global Calendar', 'Mês Inicio',3);
        CommLink.createItem(outputs, 'Global Calendar', 'Dia Inicio',4);
        CommLink.createItem(outputs, 'Global Calendar', 'Ano Fim',5);
        CommLink.createItem(outputs, 'Global Calendar', 'Mês Fim',6);
        CommLink.createItem(outputs, 'Global Calendar', 'Dia Fim',7);
    }

    /**
     * 
     * @param {*} parent Parent node.
     * @param {*} component Component's name.
     * @param {*} text Pin name.
     * @param {*} uuid Component's uuid.
     */
    static createItem(parent, component, text, uuid = null, index = 0) {
        const option = new Option(text, "[" + component + "] " + text).attachTo(parent);
        option.setAttribute('data-component', component);
        option.setAttribute('data-uuid', uuid);
        option.setAttribute('data-index', index);
    }

}
