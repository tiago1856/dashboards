
import { BaseComponentContent } from '../BaseComponentContent.js';

export class GraphDoubleNum extends BaseComponentContent {
    constructor(context, data, parent, opt_btn) {
        super(context, data, parent);

        this.execQuery(data.query.query, 10, (results) => {
            const component_data = this.prepareData(results);
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

}