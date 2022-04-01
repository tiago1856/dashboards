import { VISUALIZATION_TYPE } from "../components/VisualizationType.js";


/**
 * Analyzes a sql query, constructs its syntax tree, and identifies the conditions (inputs).
 * Rebuilds a query from an AST tree.
 */
export class SqlQueryAnalyzer {
    static sql_parser = new NodeSQLParser.Parser();

    static cleanQuery = (query) => {
        //return query.replaceAll(/(\r\n|\n|\r|\t)/gm, " ");
        return query.replaceAll(/(\r\n|\n|\r)/gm, " ");
    }

    /**
     * 
     * @param {*} query 
     * @returns 
     */
    static getAST = (query) => {
        const ast = SqlQueryAnalyzer.sql_parser.astify(SqlQueryAnalyzer.cleanQuery(query));
        return ast;
    }
   
    static recreateSQL = (ast) => {
        return SqlQueryAnalyzer.sql_parser.sqlify(ast);
    }
    
    static isLeaf = (object) => {
        if (object.hasOwnProperty('table') || object.hasOwnProperty('value')) return true
        return false;
    }      

  /**
   * Parse the part of the AST tree with the conditions.
   * The conditions will be stored in the conditionals array: [{id}, {value}, {id}, {value}, ...]
   * @param {object} obj Part of the AST tree containing the conditions.
   * @param {array of object} conditionals Array to store the conditions (leafs) in order.
   * @returns Recursive function.
   */
  static parseConditionals = (obj, conditionals) => {
        if (!obj) return null
        if (SqlQueryAnalyzer.isLeaf(obj)) {
            conditionals.push(obj)
            return;
        }			
        for (const key in obj) {				
            if (key === 'left' || key === 'right') {
                SqlQueryAnalyzer.parseConditionals(obj[key], conditionals)
            }				
        }  
    }


    static changeConditionalValue = (conditionals, n, new_value) => {
        const i = n * 2 + 1;
        conditionals[i].value = new_value;
    }

    static getASTConditionals = (query) => {
        const conditionals = [];
        const ast = SqlQueryAnalyzer.getAST(query);		
		SqlQueryAnalyzer.parseConditionals(ast.where, conditionals);
        return [ast, conditionals];
    }

    /**
     * From the conditionals array [{id}, {value}, {id}, {value}, ...], returns an array
     * with only the id::column.
     * @param {*} conditionals 
     * @returns 
     */
    static getInputs = (conditionals) => {
        const inputs = [];
        for (let i=0; i<conditionals.length; i+=2) {
            inputs.push(conditionals[i].column)
        }
        return inputs;
    }


    /**
     * 
     * @param {object} component_data Component's data.
     * @param {string} query SQL query.
     * @returns [ast, conditionals, outputs, inputs]
     */
    static analyzeComponent(component_data, query = null) {
        let outputs = [];   // from
        let inputs = [];    // to
        let ast = null;
        let conditionals = [];
        switch(component_data.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
            {
                console.log("restore component I/O > SIMPLE TABLE");
                outputs = component_data.query.query_selected_fields;
                [ast, conditionals] = SqlQueryAnalyzer.getASTConditionals(query);
                inputs = SqlQueryAnalyzer.getInputs(conditionals);
                console.log("IN > ", inputs);
                console.log("OUT > ", outputs);
                break;
            }
            case VISUALIZATION_TYPE.TC:
            {
                console.log("restore component I/O > COMPLEX TABLE");
                outputs = component_data.query.query_selected_fields;
                [ast, conditionals] = SqlQueryAnalyzer.getASTConditionals(query);
                inputs = SqlQueryAnalyzer.getInputs(conditionals);                
                console.log("IN > ", inputs);
                console.log("OUT > ", outputs);
                break;
            }                
            case VISUALIZATION_TYPE.G1N:
            {
                console.log("restore component I/O > GRAPH 1N");
                [ast, conditionals] = SqlQueryAnalyzer.getASTConditionals(query);
                inputs = SqlQueryAnalyzer.getInputs(conditionals);                
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.GDN:            
            {
                console.log("restore component I/O > GRAPH DN");
                [ast, conditionals] = SqlQueryAnalyzer.getASTConditionals(query);
                inputs = SqlQueryAnalyzer.getInputs(conditionals);                
                console.log("IN > ", inputs);
                break;
            }
            case VISUALIZATION_TYPE.ISL:
            {
                console.log("restore component I/O > INFO SIMPLE LEFT");
                [ast, conditionals] = SqlQueryAnalyzer.getASTConditionals(query);//component_data.query.query);
                inputs = SqlQueryAnalyzer.getInputs(conditionals);                
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
        return [ast, conditionals, outputs, inputs];

    }
}
