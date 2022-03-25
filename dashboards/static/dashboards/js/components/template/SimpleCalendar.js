
import { BaseComponentContent } from '../BaseComponentContent.js';


export class SimpleCalendar extends BaseComponentContent {
    constructor(context, data, parent, opt_btn, h100) {
        super(context, data, parent);


        $(parent.dom).datetimepicker({format:'L',inline:true})

        $(opt_btn).on('click',function() {
        });
    }

    execute(onReady=null) {
        if (onReady) onReady();
    }
}
