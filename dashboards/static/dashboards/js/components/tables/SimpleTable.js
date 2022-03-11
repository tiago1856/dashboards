
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

export class SimpleTable extends BaseComponentContent {
    constructor(context, data, parent, opt_btn, h100) {
        super(context, data, parent);
        
        this.execQuery(data.query.query, null, (results) => {
            parent.setStyle("height","300px");
            const component_data = this.prepareData(results, data);
            const container = new Div().attachTo(parent);
            new BasicTable(component_data, 20, data.data_config.fields, (row) => {
                console.log("selected row > ", row, data.uuid);
            }).attachTo(container);
        });

        $(opt_btn).on('click',function() {
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
