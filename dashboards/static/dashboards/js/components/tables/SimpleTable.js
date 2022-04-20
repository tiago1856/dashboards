
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
} from '../ComponentType.js';

const NUMBER_OF_OPTIONS = 9;

export class SimpleTable extends BaseComponentContent {
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);     

        component.body.setStyle("height","300px");
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
                default:
            }
            
        });
        
    }



    async execute() {
        const results = await this.execQuery(this.query, null);
        const component_data = this.prepareData(results, this.component.data);            
        this.table = new BasicTable(component_data, 20, this.component.data.data_config.fields, (row) => {
            this.context.signals.onCommTriggered.dispatch(this.component.data.uuid, row);
        }).attachTo(this.container);
    }

    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);
        // no config was provided => all fields selected
        if (_data.data_config.fields.length == 0 &&
            data_2_display.length > 0) {
                _data.data_config.fields = Object.keys(data_2_display[0]);
                _data.query.query_selected_fields =  Object.keys(data_2_display[0]);
                _data.query.query_fields =  Object.keys(data_2_display[0]);
        }
        return data_2_display;
    }

    setOptions() {
        // options:
        // there are not defined options => populate with the current options
        if (!this.component.data.options || 
            (this.component.data.options && Object.keys(this.component.data.options).length < NUMBER_OF_OPTIONS)) {
                this.populateOptions();
                console.warn("POPULATE ++++", this.component.data.options);                
        } else {
            // TODO: SEND OPTIONS DIRECTLY TO TABLE
            console.warn("ARE DEFINED ++++", this.component.data.options);
            // options are defined => use them
            $(this.component.body.dom).css("height", this.component.data.options[ID_SIZES_HEIGHT_COMPONENT]);
            $(this.container.dom).find('th').css('background-color', this.component.data.options[ID_HEADER_BACK_COLOR]);
            $(this.container.dom).find('th').css('color', this.component.data.options[ID_HEADER_COLOR]);
            $(this.container.dom).find('th').css('text-align', this.component.data.options[ID_HEADER_ALIGNMENT] );
            $(this.container.dom).find('th').css('vertical-align', this.component.data.options[ID_HEADER_VERTICAL_ALIGNMENT]);
            $(this.container.dom).find('td').css('background-color', this.component.data.options[ID_ROWS_BACK_COLOR]);
            $(this.container.dom).find('td').css('color', this.component.data.options[ID_ROWS_COLOR]);
            $(this.container.dom).find('td').css('text-align', this.component.data.options[ID_ROWS_ALIGNMENT]);
            $(this.container.dom).find('td').css('vertical-align', this.component.data.options[ID_ROWS_VERTICAL_ALIGNMENT]);
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
    }    

    clear() {
        super.clear();
        this.onOptionChanged.detach();
    }
}
