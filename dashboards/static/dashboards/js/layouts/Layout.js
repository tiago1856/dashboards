
import { Div } from '../builders/BuildingBlocks.js';
import { Component } from '../components/Component.js';
import { LAYOUTS } from '../constants.js';
import { LayoutTitle } from './LayoutTitle.js';



const LAYOUT_CONTAINER = $('#layout-container');



export class Layout extends Div {
    /**
     * 
     * @param {Context} context Context.
     * @param {string} layout_id Layout ID (check constants.js).
     * @param {object} data Data to restore the layout and all its components.
     */
    constructor (context, layout_id, data=null) {
        super();
        this.context = context;
        this.attachTo(LAYOUT_CONTAINER[0]);

        context.layout = {title: null, components: {}};

        const rows = LAYOUTS[layout_id];

        context.layout.title = new LayoutTitle(context, data?data.title:null).attachTo(this);
        

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
                        
            const new_row = new Div({classes:['row']}).attachTo(this);
            row.forEach(col => {

                const _col = new Div({classes:['col-md-' + col[0], 'mb-2']});
                _col.attachTo(new_row);
                if (col[1] === 1 && h100) {
                    context.layout.components[spot] = new Component(this.context, spot, 'XXX', true, 'primary').attachTo(_col);
                    spot++;
                } else {
                    for (let i=0; i < col[1]; i++) {                        
                        context.layout.components[spot] = new Component(this.context, spot, 'XXX', false, 'light').attachTo(_col);
                        spot++;
                    }
                }

            });

            $.getScript('/static/framework/js/main.3147c80c.js', function() {
                console.log("111111111");
            });

        });

        console.log(context.layout);
    }

}


