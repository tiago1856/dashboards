
/**
 * All data related with this panel is stored in this object,
 * which is used to save/restore the panel.
 */

export const ComponentData = {
    // global
    name: null,                 // [string]
    description: null,          // [string]
    title: null,                // title [string]
    component_type: null,       // COMPONENT_TYPE (ComponentType.js) [string]
    // query
    query: {
        query_selection: null,
        query: null,
        query_selected_fields: null,    // query's selected fields [array of strings]
    },
    // visualization
    visualization: {
        visualization_type: null,     // VISUALIZATION_TYPE (VisualizationType.js) [string]
        visualization_tab: null,    // EditComponentModal display collapse [string] 
    },
    data_config: {},                // visualization configuration panel [object]
    
}