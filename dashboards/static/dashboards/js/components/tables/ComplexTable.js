
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

/**
 * Table using the js Datatable plugin.
 */
export class ComplexTable extends BaseComponentContent {
   
    constructor(context, data, parent, opt_btn) {
        super(context, data, parent);
        
        this.execQuery(data.query.query, null, (results) => {
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

        });

        $(opt_btn).on('click',function() {
        });
    }

    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);
        return data_2_display;
    }
}
