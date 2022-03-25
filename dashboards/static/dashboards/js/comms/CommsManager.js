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

    /**
     * If a query changed => recreate the component and disconnect all current connections.
     * @param {*} component_uuid 
     * @param {*} update 
     */
    setIO(component_uuid, update=false) {
        const component = this.dashboard.getComponent(component_uuid);
        const component_data = component.data;
        console.warn("#######>", component);
        const [outputs, inputs] = component.content.getComponentIO();

        
        // already exists
        if (this.ios.hasOwnProperty(component_data.uuid)) {
            for (const key in this.links) {
                this.links[key].removeAllLinksFromComponent(component_data.uuid);
            }
        }

        this.ios[component_data.uuid] = {inputs: inputs, outputs: outputs, name: component_data.name};

        for (const key in this.links) {
            this.links[key].setPinsForComponent(component_data.uuid, this.ios[component_data.uuid]);
        }

    },

}


