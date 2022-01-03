
import { BaseComponentContent } from '../BaseComponentContent.js';

export class GraphDoubleNum extends BaseComponentContent {
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
       const value1 = _data.data_config.fields[1];
       const value2 = _data.data_config.fields[2];
       if (!id || !value1 || !value2) {
        this.context.signals.onError.dispatch("Erros nos dados!","[Graph1Num::prepareData]");
        }       
       const data = data_2_display;

        const header = {
            "type": "double_numerical", // Data Type
            "id": [id],       // Identifier of the field containing the name (x axis)
            "value": [value1,value2]  // Identifier of the field containing the numerical value (y axis)
         };        
        return {header, data};
    }

    /*
    prepareData(_data) {
        super.prepareData(_data);

        const header = {
            "type": "double_numerical", // Data Type
            "id": ["id_name"],       // Identifier of the field containing the name (x axis)
            "value": ["value_name1","value_name2"]  // Identifier of the field containing the numerical value (y axis)
         };

        const data = [ 
            { 
                "id_name": "Valor 1",
                "value_name1": 8000,
                "value_name2": 4000
            },
            { 
                "id_name": "Valor 2",
                "value_name1": 5000,
                "value_name2": 7000
            },
            { 
                "id_name": "Valor 3",
                "value_name1": 13000,
                "value_name2": 4000
            },
            { 
                "id_name": "Valor 4",
                "value_name1": 7000,
                "value_name2": 6000
            },
        ]
        return {header, data};

    }    
    */

}