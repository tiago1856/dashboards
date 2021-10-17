import { InputText } from './BuildingBlocks.js';

/**
 * Simple input.
 */
export class TextInputEv extends InputText {
    /**
     * Constructor.
     * @param {function} onReady Called when input done.
     */
    constructor(onReady=null) {
        super();
        this.addClass('text-center');

       $(this.dom).on('change blur', function(e) {
            onReady(e.target.value);
       });
    }
}