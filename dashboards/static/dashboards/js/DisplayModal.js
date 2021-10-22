/**
 * DISPLAY MODAL
 */


const DISPLAY_MODAL = $('#display-modal');
const TYPE_SELECTION_BTN= $('.display-modal-type-selection-btn');

const TYPE_SELECTION_TABLE_BTN = $('#display-modal-type-table');
const TYPE_SELECTION_LIST_BTN = $('#display-modal-type-list');
const TYPE_SELECTION_GEO_BTN = $('#display-modal-type-geo');
const TYPE_SELECTION_MATRIX_BTN = $('#display-modal-type-matrix');
const TYPE_SELECTION_GRAPH_BTN = $('#display-modal-type-graph');
const TYPE_SELECTION_GRAPH3AXIS_BTN = $('#display-modal-type-graph3axis');
const TYPE_SELECTION_INFO_BTN = $('#display-modal-type-info');

export function DisplayModal(context) {

    this.context = context;
    const self = this;


    // on modal show, fetch all available queries
    DISPLAY_MODAL.on('show.bs.modal', function (e) {        
    })


    // on selecting a display type, highlight it
    TYPE_SELECTION_BTN.on('click', function() {
        if($(this).hasClass('active')) {
        }
        TYPE_SELECTION_BTN.removeClass('active');
        TYPE_SELECTION_BTN.addClass('not-active');
        if(!$(this).hasClass('active')) {            
            $(this).addClass('active');
            $(this).removeClass('not-active');
        }
    })

}

DisplayModal.prototype = {

}