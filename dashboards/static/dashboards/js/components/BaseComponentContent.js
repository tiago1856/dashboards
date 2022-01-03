import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";

/**
 * Component's inside.
 */
export class BaseComponentContent {
    constructor(context, data, parent) {
        this.context = context;
        this.component_data = null;
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
                if (onReady) onReady(result);
            },
            (error) => {
                this.context.signals.onError.dispatch(error,"[BaseComponentContent::execQuery]");
            }
        )
    }
}