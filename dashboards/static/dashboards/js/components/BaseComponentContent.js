import { fetchPOST } from "../Fetch.js";
import { URL_EXEC_QUERY } from "../urls.js";
import { VISUALIZATION_TYPE } from "../components/VisualizationType.js";

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
       // if (!this.component_analysis || force) {
            this.component_analysis = BaseComponentContent.analyzeComponent(this.data);
       // }
        return this.component_analysis;
    }

    static analyzeComponent(component_data) {
        let outputs = [];   // from
        let inputs = [];    // to
        switch(component_data.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
            {
                console.log("restore component I/O > SIMPLE TABLE");
                outputs = component_data.query.query_selected_fields;
                inputs = BaseComponentContent.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                console.log("OUT > ", outputs);
                break;
            }
            case VISUALIZATION_TYPE.TC:
            {
                console.log("restore component I/O > COMPLEX TABLE");
                outputs = component_data.query.query_selected_fields;
                inputs = BaseComponentContent.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                console.log("OUT > ", outputs);
                break;
            }                
            case VISUALIZATION_TYPE.G1N:
            {
                console.log("restore component I/O > GRAPH 1N");
                inputs = BaseComponentContent.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.GDN:            
            {
                console.log("restore component I/O > GRAPH DN");
                inputs = BaseComponentContent.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.ISL:
            {
                console.log("restore component I/O > INFO SIMPLE LEFT");
                inputs = BaseComponentContent.extractConditionals(component_data.query.query);
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.TEC:
            {
                console.log("restore component I/O > TEMPLATE CALENDAR");
                console.log("OUT > ", outputs);
                break;
            }
            case VISUALIZATION_TYPE.CN:
            {
                outputs = [component_data.data_config.name]
                console.log("restore component I/O > CONTROL NUMBER");
                console.log("OUT > ", outputs);                
                break;
            }
            case VISUALIZATION_TYPE.CS:
            {
                outputs = [component_data.data_config.name]
                console.log("restore component I/O > CONTROL STRING");
                console.log("OUT > ", outputs);

                break;
            }
            case VISUALIZATION_TYPE.CB:
            {
                outputs = [component_data.data_config.name]
                console.log("restore component I/O > CONTROL BOOL");
                console.log("OUT > ", outputs);
                break;
            }
            /*
            case VISUALIZATION_TYPE.CNI:
            {
                outputs = [component_data.data_config.name]
                console.log("restore component I/O > CONTROL NUMBER INTERVAL");
                console.log("OUT > ", outputs);
                break;
            }
            */
        }
        return [outputs, inputs];

        //return BaseQueryComponentContent.extractConditionals(query);
    }

    // temp - this data should come from teh analyzer
    static extractConditionals(query) {
        const inputs = [];
        const target_regex = /\$(.*?)\$/g;
        const target = [...query.matchAll(target_regex)];
        target.forEach(t => inputs.push(t[1]))        
        return inputs;        
    }

}