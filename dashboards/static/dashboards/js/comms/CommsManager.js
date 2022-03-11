
import { CommLink } from "./CommLink.js";
import { VISUALIZATION_TYPE } from "../components/VisualizationType.js";


const COMMS_AREA = $("#comms-container");
const ADD_LINK_BTN = $('#add-link-btn');
const REMOVE_ALL_LINKS_BTN = $('#remove-all-links-btn');

export function CommsManager (context) {
    this.context = context;
    this.data = {};
    const self = this;

    ADD_LINK_BTN.on('click', function() {
        new CommLink(context).attachTo(COMMS_AREA.get(0));
    })
    REMOVE_ALL_LINKS_BTN.on('click', function() {
        COMMS_AREA.empty();
    })

}

CommsManager.prototype = {
    /**
     * Updates the comms accordindly with the updated component.
     * @param {MasterComponent} component Updated component.
     */
    updateComponent: function(component) {
        console.log("UPDATE COMMS > ", component);
        this.setIO(component.data);
    },


    /**
     * Resets all comms.
     */
    reset: function() {
        console.log("COMMS RESET");
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

    setIO(component_data) {
        console.log(">>>>", component_data);
        const output = [];
        const input = [];
        switch(component_data.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
            {
                console.log("restore component I/O > SIMPLE TABLE");
                output = component_data.query.query_selected_fields;
                console.log("IN > ", []);
                console.log("OUT > ", output);
                break;
            }
            case VISUALIZATION_TYPE.TC:
            {
                console.log("restore component I/O > COMPLEX TABLE");
                output = component_data.query.query_selected_fields;
                console.log("IN > ", []);
                console.log("OUT > ", output);
                break;
            }                
            case VISUALIZATION_TYPE.G1N:
            {
                console.log("restore component I/O > GRAPH 1N");
                console.log("IN > ", []);
                console.log("OUT > ", []);
                break;
            }
            case VISUALIZATION_TYPE.GDN:            
            {
                console.log("restore component I/O > GRAPH DN");
                console.log("IN > ", []);
                console.log("OUT > ", []);
                break;
            }
            case VISUALIZATION_TYPE.ISL:
            {
                console.log("restore component I/O > INFO SIMPLE LEFT");
                console.log("IN > ", []);
                console.log("OUT > ", []);
                break;
            }
            case VISUALIZATION_TYPE.TEC:
            {
                console.log("restore component I/O > TEMPLATE CALENDAR");
                console.log("IN > ", []);
                console.log("OUT > ", []);
                break;
            }                
        }
    }


}