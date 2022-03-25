
import { BaseComponentContent } from '../BaseComponentContent.js';
import { getNumberField, getStringField, isNumber } from '../Discovery.js';

export class Graph1Num extends BaseComponentContent {
    /**
     * Constructor.
     * @param {*} context 
     * @param {*} data 
     * @param {*} parent 
     * @param {*} opt_btn 
     * @param {*} new_query 
     */
    constructor(context, data, parent, opt_btn, new_query=null) {
        super(context, data, new_query?new_query:data.query.query);
        this.parent = parent;

        $(opt_btn).on('click',function() {
            context.react_message_broker.postMessage({
              operation:'show_options', 
              id: parent.getId(),
            }); 
        });
    }

    execute(onReady=null) {
        this.execQuery(this.query, null, (results) => {
            const component_data = this.prepareData(results, this.data);
            this.context.react_message_broker.postMessage({
                operation:'create_component', 
                id: this.parent.getId(),
                data: component_data,
            });
            // if new_query => only some query parameter changed => no need to update comms
            //context.signals.onComponentUpdated.dispatch(data.uuid, new_query?false:true);
            if (onReady) onReady();
        });
    }

    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);

        let id = null;
        let value = null;

        // nothing defined by the user => find the first string and number column
        if (!_data.data_config.fields[0] || !_data.data_config.fields[1] || _data.data_config.fields.length < 2) {
            id = getStringField(data_2_display,1);
            value = getNumberField(data_2_display,1);
            _data.data_config.fields = [id,value];
        } else {
            id = _data.data_config.fields[0];
            value = _data.data_config.fields[1];
        }

        if (!id || !value || (data_2_display.length > 0 && !isNumber(data_2_display[0][value]))) {
            this.context.signals.onError.dispatch("Erros nos dados!","[Graph1Num::prepareData]");
        }

        const data = data_2_display;

        const header = {
            "type": "one_numerical", // Data Type
            "id": [id],       // Identifier of the field containing the name (x axis)
            "value": [value]  // Identifier of the field containing the numerical value (y axis)
        };
        
        //_data.query.query_selected_fields = [id];

        return {header, data};

    }

}

