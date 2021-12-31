
import { BaseComponentContent } from '../BaseComponentContent.js';

export class Graph1Num extends BaseComponentContent {
    constructor(context, data, parent, opt_btn) {
        super(context, data, parent);
        this.execQuery(data.query, 10, (results) => {
            const component_data = this.prepareData(results);
            context.react_message_broker.postMessage({
                operation:'create_component', 
                id: parent.getId(),
                data: component_data,
            });

        });

        $(opt_btn).on('click',function() {
            self.context.react_message_broker.postMessage({
              operation:'show_options', 
              id: id,
            }); 
        });
    }

    prepareData(_data) {
        super.prepareData(_data);
        // _data.query_selected_fields

        const header = {
            "type": "one_numerical", // Data Type
            "id": ["id_name"],       // Identifier of the field containing the name (x axis)
            "value": ["value_name"]  // Identifier of the field containing the numerical value (y axis)
        };

        const data = [ 
            { 
                "id_name": "Valor 1",
                "value_name": 1000
            },
            { 
                "id_name": "Valor 2",
                "value_name": 2000
            },
            { 
                "id_name": "Valor 3",
                "value_name": 3000
            },
            { 
                "id_name": "Valor 4",
                "value_name": 4000
            },
        ]
        return {header, data};
    }
}