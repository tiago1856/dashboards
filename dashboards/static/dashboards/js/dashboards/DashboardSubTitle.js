

import { Div, Hx, Text } from '../builders/BuildingBlocks.js';

/**
 * Dashboard Title.
 */
export class DashboardSubTitle extends Div {
    /**
     * Constructor.
     * @param {Context} context Context.
     * @param {string} _title Dashboard Title.
     */
    constructor(context, _title = null) {
        super();

        this.value = null;
        this.context = context;

        this.addClass('DashboardSubitle');
        this.addClass('row');
        const title_col = new Div().attachTo(this);
        title_col.addClass('col');
        const h_title = new Hx(4).attachTo(title_col);
        h_title.addClass('text-center mb-3 font-weight-bold text-primary')

        this.title = new Text().attachTo(h_title);

        this.setTitle(_title);
        
    }

    setTitle(_title) {
        this.title.dom.innerHTML = _title;
        this.value = _title;
    }

    getTitle() {
        return this.value;
    }
}
