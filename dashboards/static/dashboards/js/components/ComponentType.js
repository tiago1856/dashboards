
import { VISUALIZATION_TYPE } from './VisualizationType.js'
import { Graph1Num } from "./graphs/Graph1Num.js"
import { GraphDoubleNum } from "./graphs/GraphDoubleNum.js"
import { SimpleTable } from "./tables/SimpleTable.js"
import { ComplexTable } from "./tables/ComplexTable.js"
import { InfoSimpleRight } from './info/InfoSimpleRight.js'
import { InfoSimpleLeft } from './info/InfoSimpleLeft.js'
import { InfoComplexPercentage } from './info/InfoComplexPercentage.js'
import { SimpleCalendar } from './template/SimpleCalendar.js'
import { ControlNumber } from './controls/ControlNumber.js'
import { ControlString } from './controls/ControlString.js'
import { ControlBool } from './controls/ControlBool.js'



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
    CONTROL: {
        name: 'CONTROL',
        classes: [
            {id: VISUALIZATION_TYPE.CN, class:ControlNumber},
            {id: VISUALIZATION_TYPE.CS, class:ControlString},
            {id: VISUALIZATION_TYPE.CB, class:ControlBool},
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