
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

export class SimpleTable extends BaseComponentContent {
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);

        component.body.setStyle("height","300px");
        this.container = new Div().attachTo(component.body);


        $(component.opt_btn).on('click',function() {
        });
    }

    execute(onReady=null) {
        this.execQuery(this.query, null, (results) => {            
            const component_data = this.prepareData(results, this.component.data);            
            new BasicTable(component_data, 20, this.component.data.data_config.fields, (row) => {
                console.log("selected row > ", row, this.component.data.uuid);
            }).attachTo(this.container);
            //context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
            if (onReady) onReady();
        });
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
