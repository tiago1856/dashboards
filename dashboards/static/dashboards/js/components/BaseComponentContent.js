import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";
import { SqlQueryAnalyzer } from '../query/SqlQueryAnalyzer.js';

/**
 * Component's inside.
 */
export class BaseComponentContent {

    constructor(context, data, query = null) {
        this.context = context;
        this.component_data = null;
        this.data = data;

        this.query = query;
        this.component_analysis = null;  
        
        this.conditionals = [];
        this.ast = null;
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
                this.context.signals.onError.dispatch(error,"[BaseComponentContent::execQuery]");
            }
        )
    }

    getQuery() {
        return this.query;
    }

    getComponentIO() {
        let inputs = [];
        let outputs = [];
        [this.ast, this.conditionals, outputs, inputs] = SqlQueryAnalyzer.analyzeComponent(this.data, this.query);
        this.component_analysis = [outputs, inputs];
        return this.component_analysis;
    }

    getModifiedQuery(outpin, new_value, index = 0) {
        // if ast is null => new content but same query => requires new parsing
        if (!this.ast) {
            [this.ast, this.conditionals] = SqlQueryAnalyzer.getASTConditionals(this.query);
        }
        if (!this.ast || this.conditionals.length == 0 || !new_value) return this.query;
        SqlQueryAnalyzer.changeConditionalValue(this.conditionals, index, new_value);
        return SqlQueryAnalyzer.recreateSQL(this.ast);
    }

}

