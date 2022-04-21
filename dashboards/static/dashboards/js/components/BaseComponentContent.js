import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";
import { SqlQueryAnalyzer } from '../query/SqlQueryAnalyzer.js';
import { MSG_QUERY_ANALYSIS_ERROR, MSG_QUERY_ERROR } from '../messages.js';
import { getAllNumbers } from "../utils/jsutils.js";



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
        //if (!this.component.data.options) this.populateOptions();

    }
    /*
    populateOptions() {        
    }
    */
    prepareData(_data) {
    }

    async execute() {        
    }

    async execQuery(query=null, rows=null) {
        if (!query) return null;
        let options = null;
        if (rows) 
            options = { query: query, rows: rows };
        else
            options = { query: query };
        return fetchPOST(URL_EXEC_QUERY,
            options,
            (result) => {
                return result;
                //if (onReady) onReady(result);
            },
            (error) => {
                const error_codes = getAllNumbers(error.toString());
                if (error_codes && error_codes.length > 0 && error_codes[0] == 500) {
                    this.context.signals.onError.dispatch(MSG_QUERY_ERROR,"[BaseComponentContent::execQuery]");
                } else {
                    this.context.signals.onError.dispatch(error,"[BaseComponentContent::execQuery]");
                }
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

    getModifiedQuery(comm_data) {
        if (!this.component.ast || this.component.conditionals.length == 0) return this.query;
        comm_data.forEach(data => {
            SqlQueryAnalyzer.changeConditionalValue(this.component.conditionals, data.index, data.value);
        })        
        return SqlQueryAnalyzer.recreateSQL(this.component.ast);
    }

    /**
     * Cleanups events, usw.
     */
     clear() {}

    /**
     * Sets the options data.
     * Either populates or creates it and then populates.
     */
    setOptions() {}
    
}

