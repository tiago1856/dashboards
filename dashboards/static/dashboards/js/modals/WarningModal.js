
import { Hx, Div, Img } from '../builders/BuildingBlocks.js';
import { Modal } from './Modal.js';
import { WARNING_IMAGE } from  '../urls.js';


/**
 * Modal for displaying warning messages.
 */
export class WarningModal extends Modal { 

    /**
     * Constructor.
     * @param {string} title Title of the modal.
     * @param {string} help_text Helper text.
     */
    constructor() {
        super('ATENÇÃO!');

        this.modal_header.addClass('bg-warning');
        this.ok_btn.removeClass('btn-primary');
        this.ok_btn.addClass('btn-warning');        


        const row = new Div().attachTo(this.modal_body);
        row.addClass('row');
        const img_col = new Div().attachTo(row);
        img_col.addClass('col-2');
        //img_col.addClass('my-auto');  // vertically center
        const question_img = new Img(WARNING_IMAGE, 64, 64).attachTo(img_col);
        question_img.addClass('mx-auto d-block');

        const msg_col = new Div().attachTo(row);
        msg_col.addClass('col-10');

        this.message = new Hx(4).attachTo(msg_col);
    }

    show(msg) {
      console.error(msg);
      this.message.setTextContent(msg);
      super.show();
    }

  }