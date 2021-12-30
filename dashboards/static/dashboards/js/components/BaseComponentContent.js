import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";

export class BaseComponentContent {
    constructor(context, data, parent) {
        this.context = context;
        this.component_data = this.prepareData(data);
    }

    prepareData(_data) {
    }



    execQuery(query, rows) {
        fetchPOST(URL_EXEC_QUERY,
            {
                query: query,
                rows: rows,
            },
            (result) => {
                console.log(result);
                /*
                if (result.length == 0) return;                

                Object.keys(result[0]).forEach(column => {
                    SELECTED_FIELDS.append(this.createFieldItem(column, true));
                });
                SELECTED_FIELDS.multiselect('rebuild');

                const table = new BasicTable(result, parseInt(NUMBER_LINES.val())).attachTo(TABLE_AREA.get(0));
                this.table_id = table.getId();
                */
            },
            (error) => {
                this.context.signals.onError.dispatch(error,"[BaseComponentContent::execQuery]");
            }
        )
    }
}