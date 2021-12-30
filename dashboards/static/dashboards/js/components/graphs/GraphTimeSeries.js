
import { BaseComponentContent } from '../BaseComponentContent.js';

export class GraphTimeSeries extends BaseComponentContent {
    constructor(context, data, parent, opt_btn) {
        super(context, data, parent);

        context.react_message_broker.postMessage({
            operation:'create_component', 
            id: parent.getId(),
            data: this.component_data,
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

        const header = {
            "type": "time_series", // Data Type
            "id": ["date"],       // Identifier of the field containing the name (x axis)
            "value": ["value_name1","value_name2","value_name3"],   // Identifier of the field containing the numerical value (y axis)
            "time": ["d","m","y"] // 3 elems = d/m/y || 2 elems = mounth || 1 elem = day
        };

        const data = [ 
            { 
                "date": new Date("05/05/2019"),
                "value_name1": 4000,
                "value_name2": 9000,
                "value_name3": 1000
            },
            { 
                "date": new Date("05/03/2019"),
                "value_name1": 2000,
                "value_name2": 8000,
                "value_name3": 6000
            },
            { 
                "date": new Date("05/08/2019"),
                "value_name1": 8000,
                "value_name2": 7000,
                "value_name3": 1000
            },
            { 
                "date": new Date("05/06/2019"),
                "value_name1": 5000,
                "value_name2": 1000,
                "value_name3": 7000
            },
            { 
                "date": new Date("06/05/2019"),
                "value_name1": 4000,
                "value_name2": 9000,
                "value_name3": 1000
            },
            { 
                "date": new Date("06/03/2019"),
                "value_name1": 2000,
                "value_name2": 8000,
                "value_name3": 6000
            },
            { 
                "date": new Date("06/08/2019"),
                "value_name1": 8000,
                "value_name2": 7000,
                "value_name3": 1000
            },
            { 
                "date": new Date("06/06/2019"),
                "value_name1": 5000,
                "value_name2": 1000,
                "value_name3": 7000
            },
            { 
                "date": new Date("07/05/2019"),
                "value_name1": 4000,
                "value_name2": 9000,
                "value_name3": 1000
            },
            { 
                "date": new Date("07/03/2019"),
                "value_name1": 2000,
                "value_name2": 8000,
                "value_name3": 6000
            },
            { 
                "date": new Date("07/08/2019"),
                "value_name1": 8000,
                "value_name2": 7000,
                "value_name3": 1000
            },
            { 
                "date": new Date("07/06/2019"),
                "value_name1": 5000,
                "value_name2": 1000,
                "value_name3": 7000
            }
        ]
        return {header, data};
    }
}