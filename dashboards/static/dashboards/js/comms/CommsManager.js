/**
 * TODO: IF COMOPONENT CHANGES NAME => CHANGE COMMS DATA
 */


import { CommLink } from "./CommLink.js";
import { VISUALIZATION_TYPE } from "../components/VisualizationType.js";
import { disjoint } from '../utils/jsutils.js';


const COMMS_AREA = $("#comms-container");
const ADD_LINK_BTN = $('#add-link-btn');
const REMOVE_ALL_LINKS_BTN = $('#remove-all-links-btn');

export function CommsManager (context) {
    this.context = context;
    this.links = {};
    this.ios = {};
    const self = this;

    this.addLink();
    this.addLink();
    this.addLink();

    ADD_LINK_BTN.on('click', function() {
        self.addLink();
    })
    REMOVE_ALL_LINKS_BTN.on('click', function() {
        self.links = [];
        COMMS_AREA.empty();
    })


    context.signals.onComponentNameChanged.add((old_name, new_name) => {
        if (this.ios.hasOwnProperty(old_name)) {   
            this.ios[new_name] = JSON.parse(JSON.stringify(this.ios[old_name]));
            delete this.ios[old_name];
        }
    });

    context.signals.onComponentUpdated.add(component_data => {
        this.updateComponent(component_data);
    });

}

CommsManager.prototype = {

    addLink: function() {
        const id = uuidv4();
        this.links[id] = new CommLink(this.context, id, () => {
            this.removeLink(id);
        }).attachTo(COMMS_AREA.get(0));
        // recreate the options
        this.links[id].setFields(this.ios);
    },

    removeLink: function(id) {
        delete this.links[id]
    },

    /**
     * Updates the comms accordindly with the updated component.
     * @param {object} component Updated component's data.
     */
    updateComponent: function(component_data) {
        console.log("UPDATE COMMS > ", component_data.name);
        this.setIO(component_data, true);
    },


    /**
     * Resets all comms.
     */
    reset: function() {
        console.log("COMMS RESET");
        this.ios = {};
        this.links = [];
        COMMS_AREA.empty();
    },

    /**
     * Creates a data structure containing all data related with the comms.
     * @returns Data to save.
     */
    save: function() {
        return this.data;
    },

    /**
     * Restores the comms.
     * @param {object} data Dashboard data to restore the comms.
     */
    restore: function(data) {
        console.log("COMMS RESTORE DATA > ", data);
        for (const spot in data.data) {
            const component = data.data[spot];
            this.setIO(component);        
        }
        console.log("COMMS RESTORE LINKS");
    },

    setIO(component_data, update=false) {
        console.log(">>>>", component_data);
        let outputs = [];
        let inputs = [];
        switch(component_data.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
            {
                console.log("restore component I/O > SIMPLE TABLE");
                outputs = component_data.query.query_selected_fields;
                inputs = this.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                console.log("OUT > ", outputs);
                break;
            }
            case VISUALIZATION_TYPE.TC:
            {
                console.log("restore component I/O > COMPLEX TABLE");
                outputs = component_data.query.query_selected_fields;
                inputs = this.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                console.log("OUT > ", outputs);
                break;
            }                
            case VISUALIZATION_TYPE.G1N:
            {
                console.log("restore component I/O > GRAPH 1N");
                inputs = this.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.GDN:            
            {
                console.log("restore component I/O > GRAPH DN");
                inputs = this.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.ISL:
            {
                console.log("restore component I/O > INFO SIMPLE LEFT");
                inputs = this.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.TEC:
            {
                console.log("restore component I/O > TEMPLATE CALENDAR");
                console.log("OUT > ", outputs);
                break;
            }                
        }

        let add_in = inputs;
        let add_out = outputs;
        let remove_in = [];
        let remove_out = [];
        if (update) {            
            if (this.ios.hasOwnProperty(component_data.name)) {
                const old_in = this.ios[component_data.name].inputs;
                const old_out = this.ios[component_data.name].outputs;

                remove_out = disjoint(old_out, outputs);
                remove_in = disjoint(old_in, inputs);
                add_out = disjoint(outputs, old_out);
                add_in = disjoint(inputs, old_in);
            }
        }

        this.ios[component_data.name] = {inputs: inputs, outputs: outputs};

        // communicate with all links
        add_out.forEach(output => {
            this.context.signals.onXCommOutput.dispatch(component_data.name, output, true);
        });
        remove_out.forEach(output => {
            this.context.signals.onXCommOutput.dispatch(component_data.name, output, false);
        });        
        add_in.forEach(input => {
            this.context.signals.onXCommInput.dispatch(component_data.name, input, true);
        }); 
        remove_in.forEach(input => {
            this.context.signals.onXCommInput.dispatch(component_data.name, input, false);
        });        
    },

    extractConditionals(query) {
        const inputs = [];
        var target_regex = /\$(.*?)\$/g;
        const target = [...query.matchAll(target_regex)];
        target.forEach(t => inputs.push(t[1]))        
        return inputs;        
    }
}



/*

         # $TARGET$ -> TARGET
         targets = re.findall(r"\$\w{0,50}?\$", query) 
         for i in targets:
            rep = i.replace('$','')
            query = query.replace(i, rep)

onst query = query_description.dom.value;            
            var target_regex = /\$(.*?)\$/g;
            var conditional_regex = /\#(.*?)\#/g;
            const target = [...query.matchAll(target_regex)];
            const conditionals = [...query.matchAll(conditional_regex)];
            target.forEach((item, index) => {
                const data = {query_target_field: item[0], target_field: ''};
                self.rows_target.push(new DBQueryTargetActionRow(context, self.onAddTargetRow, self.onRemoveTargetRow, data).attachTo(self.box_target));
            })
            conditionals.forEach((item, index) => {
                const data = {query_origin_field: item[0], origin_field: ''};
                self.rows_origin.push(new DBQueryOriginActionRow(context, self.onAddOriginRow, self.onRemoveOriginRow, data).attachTo(self.box_origin));
            })
            */