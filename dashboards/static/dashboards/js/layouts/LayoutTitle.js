

import { Div, Hx, Text } from '../builders/BuildingBlocks.js';
import { EditButton } from '../builders/EditButton.js';
import { TextInputEv } from '../builders/TextInputEv.js';
import { NO_DASHBOARD_TITLE_DEFINED } from '../constants.js';

/**
 * Dashboard Title.
 */
export class LayoutTitle extends Div {
    /**
     * Constructor.
     * @param {Context} context Context.
     * @param {string} _title Dashboard Title.
     * @param {function} onTitleChanged Called when title is set/changed.
     */
    constructor(context, _title = null, onTitleChanged = null) {
        super();

        const self = this;
        this.value = null;
        this.context = context;
        this.onTitleChanged = onTitleChanged;

        this.addClass('LayoutTitle');
        this.addClass('row');
        const title_col = new Div().attachTo(this);
        title_col.addClass('col');
        const h_title = new Hx(3).attachTo(title_col);
        h_title.addClass('text-center mb-3 font-weight-bold')

        this.title = new Text().attachTo(h_title);

        this.setTitle(_title);
        

        const edit_btn = new EditButton(() => {
            $(self.title.dom).hide();
            $(edit_btn.dom).hide();
            const title_input = new TextInputEv((new_title) => {
                self.setTitle(new_title);
                if (title_input.dom.parentNode) title_input.detach();
                $(self.title.dom).show();
                $(edit_btn.dom).show();
                context.signals.onChanged.dispatch();
            }).attachTo(h_title);
            title_input.setValue(this.value);
            title_input.dom.focus();
        }).attachTo(h_title);
        
    }

    setTitle(_title) {
        if (_title) {
            this.title.dom.innerHTML = _title;
            this.value = _title;
        } else {
            this.title.dom.innerHTML = NO_DASHBOARD_TITLE_DEFINED;
            this.value = null;
        }
        if (this.onTitleChanged) this.onTitleChanged(this.value);
        //this.context.name = this.value;
    }

    getTitle() {
        return this.value;
    }
}
