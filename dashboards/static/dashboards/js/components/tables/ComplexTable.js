
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';
import { 
    ID_SIZES_HEIGHT_COMPONENT,
    ID_HEADER_BACK_COLOR,
    ID_HEADER_COLOR,
    ID_HEADER_ALIGNMENT,
    ID_HEADER_VERTICAL_ALIGNMENT,
    ID_ROWS_BACK_COLOR,
    ID_ROWS_COLOR,
    ID_ROWS_ALIGNMENT,
    ID_ROWS_VERTICAL_ALIGNMENT,
    ID_OPERATION_PRINT,
    ID_OPERATION_PDF,
    ID_OPERATION_CSV,
    ID_OPERATION_EXCEL,
    ID_OPERATION_COPY,
    ID_OPERATION_COLUMNS_VIS,
    YES,
    NO,
} from '../ComponentType.js';
import { isPropOk } from '../../utils/jsutils.js';
import { getInputData } from '../../Components/ComponentType.js';
import { RGBAtoHEX } from '../../utils/jscolor.js';



/**
 * Table using the js Datatable plugin.
 */
export class ComplexTable extends BaseComponentContent {
   
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);

        this.dt = null;

        component.body.setStyle("height",(this.component.data.options?this.component.data.options[ID_SIZES_HEIGHT_COMPONENT]:getInputData(this.options_data,ID_SIZES_HEIGHT_COMPONENT)) + 'px');
        
        this.container = new Div().attachTo(component.body);  

        this.onOptionChanged = context.signals.onOptionChanged.add((uuid, {id, value}) => {
            if (uuid !== component.data.uuid) return;
            this.setOption(id, value);            
        });

    }

    async execute(component_content = null) {
        //const results = await this.execQuery(this.query, null);
        const results = component_content ? component_content : await this.execQuery(this.query, null);
        const component_data = this.prepareData(results, this.component.data);
        const table = new BasicTable(component_data, 20, this.component.data.data_config.fields, (row) => {
            console.log("selected row > ", row, this.component.data.uuid);
            this.context.signals.onCommTriggered.dispatch(this.component.data.uuid, row);
        }, this.component.data.options).attachTo(this.container);

        // no data
        if (!table) return null;

        this.dt = $(table.dom).DataTable({
            "scrollX": "100%",
            "order": [[ 1, "desc" ]],
            "iDisplayLength": 20,//default_rows_per_page,
            "autoWidth": false,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'excel', 'pdf', 'csv', 'print','colvis'
            ]
        });

        if (this.component.data.options) {
            const options = this.component.data.options;
            if (options.hasOwnProperty(ID_OPERATION_PRINT) && options[ID_OPERATION_PRINT] === NO) this.dt.button('.buttons-print').node().hide();
            if (options.hasOwnProperty(ID_OPERATION_PDF) && options[ID_OPERATION_PDF] === NO) this.dt.button('.buttons-pdf').node().hide();
            if (options.hasOwnProperty(ID_OPERATION_CSV) && options[ID_OPERATION_CSV] === NO) this.dt.button('.buttons-csv').node().hide();
            if (options.hasOwnProperty(ID_OPERATION_EXCEL) && options[ID_OPERATION_EXCEL] === NO) this.dt.button('.buttons-excel').node().hide();
            if (options.hasOwnProperty(ID_OPERATION_COPY) && options[ID_OPERATION_COPY] === NO) this.dt.button('.buttons-copy').node().hide();
            if (options.hasOwnProperty(ID_OPERATION_COLUMNS_VIS) && options[ID_OPERATION_COLUMNS_VIS] === NO) this.dt.button('.buttons-colvis').node().hide();
        }

        this.dt.draw(false);
    }



    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);
        return data_2_display;
    }


    setOptions() {
        let options = this.component.data.options;
        if (!options) options = {};
        if (!isPropOk(options, ID_SIZES_HEIGHT_COMPONENT)) options[ID_SIZES_HEIGHT_COMPONENT] = parseFloat($(this.component.body.dom).css("height"));
        if (!isPropOk(options, ID_HEADER_BACK_COLOR)) options[ID_HEADER_BACK_COLOR] = RGBAtoHEX($(this.container.dom).find('th').css("background-color"));
        if (!isPropOk(options, ID_HEADER_COLOR)) options[ID_HEADER_COLOR] = RGBAtoHEX($(this.container.dom).find('th').css("color"));
        if (!isPropOk(options, ID_HEADER_ALIGNMENT)) options[ID_HEADER_ALIGNMENT] = $(this.container.dom).find('th').css("text-align");
        if (!isPropOk(options, ID_HEADER_VERTICAL_ALIGNMENT)) options[ID_HEADER_VERTICAL_ALIGNMENT] = $(this.container.dom).find('th').css("vertical-align");
        if (!isPropOk(options, ID_ROWS_BACK_COLOR)) options[ID_ROWS_BACK_COLOR] = RGBAtoHEX($(this.container.dom).find('td').css("background-color"));
        if (!isPropOk(options, ID_ROWS_COLOR)) options[ID_ROWS_COLOR] = RGBAtoHEX($(this.container.dom).find('td').css("color"));
        if (!isPropOk(options, ID_ROWS_ALIGNMENT)) options[ID_ROWS_ALIGNMENT] = $(this.container.dom).find('td').css("text-align");
        if (!isPropOk(options, ID_ROWS_VERTICAL_ALIGNMENT)) options[ID_ROWS_VERTICAL_ALIGNMENT] = $(this.container.dom).find('td').css("vertical-align");
        if (!isPropOk(options, ID_OPERATION_PRINT)) options[ID_OPERATION_PRINT] = getInputData(this.options_data,ID_OPERATION_PRINT);
        if (!isPropOk(options, ID_OPERATION_PDF)) options[ID_OPERATION_PDF] = getInputData(this.options_data,ID_OPERATION_PDF);
        if (!isPropOk(options, ID_OPERATION_CSV)) options[ID_OPERATION_CSV] = getInputData(this.options_data,ID_OPERATION_CSV);
        if (!isPropOk(options, ID_OPERATION_EXCEL)) options[ID_OPERATION_EXCEL] = getInputData(this.options_data,ID_OPERATION_EXCEL);
        if (!isPropOk(options, ID_OPERATION_COPY)) options[ID_OPERATION_COPY] = getInputData(this.options_data,ID_OPERATION_COPY);
        if (!isPropOk(options, ID_OPERATION_COLUMNS_VIS)) options[ID_OPERATION_COLUMNS_VIS] = getInputData(this.options_data,ID_OPERATION_COLUMNS_VIS);
        this.component.data.options = JSON.parse(JSON.stringify(options));
    }

    setOption(id, value) {
        super.setOption(id, value);
        this.component.data.options[id] = value;        
        this.context.signals.onChanged.dispatch();
        switch (id) {
                case ID_SIZES_HEIGHT_COMPONENT:
                    this.component.body.setStyle("height", value + "px");
                    break;
                case ID_HEADER_BACK_COLOR:
                    {
                        const header = $(this.container.dom).find('th');
                        header.css("background-color",value);
                    }
                    break;
                case ID_HEADER_COLOR:
                    {
                        const header = $(this.container.dom).find('th');
                        header.css("color",value);
                    }
                    break;
                case ID_HEADER_ALIGNMENT:
                    {
                        const header = $(this.container.dom).find('th');
                        header.css("text-align",value);
                    }
                    break;
               case ID_HEADER_VERTICAL_ALIGNMENT:
                    {
                        const header = $(this.container.dom).find('th');
                        header.css("vertical-align",value);
                    }
                    break;                    
                case ID_ROWS_BACK_COLOR:
                    {
                        const rows = $(this.container.dom).find('td');
                        rows.css("background-color",value);
                    }
                    break;
                case ID_ROWS_COLOR:
                    {
                        const rows = $(this.container.dom).find('td');
                        rows.css("color",value);
                    }
                    break;
                case ID_ROWS_ALIGNMENT:
                    {
                        const rows = $(this.container.dom).find('td');
                        rows.css("text-align",value);
                    }
                    break;
               case ID_ROWS_VERTICAL_ALIGNMENT:
                    {
                        const header = $(this.container.dom).find('td');
                        header.css("vertical-align",value);
                    }
                    break;
               case ID_OPERATION_PRINT:
                    {
                        if (value === YES)
                            this.dt.button('.buttons-print').node().show()
                        else
                            this.dt.button('.buttons-print').node().hide()
                    }
                    break;
                case ID_OPERATION_PDF:
                    {
                        if (value === YES)
                            this.dt.button('.buttons-pdf').node().show()
                        else
                            this.dt.button('.buttons-pdf').node().hide()
                    }
                    break;
                case ID_OPERATION_CSV:
                    {
                        if (value === YES)
                            this.dt.button('.buttons-csv').node().show()
                        else
                            this.dt.button('.buttons-csv').node().hide()
                    }
                    break;
                case ID_OPERATION_EXCEL:
                    {
                        if (value === YES)
                            this.dt.button('.buttons-excel').node().show()
                        else
                            this.dt.button('.buttons-excel').node().hide()
                    }
                    break;
                case ID_OPERATION_COPY:
                    {
                        if (value === YES)
                            this.dt.button('.buttons-copy').node().show()
                        else
                            this.dt.button('.buttons-copy').node().hide()
                    }
                    break;                    
                case ID_OPERATION_COLUMNS_VIS:
                    {
                        if (value === YES)
                            this.dt.button('.buttons-colvis').node().show()
                        else
                            this.dt.button('.buttons-colvis').node().hide()
                    }
                    break;
                default:
        }
    }


    clear() {
        super.clear();
        this.onOptionChanged.detach();
    }

}
