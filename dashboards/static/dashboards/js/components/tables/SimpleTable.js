
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';
import { 
    ID_SIZES_HEIGHT_COMPONENT,
    ID_HEADER_BACK_COLOR,
    ID_HEADER_COLOR,
    ID_HEADER_ALIGNMENT,
    ID_ROWS_BACK_COLOR,
    ID_ROWS_COLOR,
    ID_ROWS_ALIGNMENT,
} from '../ComponentType.js';


export class SimpleTable extends BaseComponentContent {
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);

        component.body.setStyle("height","300px");
        this.container = new Div().attachTo(component.body);


        context.signals.onOptionChanged.add((uuid, {id, value}) => {
            if (uuid !== component.data.uuid) return;
            console.warn(uuid, id, value);
            switch (id) {
                case ID_SIZES_HEIGHT_COMPONENT:
                    component.body.setStyle("height", value + "px");
                    break;
                case ID_HEADER_BACK_COLOR:

                    break;
                case ID_HEADER_COLOR:
                
                    break;
                case ID_HEADER_ALIGNMENT:
                
                    break;
                case ID_ROWS_BACK_COLOR:
                
                    break;
                case ID_ROWS_COLOR:
                
                    break;
                case ID_ROWS_ALIGNMENT:
                
                    break;
                default:
            }
            
        });
    }

    async execute() {
        const results = await this.execQuery(this.query, null);
        const component_data = this.prepareData(results, this.component.data);            
        new BasicTable(component_data, 20, this.component.data.data_config.fields, (row) => {
            console.log("selected row > ", row, this.component.data.uuid);
            this.context.signals.onCommTriggered.dispatch(this.component.data.uuid, row);                       
        }).attachTo(this.container);
        //context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
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
}
