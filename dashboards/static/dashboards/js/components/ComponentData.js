
/**
 * All data related with this panel is stored in this object,
 * which is used to save/restore the panel.
 */

export const ComponentData = {
    // global
    name: null,
    description: null,
    title: null,                // title [string]
    // query
    query_selection: null,
    query: null,
    // visualization
    visualization: null,        // visualization id
    visualization_tab: null,    // EditComponentModal display collapse 
    visualization_type: null,   // DISPLAY (constants.js)
}