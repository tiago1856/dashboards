
import { BaseComponentContent } from '../BaseComponentContent.js';


export class SimpleCalendar extends BaseComponentContent {
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);


        $(component.body.dom).datetimepicker({format:'L',inline:true})

    }

    async execute(component_content = null) {
        //if (onReady) onReady();
    }
}
