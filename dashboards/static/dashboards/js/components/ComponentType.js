
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
import { ControlNumberInterval } from './controls/ControlNumberInterval.js'

export const ID_SIZES_HEIGHT_COMPONENT = "sizes-height-component";
export const ID_HEADER_BACK_COLOR = "header-background-color";
export const ID_HEADER_COLOR = "header-color";
export const ID_HEADER_ALIGNMENT = "header-alignment";
export const ID_ROWS_BACK_COLOR = "rows-background-color";
export const ID_ROWS_COLOR = "rows-color";
export const ID_ROWS_ALIGNMENT = "rows-alignment";
export const ID_OPERATION_PRINT = "operation-print";
export const ID_OPERATION_PDF = "operation-pdf";
export const ID_OPERATION_CSV = "operation-csv";
export const ID_OPERATION_SEARCH = "operation-search";
export const ID_OPERATION_COLUMNS_VIS  = "operation-columns-visibility";


export const COMPONENT_TYPE = {
    TABLE: {
        name: 'TABLE',
        properties: [
            {
                id: VISUALIZATION_TYPE.TS, 
                class: SimpleTable,
                options: [
                    {
                        section_name: "Dimensões",
                        inputs: [
                            {id: "sizes-height-component", label: "Altura do Componente:", type: "slider", max: 1000, min: 50, value: 300, step: 5},
                        ]                    
                    },
                    {
                        section_name: "Cabeçalho",
                        inputs: [
                            {id: "header-colors-background-color", label: "Cor de fundo:", type: "color", value: "#ff0000"},
                            {id: "header-colors-color", label: "Cor:", type: "color", value: "#000000"},
                            {id: "header-alignment", label: "Alinhamento:", type: "select", options:{'center':'Centro', 'right': 'Direita','left': 'Esquerda'}, value: 'center'}
                        ]		
                    },
                    {
                        section_name: "Linhas",
                        inputs: [
                            {id: "rows-colors-background-color", label: "Cor de fundo:", type: "color", value: "#ff0000"},
                            {id: "rows-colors-color", label: "Cor:", type: "color", value: "#000000"},
                            {id: "rows-alignment", label: "Alinhamento:", type: "select", options:{'center':'Centro', 'right': 'Direita','left': 'Esquerda'}, value: 'center'}
                        ]		
                    },                    
                ]
            },
            {
                id: VISUALIZATION_TYPE.TC, 
                class: ComplexTable,
                options: [
                    {
                        section_name: "Dimensões",
                        inputs: [
                            {id: "sizes-height-component", label: "Altura do Componente:", type: "slider", max: 1000, min: 50, value: 300, step: 5},
                        ]                    
                    },
                    {
                        section_name: "Cabeçalho",
                        inputs: [
                            {id: "header-colors-background-color", label: "Cor de fundo:", type: "color", value: "#ff0000"},
                            {id: "header-colors-color", label: "Cor:", type: "color", value: "#000000"},
                            {id: "header-alignment", label: "Alinhamento:", type: "select", options:{'center':'Centro', 'right': 'Direita','left': 'Esquerda'}, value: 'center'}
                        ]		
                    },
                    {
                        section_name: "Linhas",
                        inputs: [
                            {id: "rows-colors-background-color", label: "Cor de fundo:", type: "color", value: "#ff0000"},
                            {id: "rows-colors-color", label: "Cor:", type: "color", value: "#000000"},
                            {id: "rows-alignment", label: "Alinhamento:", type: "select", options:{'center':'Centro', 'right': 'Direita','left': 'Esquerda'}, value: 'center'}
                        ]		
                    }, 
                    {
                        section_name: "Operações",
                        inputs: [
                            {id: "operation-print", label: "Imprimir:", type: "switch", on: "T", off: "F", value: "F"},
                            {id: "operation-pdf", label: "Exportar para PDF:", type: "switch", on: "T", off: "F", value: "F"},
                            {id: "operation-csv", label: "Exportar para CSV:", type: "switch", on: "T", off: "F", value: "F"},
                            {id: "operation-search", label: "Procurar:", type: "switch", on: "T", off: "F", value: "F"},
                            {id: "operation-columns", label: "Visibilidade de colunas:", type: "switch", on: "T", off: "F", value: "F"},
                        ]		
                    },                    
                ]               
            },
        ]
    },
    GRAPH: {
        name: 'GRAPH',
        properties: [
            {id: VISUALIZATION_TYPE.G1N, class:Graph1Num},
            {id: VISUALIZATION_TYPE.GDN, class:GraphDoubleNum},
        ]        
    },
    INFO: {
        name: 'INFO',
        properties: [
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
        properties: [
            {id: VISUALIZATION_TYPE.TEC, class:SimpleCalendar},
        ]        
    },
    CONTROL: {
        name: 'CONTROL',
        properties: [
            {id: VISUALIZATION_TYPE.CN, class:ControlNumber},
            {id: VISUALIZATION_TYPE.CS, class:ControlString},
            {id: VISUALIZATION_TYPE.CB, class:ControlBool},
            {id: VISUALIZATION_TYPE.CNI, class:ControlNumberInterval},
        ]        
    },    
}


export function getComponentProperties(type, id) {
    if (!type || !id || !COMPONENT_TYPE[type].hasOwnProperty('properties')) return null;
    for (let k=0; k<COMPONENT_TYPE[type].properties.length; k++) {
        if (COMPONENT_TYPE[type].properties[k].id === id) {
            return COMPONENT_TYPE[type].properties[k];
        }
    }     
}
