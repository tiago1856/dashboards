
import { BaseComponentContent } from '../BaseComponentContent.js';
import { BasicTable } from '../../builders/BasicTable.js';
import { Div } from '../../builders/BuildingBlocks.js';

/**
 * Table using the js Datatable plugin.
 */
export class ComplexTable extends BaseComponentContent {
   
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);

        component.body.setStyle("height","300px");
        this.container = new Div().attachTo(component.body);  

        $(component.opt_btn).on('click',function() {
        });
    }

    async execute() {
        const results = await this.execQuery(this.query, null);
        const component_data = this.prepareData(results, this.component.data);
        const table = new BasicTable(component_data, 20, this.component.data.data_config.fields, (row) => {
            console.log("selected row > ", row, this.component.data.uuid);
            this.context.signals.onCommTriggered.dispatch(this.component.data.uuid, row);
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
    }



    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);
        return data_2_display;
    }
}
