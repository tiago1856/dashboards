
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

export class ComplexTable extends BaseComponentContent {
    constructor(context, data, parent, opt_btn, h100) {
        super(context, data, parent);
        
        this.execQuery(data.query.query, null, (results) => {
            if (!h100) {
                parent.setStyle("height","300px");
            } else {
                parent.setStyle("height","600px");
            }
            const component_data = this.prepareData(results, data);
            const container = new Div().attachTo(parent);        

            const table = new BasicTable(component_data, 20, data.data_config.fields).attachTo(container);
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
