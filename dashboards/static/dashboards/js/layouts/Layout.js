
import { Div } from '../builders/BuildingBlocks.js';
import { CollapsibleCard } from '../cards/CollapsibleCard.js';
import { LAYOUTS } from './constants.js';


const COMPONENTS_CONTAINER = document.getElementById('components-container');
/*
LE2: [
    [[4,1],[4,1],[4,1]],
    [[8,1],[4,2]],
],
*/
export class Layout extends Div {
    constructor (context, layout_id) {
        super();
        this.context = context;

        const rows = LAYOUTS[layout_id];

        let spot = 0

        rows.forEach(row => {
            //this.parse(_row, COMPONENTS_CONTAINER);
            // check if there is a multi-row component and if so, it must have max-height
            let h100 = false;
            for (let i=0; i<row.length; i++){
                if (row[i][1] > 1) {
                    h100 = true;
                    break;
                }
            };
                        
            const new_row = new Div({classes:['row']}).attachTo(COMPONENTS_CONTAINER);
            row.forEach(col => {

                const _col = new Div({classes:['col-md-' + col[0], 'mb-2']});
                _col.attachTo(new_row);
                if (col[1] === 1 && h100) {
                    new CollapsibleCard(this.context, 'XXX', true, 'primary').attachTo(_col);
                    spot++;
                } else {
                    for (let i=0; i < col[1]; i++) {
                        new CollapsibleCard(this.context, 'XXX', false, 'success').attachTo(_col);
                        spot++;
                    }
                }

            });

        });
    }
    /*
    parse(_row, parent) {
            const row = new Div({classes:['row mb-2']}).attachTo(parent);
            _row.forEach(_size => {
                if (typeof(_size) === 'number') {
                    const place = new Div({classes:['col-' + _size]}).attachTo(row);
                    new CollapsibleCard(this.context, 'XXX').attachTo(place);
                } else {
                    const place = new Div({classes:['col']}).attachTo(row)
                    this.parse(_size, place);
                }
            });
    }
    */
}


