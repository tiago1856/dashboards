
import { VISUALIZATION_TYPE } from './VisualizationType.js'
import { Graph1Num } from "./graphs/Graph1Num.js"
import { GraphDoubleNum } from "./graphs/GraphDoubleNum.js"
import { GraphTimeSeries } from "./graphs/GraphTimeSeries.js"

export const COMPONENT_TYPE = {
    TABLE: {
        name: 'TABLE',
    },
    GRAPH: {
        name: 'GRAPH',
        classes: [
            {id: VISUALIZATION_TYPE.G1N, class:Graph1Num},
            {id: VISUALIZATION_TYPE.GDN, class:GraphDoubleNum},
            {id: VISUALIZATION_TYPE.GTS, class:GraphTimeSeries},
        ]        
    },
    INFO: {
        name: 'INFO',
    },
    GEO: {
        name: 'GEO',
    },
    TEMPLATES: {
        name: 'TEMPLATES',
    },
}


export function getComponentClass(type, id) {
    if (!type || !id || !COMPONENT_TYPE[type].hasOwnProperty('classes')) return null;
    for (let k=0; k<COMPONENT_TYPE[type].classes.length; k++) {
        if (COMPONENT_TYPE[type].classes[k].id === id) {
            return COMPONENT_TYPE[type].classes[k];
        }
    }
     
}