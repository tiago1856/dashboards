
import { VISUALIZATION_TYPE } from './VisualizationType.js'
import { Graph1Num } from "./graphs/Graph1Num.js"
import { GraphDoubleNum } from "./graphs/GraphDoubleNum.js"
import { SimpleTable } from "./tables/SimpleTable.js"
import { ComplexTable } from "./tables/ComplexTable.js"
import { InfoSimpleRight } from './info/InfoSimpleRight.js'
import { InfoSimpleLeft } from './info/InfoSimpleLeft.js'
import { InfoComplexPercentage } from './info/InfoComplexPercentage.js'
import { SimpleCalendar } from './template/SimpleCalendar.js'



export const COMPONENT_TYPE = {
    TABLE: {
        name: 'TABLE',
        classes: [
            {id: VISUALIZATION_TYPE.TS, class:SimpleTable},
            {id: VISUALIZATION_TYPE.TC, class:ComplexTable},
        ]
    },
    GRAPH: {
        name: 'GRAPH',
        classes: [
            {id: VISUALIZATION_TYPE.G1N, class:Graph1Num},
            {id: VISUALIZATION_TYPE.GDN, class:GraphDoubleNum},
        ]        
    },
    INFO: {
        name: 'INFO',
        classes: [
            {id: VISUALIZATION_TYPE.ISR, class:InfoSimpleRight},
            {id: VISUALIZATION_TYPE.ISL, class:InfoSimpleLeft},
            {id: VISUALIZATION_TYPE.ICP, class:InfoComplexPercentage},
        ]
    },
    GEO: {
        name: 'GEO',
    },
    TEMPLATE: {
        name: 'TEMPLATES',
        classes: [
            {id: VISUALIZATION_TYPE.TEC, class:SimpleCalendar},
        ]        
    },
    CONTROLS: {
        name: 'CONTROLS',
        classes: [
            {id: VISUALIZATION_TYPE.CN, class:null},
            {id: VISUALIZATION_TYPE.CS, class:null},
            {id: VISUALIZATION_TYPE.CB, class:null},
        ]        
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