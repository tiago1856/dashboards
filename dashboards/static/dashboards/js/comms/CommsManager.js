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
    this.dashboard = null;
    const self = this;

    //this.addLink();

    ADD_LINK_BTN.on('click', function() {
        self.addLink();
    })
    REMOVE_ALL_LINKS_BTN.on('click', function() {
        self.links = [];
        COMMS_AREA.empty();
    })


    context.signals.onComponentNameChanged.add((uuid, old_name, new_name) => {
        if (this.ios.hasOwnProperty(uuid)) {   
            this.ios[uuid].name = new_name;
        }
    });

    // component was updated, either the query structure or some other thing
    context.signals.onComponentUpdated.add((component_uuid, update_comms = true) => {
        if (update_comms) this.updateComponentComms(component_uuid);
    });

    context.signals.onCommTriggered.add((uuid, outpin, value) => {
        console.log(uuid, outpin, value);
        for(const key in this.links) {
            const link = this.links[key];
            const link_data = link.getCommData();
            console.warn("link data > ", link_data);

            // find
            // component = this.dashboard.getComponent(uuid);
            // new_query = change query (component.query)
            // update component
            //context.signals.onQueryUpdated.dispatch(destination_component, new_query);
        }
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
        console.log(this.ios);
    },

    removeLink: function(id) {
        delete this.links[id]
    },

    /**
     * Updates the comms accordindly with the updated component.
     * @param {string} component_uuid Component's uuid.
     */
    updateComponentComms: function(component_uuid) {        
        console.log("UPDATE COMMS > ", component_uuid);
        this.setIO(component_uuid, true);
    },


    /**
     * Resets all comms.
     */
    reset: function() {
        console.log("COMMS RESET");
        this.ios = {};
        this.links = [];
        this.dashboard = null;
        COMMS_AREA.empty();
    },

    /**
     * Creates a data structure containing all data related with the comms.
     * @returns Data to save.
     */
    save: function() {
        return this.data;
    },

    setDashoard(dash) {
        this.dashboard = dash;
    },

    /**
     * Restores the comms.
     * @param {object} data Dashboard data to restore the comms.
     */
    restore: function(data) {
        /*
        console.log("COMMS RESTORE DATA > ", data);
        for (const spot in data.data) {
            const component_data = data.data[spot];
            //this.setIO(component);        
            this.setIO(component_data.uuid);
        }
        console.log("COMMS RESTORE LINKS");
        */
    },

    setIO(component_uuid, update=false) {
        const component = this.dashboard.getComponent(component_uuid);
        const component_data = component.data;
        console.warn("#######>", component);
        const [outputs, inputs] = component.content.getComponentIO();

        let add_in = inputs;
        let add_out = outputs;
        let remove_in = [];
        let remove_out = [];
        if (update) {
            console.log("1111111111111", outputs, inputs);
            if (this.ios.hasOwnProperty(component_data.uuid)) {
                const old_in = this.ios[component_data.uuid].inputs;
                const old_out = this.ios[component_data.uuid].outputs;

                remove_out = disjoint(old_out, outputs);
                remove_in = disjoint(old_in, inputs);
                add_out = disjoint(outputs, old_out);
                add_in = disjoint(inputs, old_in);
                console.log("3333333333", remove_out, remove_in, add_out, add_in);
            }
        }

        this.ios[component_data.uuid] = {inputs: inputs, outputs: outputs, name: component_data.name};

        // communicate with all links
        add_out.forEach(output => {
            this.context.signals.onXCommOutput.dispatch(component_data.name, component_data.uuid, output, true);
        });
        remove_out.forEach(output => {
            this.context.signals.onXCommOutput.dispatch(component_data.name, component_data.uuid, output, false);
        });        
        add_in.forEach(input => {
            this.context.signals.onXCommInput.dispatch(component_data.name, component_data.uuid, input, true);
        }); 
        remove_in.forEach(input => {
            this.context.signals.onXCommInput.dispatch(component_data.name, component_data.uuid, input, false);
        });        
    },
    /*
    // temp - this data should come from teh analyzer
    extractConditionals(query) {
        const inputs = [];
        var target_regex = /\$(.*?)\$/g;
        const target = [...query.matchAll(target_regex)];
        target.forEach(t => inputs.push(t[1]))        
        return inputs;        
    },

    analizeQuery(uuid, query) {

    },

    createNewQuery(uuid) {

    },
    */
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