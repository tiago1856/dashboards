
import { Select } from '../builders/BuildingBlocks.js';


/**
 * Field select.
 */
export class FieldSelector extends Select {

    /**
     * Constructor.
     * @param {Context} context Context.
     * @param {function} selection_callback Called when a selection is made.
     */
    constructor(context, selection_callback = null) {
        super({classes:['form-control']});

        this.selection_callback = selection_callback;
        const self = this;
        

      
        this.dom.addEventListener('change', function(e) {
            if (self.selection_callback) self.selection_callback(e.target.value);
            self.removeClass('bg-danger');
            self.removeClass('text-white');
        });

    }

    /**
     * Clear the select.
     */
    clear() {
    }


    /**
     * Recreates the list.
     * @returns 
     */
    refresh() {
    }

    /**
     * Hides or shows options according to their type and nature.
     * @param {string} currently_selected Currently selected option.
     */
    filter(currently_selected) {
        this.checkStatus();
    }
}
