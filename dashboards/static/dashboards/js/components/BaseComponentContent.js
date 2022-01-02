import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";

/**
 * Component's inside.
 */
export class BaseComponentContent {
    constructor(context, data, parent) {
        this.context = context;

        this.component_data = null;
        //this.component_data = this.prepareData(data);
    }

    prepareData(_data) {
    }



    execQuery(query=null, rows=null, onReady=null) {
        if (!query) return null;
        let options = null;
        if (rows) 
            options = { query: query, rows: rows };
        else
            options = { query: query };
        fetchPOST(URL_EXEC_QUERY,
            options,
            (result) => {
                console.log(result);
                if (onReady) onReady(result);
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