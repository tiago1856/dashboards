
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
    ID_OPERATION_SEARCH,
    ID_OPERATION_COLUMNS_VIS,
    YES,
    NO,
} from '../ComponentType.js';

const NUMBER_OF_OPTIONS = 9;

/**
 * Table using the js Datatable plugin.
 */
export class ComplexTable extends BaseComponentContent {
   
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);

        component.body.setStyle("height",this.component.data.options?(this.component.data.options[ID_SIZES_HEIGHT_COMPONENT] + 'px'):"300px");
        
        this.container = new Div().attachTo(component.body);  

        this.onOptionChanged = context.signals.onOptionChanged.add((uuid, {id, value}) => {
            if (uuid !== component.data.uuid) return;
            component.data.options[id] = value;
            context.signals.onChanged.dispatch();
            switch (id) {
                case ID_SIZES_HEIGHT_COMPONENT:
                    component.body.setStyle("height", value + "px");
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
                    }
                    break;
                case ID_OPERATION_PDF:
                    {
                    }
                    break;
                case ID_OPERATION_CSV:
                    {
                    }
                    break;
                case ID_OPERATION_SEARCH:
                    {
                    }
                    break;
                case ID_OPERATION_COLUMNS_VIS:
                    {
                    }
                    break;
                default:
            }
            
        });

    }

    async execute() {
        const results = await this.execQuery(this.query, null);
        const component_data = this.prepareData(results, this.component.data);
        const table = new BasicTable(component_data, 20, this.component.data.data_config.fields, (row) => {
            console.log("selected row > ", row, this.component.data.uuid);
            this.context.signals.onCommTriggered.dispatch(this.component.data.uuid, row);
        }, this.component.data.options).attachTo(this.container);

        // no data
        if (!table) return null;

        const dt = $(table.dom).DataTable({
            "scrollX": "100%",
            "order": [[ 1, "desc" ]],
            "iDisplayLength": 20,//default_rows_per_page,
            "autoWidth": false,
        });
        dt.draw(false);
    }



    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);
        return data_2_display;
    }


    setOptions() {
        // options:
        // there are not defined options => populate with the current options
        if (!this.component.data.options/* || 
            (this.component.data.options && Object.keys(this.component.data.options).length < NUMBER_OF_OPTIONS)*/) {
                this.populateOptions();
                console.warn("POPULATE ++++", this.component.data.options);                
        }
    }

    populateOptions() {
        this.component.data.options = {};
        
        this.component.data.options[ID_SIZES_HEIGHT_COMPONENT] = parseFloat($(this.component.body.dom).css("height"));
        this.component.data.options[ID_HEADER_BACK_COLOR] = $(this.container.dom).find('th').css('background-color');
        this.component.data.options[ID_HEADER_COLOR] = $(this.container.dom).find('th').css('color');
        this.component.data.options[ID_HEADER_ALIGNMENT] = $(this.container.dom).find('th').css('text-align');
        this.component.data.options[ID_HEADER_VERTICAL_ALIGNMENT] = $(this.container.dom).find('th').css('vertical-align');
        this.component.data.options[ID_ROWS_BACK_COLOR] = $(this.container.dom).find('td').css('background-color');
        this.component.data.options[ID_ROWS_COLOR] = $(this.container.dom).find('td').css('color');
        this.component.data.options[ID_ROWS_ALIGNMENT] = $(this.container.dom).find('td').css('text-align');
        this.component.data.options[ID_ROWS_VERTICAL_ALIGNMENT] = $(this.container.dom).find('td').css('vertical-align');
        this.component.data.options[ID_OPERATION_PRINT] = NO;
        this.component.data.options[ID_OPERATION_PDF] = NO;
        this.component.data.options[ID_OPERATION_CSV] = NO;
        this.component.data.options[ID_OPERATION_SEARCH] = YES;
        this.component.data.options[ID_OPERATION_COLUMNS_VIS] = NO;
    }    

    clear() {
        super.clear();
        this.onOptionChanged.detach();
    }
}
