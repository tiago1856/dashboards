/**
 * DISPLAY MODAL
 */


const DISPLAY_MODAL = $('#display-modal');
const TYPE_SELECTION_BTN= $('.display-modal-graph-type-selection-btn');



export function DisplayModal(context) {

    this.context = context;
    const self = this;


    // on modal show, fetch all available queries
    DISPLAY_MODAL.on('show.bs.modal', function (e) {        
    })


    // on selecting a graph type, highlight it
    TYPE_SELECTION_BTN.on('click', function() {
        TYPE_SELECTION_BTN.removeClass('active');
        $(this).addClass('active');
    })
  

}

DisplayModal.prototype = {

}