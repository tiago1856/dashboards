
/**
 * All data related with this panel is stored in this object,
 * which is used to save/restore the panel.
 */

export const ComponentData = {
    // global
    id: null,                           // [number] [read only] -- component id in the database --- first save this value is null
    uuid: null,                         // unique identifier
    name: null,                         // [string]
    description: null,                  // [string]
    title: null,                        // title [string]
    component_type: null,               // COMPONENT_TYPE.name (ComponentType.js) [string]
    // query
    query: {
        query_selection: null,
        query: null,
        query_selected_fields: null,    // query's selected fields [array of strings]
        query_fields: null,             // all query's resulting fields [array of strings]
    },
    // visualization
    visualization: {
        visualization_type: null,       // VISUALIZATION_TYPE (VisualizationType.js) [string]
        visualization_tab: null,        // EditComponentModal display collapse [string] 
    },
    // data
    data_config: {                      // visualization configuration panel [object]
    },
    options: null,                        // options - colors, fonts, ...
    
}


/*

data_config:

TS: {fields:[]} --- fields: selected fields
TC: {fields:[]} --- fields: selected fields
G1N: {fields:[x-axis,series],}              --- fields: selected fields in respective select | no fields => null, null, null
GDN: {fields:[x-axis,series1, series2],}    --- fields: selected fields in respective select | no fields => null, null, null
ISL: {fields:[], icon:"", text_1:"", text_2:"", value:null} --- fields: selected fields

*/