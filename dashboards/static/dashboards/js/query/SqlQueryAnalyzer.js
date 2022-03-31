import { VISUALIZATION_TYPE } from "../components/VisualizationType.js";


export class SqlQueryAnalyzer {
    static sql_parser = new NodeSQLParser.Parser();

    static getAST = (query) => {
        const ast = SqlQueryAnalyzer.sql_parser.astify(query);
        return ast;
   }
   
   static recreateSQL = (ast) => {
        return SqlQueryAnalyzer.sql_parser.sqlify(ast);
   }
    
   static isLeaf = (object) => {
      if (object.hasOwnProperty('table') || object.hasOwnProperty('value')) return true
      return false;
  }      

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

    static getInputs = (conditionals) => {
        const inputs = [];
        for (let i=0; i<conditionals.length; i+=2) {
            //console.log("field > ", conditionals[i].column, " # value > ", conditionals[i+1].value);
            inputs.push(conditionals[i].column)
        }
        return inputs;
    }



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

        //return BaseQueryComponentContent.extractConditionals(query);
    }


    // -----------

    /*
    static newQuery(ast, conditionals = null, what = null, new_value = null, index = 0) {
        if (!conditionals || !what || !new_value) return query;

        SqlQueryAnalyzer.changeConditionalValue(conditionals, index, new_value)

        return SqlQueryAnalyzer.recreateSQL(ast);
    }



    // temp - this data should come from teh analyzer
    static extractConditionals(query) {
        const inputs = [];
        const target_regex = /\$(.*?)\$/g;
        const target = [...query.matchAll(target_regex)];
        target.forEach(t => inputs.push(t[1]))        
        return inputs;        
    }
  
    // temp - this alteration should be made with the analyzer
    static modifyQuery(query, what = null, new_value = null) {
        if (!what || !new_value) return query;
        let index = query.indexOf(what);
        let index_2 = query.indexOf('#', index);
        let index_3 = query.indexOf('#', index_2 + 1);
        if (index <= 0 || index_2 <= 0 || index_3 <= 0) return query;
        const new_query = query.replaceBetween(index_2 + 1, index_3, new_value)
        console.warn("old query > ", query);
        console.warn("new query > ", new_query);
        return new_query;
    }
    */
}

/*
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};
*/