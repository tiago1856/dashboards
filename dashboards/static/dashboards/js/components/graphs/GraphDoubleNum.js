
import { BaseComponentContent } from '../BaseComponentContent.js';
import { getNumberField, getStringField, isNumber } from '../Discovery.js';

export class GraphDoubleNum extends BaseComponentContent {
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);


        /*
        this.execQuery(new_query?new_query:data.query.query, null, (results) => {
            const component_data = this.prepareData(results, data);
            context.react_message_broker.postMessage({
                operation:'create_component', 
                id: parent.getId(),
                data: component_data,
            });
            context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
        });
        */

        $(component.options_btn.dom).on('click',function() {
            context.react_message_broker.postMessage({
              operation:'show_options', 
              id: component.body.getId(),
            }); 
        });
    }

    async execute() {
        const results = await this.execQuery(this.query, null);
        const component_data = this.prepareData(results, this.component.data);
        this.context.react_message_broker.postMessage({
            operation:'create_component', 
            id: this.component.body.getId(),
            data: component_data,
        });
        // if new_query => only some query parameter changed => no need to update comms
        //context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
        //if (onReady) onReady();
    }

    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);

        let id = null;
        let value1 = null;
        let value2 = null;

        // nothing defined by the user => find the first string and first/second number columns
        if (!_data.data_config.fields[0] || 
            !_data.data_config.fields[1] || 
            !_data.data_config.fields[2] || 
            _data.data_config.fields.length < 3) {
                id = getStringField(data_2_display,1);
                value1 = getNumberField(data_2_display,1);
                value2 = getNumberField(data_2_display,2);
                _data.data_config.fields = [id,value1,value2];
        } else {
            id = _data.data_config.fields[0];
            value1 = _data.data_config.fields[1];
            value2 = _data.data_config.fields[2];
        }

        if (!id || 
            !value1 || 
            !value2 || 
            (data_2_display.length > 0 && (!isNumber(data_2_display[0][value1] || !isNumber(data_2_display[0][value2]))))) {
            this.context.signals.onError.dispatch("Erros nos dados!","[GraphDoubleNum::prepareData]");
        }       
        const data = data_2_display;

        const header = {
            "type": "double_numerical", // Data Type
            "id": [id],       // Identifier of the field containing the name (x axis)
            "value": [value1,value2]  // Identifier of the field containing the numerical value (y axis)
        }; 

        return {header, data};


        /*
       const id = _data.data_config.fields[0];
       const value1 = _data.data_config.fields[1];
       const value2 = _data.data_config.fields[2];
       if (!id || !value1 || !value2) {
        this.context.signals.onError.dispatch("Erros nos dados!","[GraphDoubleNum::prepareData]");
        }       
       const data = data_2_display;

        const header = {
            "type": "double_numerical", // Data Type
            "id": [id],       // Identifier of the field containing the name (x axis)
            "value": [value1,value2]  // Identifier of the field containing the numerical value (y axis)
         };        
        return {header, data};
        */
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