
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
export const ID_HEADER_VERTICAL_ALIGNMENT = "header-vertical-alignment";
export const ID_ROWS_BACK_COLOR = "rows-background-color";
export const ID_ROWS_COLOR = "rows-color";
export const ID_ROWS_ALIGNMENT = "rows-alignment";
export const ID_ROWS_VERTICAL_ALIGNMENT = "rows-vertical-alignment";
export const ID_OPERATION_PRINT = "operation-print";
export const ID_OPERATION_PDF = "operation-pdf";
export const ID_OPERATION_CSV = "operation-csv";
export const ID_OPERATION_COLUMNS_VIS  = "operation-columns-visibility";
export const ID_OPERATION_EXCEL  = "operation-columns-excel";
export const ID_OPERATION_COPY  = "operation-columns-copy";
export const ID_ICON = "icon";
export const ID_ICON_BACK_COLOR = "icon-background-color";
export const ID_ICON_COLOR = "icon-color"; 
export const ID_ICON_SIZE = "icon-size";
export const ID_TEXT_SIZE = "text-size";
export const ID_VALUE_SIZE = "value-size";
export const ID_CARD_BACK_COLOR = "card-back-color";
export const ID_TEXT_COLOR = "text-color";
export const ID_VALUE_COLOR = "value-color";

export const YES = 'Sim';
export const NO = 'Não';

/**
 * the default values for the common options for tables are not used ... for now --- TODO
 * the default values will be whatever the browser considers.
 */

