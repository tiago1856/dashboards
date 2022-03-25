
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

/**
 * Table using the js Datatable plugin.
 */
export class ComplexTable extends BaseComponentContent {
   
    constructor(context, data, parent, opt_btn, new_query=null) {
        super(context, data, new_query?new_query:data.query.query);

        parent.setStyle("height","300px");
        this.container = new Div().attachTo(parent);  
        /*
        this.execQuery(new_query?new_query:data.query.query, null, (results) => {
            parent.setStyle("height","300px");
            const component_data = this.prepareData(results, data);
            const container = new Div().attachTo(parent);        

            const table = new BasicTable(component_data, 20, data.data_config.fields, (row) => {
                console.log("selected row > ", row, data.uuid);
            }).attachTo(container);

            // no data
            if (!table) return null;

            const dt = $(table.dom).DataTable({
                "scrollX": "100%",
                "order": [[ 1, "desc" ]],
                "iDisplayLength": 20,//default_rows_per_page,
                "autoWidth": false,
            });
            dt.draw(false);

            context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
        });
        */

        $(opt_btn).on('click',function() {
        });
    }

    execute(onReady=null) {
        this.execQuery(this.query, null, (results) => {            
            const component_data = this.prepareData(results, this.data);
            const table = new BasicTable(component_data, 20, this.data.data_config.fields, (row) => {
                console.log("selected row > ", row, this.data.uuid);
            }).attachTo(this.container);

            // no data
            if (!table) return null;

            const dt = $(table.dom).DataTable({
                "scrollX": "100%",
                "order": [[ 1, "desc" ]],
                "iDisplayLength": 20,//default_rows_per_page,
                "autoWidth": false,
            });
            dt.draw(false);

            if (onReady) onReady();
        });
    }



    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);
        return data_2_display;
    }
}
