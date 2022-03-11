


import { Div, AwesomeIconAndButton } from '../builders/BuildingBlocks.js';
import { SimpleCard } from '../builders/SimpleCard.js';
import { FieldSelector } from './FieldSelector.js';

export class CommLink extends SimpleCard {
  /**
   * Constructor.
   */
    constructor(context) {
        super();        
        this.addClass('CommLink');

        const self = this;

        const row = new Div().attachTo(this.getBody());
        row.addClass('row');

        const origin_col = new Div().attachTo(row);
        origin_col.addClass('col-5');
        const origin = new FieldSelector(context,() => {}).attachTo(origin_col);

        const arrow = new Div().attachTo(row);
        arrow.addClass('col-1 text-center');
        arrow.setTextContent('--->');

        const destination_col = new Div().attachTo(row);
        destination_col.addClass('col-5');
        const destination = new FieldSelector(context,() => {}).attachTo(destination_col);

        const action = new Div().attachTo(row);
        action.addClass('col-1');
        const remove_btn = new AwesomeIconAndButton('','fa fa-times').attachTo(action);
        remove_btn.addClass('btn btn-danger btn-lg');
        remove_btn.setAttribute('type','button');

        $(remove_btn.dom).on('click', function() {
            $(self.dom).remove();
        })

    }
}
