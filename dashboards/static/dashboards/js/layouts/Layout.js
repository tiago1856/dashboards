
import { Div } from '../builders/BuildingBlocks.js';
import { Component } from '../components/Component.js';
import { LAYOUTS } from '../constants.js';
import { LayoutTitle } from './LayoutTitle.js';
import { InfoComponent } from '../components/InfoComponent.js';



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

        //context.layout = {title: null, components: {}};
        this.title = null;
        this.components = {};

        const rows = LAYOUTS[layout_id];

        new LayoutTitle(
            context, 
            data?data.title:null,
            (new_title) => {
                this.title = new_title;
            }
        ).attachTo(this);
        

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
                    this.components[spot] = new Component(this.context, spot, null, true, 'primary').attachTo(_col);
                    spot++;
                } else {
                    for (let i=0; i < col[1]; i++) {                        
                        this.components[spot] = new Component(this.context, spot, null, false, 'light').attachTo(_col);
                        spot++;
                    }
                }

            });

        });       
    }

    getComponentAt(spot) {
        return this.components[spot];
    }

    getTitle() {
        return this.title;
    }


    changeComponentContainer(spot, info = false) {
        const original = this.getComponentAt(spot);
        const data = JSON.parse(JSON.stringify(original.data));
        let comp = null;
        if (info)
            comp = new InfoComponent(this.context, spot, null, true, 'light', data);
        else
            comp = new Component(this.context, spot, null, true, 'light', data);
        $(original.dom).replaceWith($(comp.dom));
        comp.setEditMode(true);
        this.components[spot] = comp;       
        return this.components[spot];
    }
    

}


