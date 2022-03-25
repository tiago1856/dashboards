
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

export class SimpleTable extends BaseComponentContent {
    constructor(context, data, parent, opt_btn, new_query=null) {
        super(context, data, new_query?new_query:data.query.query);
        
        parent.setStyle("height","300px");
        this.container = new Div().attachTo(parent);
        /*
        this.execQuery(new_query?new_query:data.query.query, null, (results) => {
            parent.setStyle("height","300px");
            const component_data = this.prepareData(results, data);
            const container = new Div().attachTo(parent);
            new BasicTable(component_data, 20, data.data_config.fields, (row) => {
                console.log("selected row > ", row, data.uuid);
            }).attachTo(container);

            context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
        });
        */

        $(opt_btn).on('click',function() {
        });
    }

    execute(onReady=null) {
        this.execQuery(this.query, null, (results) => {            
            const component_data = this.prepareData(results, this.data);            
            new BasicTable(component_data, 20, this.data.data_config.fields, (row) => {
                console.log("selected row > ", row, this.data.uuid);
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
