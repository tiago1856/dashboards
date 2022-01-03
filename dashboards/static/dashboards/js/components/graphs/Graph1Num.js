
import { BaseComponentContent } from '../BaseComponentContent.js';

export class Graph1Num extends BaseComponentContent {
    constructor(context, data, parent, opt_btn) {
        super(context, data, parent);
        
        this.execQuery(data.query.query, null, (results) => {
            const component_data = this.prepareData(results, data);
            context.react_message_broker.postMessage({
                operation:'create_component', 
                id: parent.getId(),
                data: component_data,
            });
        });

        $(opt_btn).on('click',function() {
            context.react_message_broker.postMessage({
              operation:'show_options', 
              id: parent.getId(),
            }); 
        });
    }

    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);

       const id = _data.data_config.fields[0];
       const value = _data.data_config.fields[1];
       if (!id || !value) {
        this.context.signals.onError.dispatch("Erros nos dados!","[Graph1Num::prepareData]");
        }       
       const data = data_2_display;

        const header = {
            "type": "one_numerical", // Data Type
            "id": [id],       // Identifier of the field containing the name (x axis)
            "value": [value]  // Identifier of the field containing the numerical value (y axis)
        };
        return {header, data};
    }
}



        /*
        const data = data_2_display;
        // get the first 2 keys
        const keys = Object.keys(data_2_display[0]);
        let id = null;
        let value = null;
        // if number
        if (parseFloat(data[keys[0]]) == parseFloat(data[keys[0]])) {
            id = keys[1];
            value = keys[0];
        } else {
            id = keys[0];
            value = keys[1];
        }
        */
