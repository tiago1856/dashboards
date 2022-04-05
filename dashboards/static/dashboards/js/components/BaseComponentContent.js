import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";
import { SqlQueryAnalyzer } from '../query/SqlQueryAnalyzer.js';
import { MSG_QUERY_ANALYSIS_ERROR, MSG_QUERY_ERROR } from '../messages.js';

/**
 * Component's inside.
 */
export class BaseComponentContent {

    constructor(context, component, query = null) {
        this.context = context;
        this.component_data = null;
        //this.data = data;
        this.component = component;

        this.query = query;
        //this.component_analysis = null;  
        /*
        this.conditionals = [];
        this.ast = null;
        */
    }

    prepareData(_data) {
    }

    execute(onReady=null) {        
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
                //console.error("[BaseComponentContent::execQuery]", error);
                this.context.signals.onError.dispatch(MSG_QUERY_ERROR,"[BaseComponentContent::execQuery]");
            }
        )
    }

    getQuery() {
        return this.query;
    }


    getComponentIO() {
        let inputs = [];
        let outputs = [];
        try {
            [this.component.ast, this.component.conditionals, outputs, inputs] = SqlQueryAnalyzer.analyzeComponent(this.component.data, this.query);
        } catch (error) {
            console.warn("[BaseComponentContent::getModifiedQuery] " + error);
            this.context.signals.onWarning.dispatch(MSG_QUERY_ANALYSIS_ERROR);
        }
        //this.component_analysis = [outputs, inputs];
        return [outputs, inputs];
    }

    getModifiedQuery(outpin, new_value, index = 0) {
        if (!this.component.ast || this.component.conditionals.length == 0 || !new_value) return this.query;
        SqlQueryAnalyzer.changeConditionalValue(this.component.conditionals, index, new_value);
        return SqlQueryAnalyzer.recreateSQL(this.component.ast);
    }

}