export const COMPONENT_TYPE = {
    TABLE: {
        name: 'TABLE',
        properties: [
            {
                id: VISUALIZATION_TYPE.TS, 
                class: SimpleTable,
                options: [
                    {
                        section_name: "Quadro",
                        inputs: [
                            {id: ID_SIZES_HEIGHT_COMPONENT, label: "Altura do Componente:", type: "slider", max: 1000, min: 50, value: 300, step: 5},
                        ]                    
                    },
                    {
                        section_name: "Cabeçalho",
                        inputs: [
                            {id: ID_HEADER_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#ffffff"},
                            {id: ID_HEADER_COLOR, label: "Cor:", type: "color", value: "#000000"},
                            {id: ID_HEADER_ALIGNMENT, label: "Alinhamento:", type: "select", options:{'center':'Centro', 'end': 'Direita','start': 'Esquerda'}, value: 'center'},
                            {id: ID_HEADER_VERTICAL_ALIGNMENT, label: "Alinhamento vertical:", type: "select", options:{'middle':'Centro', 'top': 'Cima','bottom': 'Baixo'}, value: 'middle'}
                        ]		
                    },
                    {
                        section_name: "Linhas",
                        inputs: [
                            {id: ID_ROWS_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#ffffff"},
                            {id: ID_ROWS_COLOR, label: "Cor:", type: "color", value: "#000000"},
                            {id: ID_ROWS_ALIGNMENT, label: "Alinhamento:", type: "select", options:{'center':'Centro', 'end': 'Direita','start': 'Esquerda'}, value: 'center'},
                            {id: ID_ROWS_VERTICAL_ALIGNMENT, label: "Alinhamento vertical:", type: "select", options:{'middle':'Centro', 'top': 'Cima','bottom': 'Baixo'}, value: 'middle'}
                        ]		
                    },
                ]
            },
            {
                id: VISUALIZATION_TYPE.TC, 
                class: ComplexTable,
                options: [
                    {
                        section_name: "Quadro",
                        inputs: [
                            {id: ID_SIZES_HEIGHT_COMPONENT, label: "Altura do Componente:", type: "slider", max: 1000, min: 50, value: 300, step: 5},
                        ]
                    },
                    {
                        section_name: "Cabeçalho",
                        inputs: [
                            {id: ID_HEADER_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#ffffff"},
                            {id: ID_HEADER_COLOR, label: "Cor:", type: "color", value: "#000000"},
                            {id: ID_HEADER_ALIGNMENT, label: "Alinhamento:", type: "select", options:{'center':'Centro', 'end': 'Direita','start': 'Esquerda'}, value: 'center'},
                            {id: ID_HEADER_VERTICAL_ALIGNMENT, label: "Alinhamento vertical:", type: "select", options:{'middle':'Centro', 'top': 'Cima','bottom': 'Baixo'}, value: 'middle'}
                        ]		
                    },
                    {
                        section_name: "Linhas",
                        inputs: [
                            {id: ID_ROWS_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#ffffff"},
                            {id: ID_ROWS_COLOR, label: "Cor:", type: "color", value: "#000000"},
                            {id: ID_ROWS_ALIGNMENT, label: "Alinhamento:", type: "select", options:{'center':'Centro', 'end': 'Direita','start': 'Esquerda'}, value: 'center'},
                            {id: ID_ROWS_VERTICAL_ALIGNMENT, label: "Alinhamento vertical:", type: "select", options:{'middle':'Centro', 'top': 'Cima','bottom': 'Baixo'}, value: 'middle'}
                        ]
                    }, 
                    {
                        section_name: "Operações",
                        inputs: [
                            {id: ID_OPERATION_PRINT, label: "Imprimir:", type: "switch", on: YES, off: NO, value: YES},
                            {id: ID_OPERATION_PDF, label: "Exportar para PDF:", type: "switch", on: YES, off: NO, value: YES},
                            {id: ID_OPERATION_CSV, label: "Exportar para CSV:", type: "switch", on: YES, off: NO, value: YES},
                            {id: ID_OPERATION_EXCEL, label: "Exportar para EXCEL:", type: "switch", on: YES, off: NO, value: YES},
                            {id: ID_OPERATION_COPY, label: "Copiar:", type: "switch", on: YES, off: NO, value: YES},
                            {id: ID_OPERATION_COLUMNS_VIS, label: "Visibilidade de colunas:", type: "switch", on: YES, off: NO, value: YES},
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
            {
                id: VISUALIZATION_TYPE.ISL,
                class:InfoSimpleLeft,
                options: [
                    {
                        section_name: "Quadro",
                        inputs: [
                            {id: ID_CARD_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#ffffff"},
                        ]
                    },                    
                    {
                        section_name: "Icon",
                        inputs: [
                            {id: ID_ICON_SIZE, label: "Dimensão:", type: "slider", max: 256, min: 56, value: 92, step: 2},
                            {id: ID_ICON_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#ff0000"},
                            {id: ID_ICON_COLOR, label: "Cor:", type: "color", value: "#ffffff"},                            
                            {id: ID_ICON, label: "Clique para selecionar o Icon:", type: "icon", value: 'ion ion-md-alert'},                            
                        ]
                    },
                    {
                        section_name: "Text",
                        inputs: [
                            {id: ID_TEXT_SIZE, label: "Dimensão descrição:", type: "slider", max: 256, min: 16, value: 20, step: 1},
                            {id: ID_TEXT_COLOR, label: "Cor da descrição:", type: "color", value: "#000000"},
                            {id: ID_VALUE_SIZE, label: "Dimensão valor:", type: "slider", max: 256, min: 16, value: 28, step: 1},
                            {id: ID_VALUE_COLOR, label: "Cor do valor:", type: "color", value: "#000000"},
                        ]
                    },                    
                ]                
            },            
            {
                id: VISUALIZATION_TYPE.ISR,
                class:InfoSimpleRight,
                options: [
                    {
                        section_name: "Quadro",
                        inputs: [
                            {id: ID_CARD_BACK_COLOR, label: "Cor de fundo:", type: "color", value: "#5bc0de"},
                        ]
                    },                    
                    {
                        section_name: "Icon",
                        inputs: [
                            {id: ID_ICON_SIZE, label: "Dimensão:", type: "slider", max: 256, min: 56, value: 96, step: 2},
                            {id: ID_ICON, label: "Clique para selecionar o Icon:", type: "icon", value: 'ion ion-md-alert'},                            
                        ]
                    },
                    {
                        section_name: "Text",
                        inputs: [
                            {id: ID_TEXT_SIZE, label: "Dimensão descrição:", type: "slider", max: 256, min: 16, value: 16, step: 1},
                            {id: ID_TEXT_COLOR, label: "Cor da descrição:", type: "color", value: "#ffffff"},
                            {id: ID_VALUE_SIZE, label: "Dimensão valor:", type: "slider", max: 256, min: 16, value: 36, step: 1},
                            {id: ID_VALUE_COLOR, label: "Cor do valor:", type: "color", value: "#ffffff"},
                        ]
                    },                    
                ]                
            },            
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
    return null;
}

export function getInputData(options, key, what = 'value') {
    for (let i=0; i<options.length; i++) {
        for (let k=0; k<options[i].inputs.length; k++) {
           if (options[i].inputs[k].id === key) return options[i].inputs[k][what];
        }
    }
    return null;
}

export function getInputDataFromType(type, id = null, key = null, what = 'value') {
    if (!type || !id || !key || !COMPONENT_TYPE[type].hasOwnProperty('properties')) return null;
    for (let k=0; k<COMPONENT_TYPE[type].properties.length; k++) {
        if (COMPONENT_TYPE[type].properties[k].id === id) {
            const options = COMPONENT_TYPE[type].properties[k].options;
            for (let i=0; i<options.length; i++) {
                for (let j=0; j<options[i].inputs.length; j++) {
                   if (options[i].inputs[j].id === key) return options[i].inputs[j][what];
                }
            }
        }
    }
    return null;
}


