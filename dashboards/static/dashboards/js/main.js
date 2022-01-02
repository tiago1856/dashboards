

import { Context } from './Context.js';
import { ErrorModal } from './modals/ErrorModal.js';
import { AreYouSureModal } from './modals/AreYouSureModal.js';
import { WarningModal } from './modals/WarningModal.js';
import { DataRangePicker } from './temporal/DataRangePicker.js';
import { Layout } from './layouts/Layout.js';
import { 
    MSG_OVERRIDE_LAYOUT, 
    MSG_NO_SAVE 
} from './messages.js';
import { EditComponentModal } from './EditComponentModal.js';

// -----------------
// --- CONSTANTS ---
// -----------------

const MODALS_CONTAINER = $('#modals-container');
const LAYOUT_SELECTION_MODAL = $('#layout-selection-modal');
const DATE_INTERVAL = $('#date-interval');

const ZOOM_MODAL = $('#zoom-modal');
const SAVE_BTN = $('#save-btn');
const EDIT_BTN = $('#edit-btn');
const EDIT_APPLY_BTN = $('#edit-apply-btn');
const OPEN_DASHBOARD_BTN = $('#open-btn');
const DISPLAY_LAYOUT_MODAL = $('#layout-choice-btn');
const LOCATION_BTN = $('#location-btn');
const PRINT_BTN = $('#print-btn');
const NEW_BTN = $('#new-btn');
const CONNECTIONS_BTN = $('#network-btn');
const DELETE_BTN = $('#delete-btn');
const SWAP_BTN = $('#swap-btn');

const PAGE_URL = '/dashboards';
const SELECTABLE_COMPONENTS = '.editable-component';
const NON_SELECTABLE_COMPONENTS = '.non-editable-component';
const DATARANGE_BTN_ID = '#daterange-btn';
const LAYOUT_CHOICE = '.layout-choice';

// ---------------------------
// --- CONTEXT AND GLOBALS ---
// ---------------------------

/**
 * THE CONTEXT - USED AS A GLOBAL OBJECT
 */
const context = new Context();

/**
 * HOLDS THE CURRENT LAYOUT
 */
let layout = null;



// ------------------------------
// --- MAIN AND GLOBAL MODALS ---
// ------------------------------

/**
 * EDIT COMPONENT MODAL
 */
const edit_component_modal = new EditComponentModal(context);


/**
* ERROR MODAL.
* TRIGGERED BY THE ONERROR SIGNAL.
*/
const error_modal = new ErrorModal().attachTo(MODALS_CONTAINER[0]);

/**
 * ARE YOU SURE MODAL.
 * TRIGGERED BY THE ONAYS SIGNAL.
 */
const ays_modal = new AreYouSureModal().attachTo(MODALS_CONTAINER[0]);


/**
 * WARNING MODAL.
 * TRIGGERED BY THE ONWARNING SIGNAL.
 */
 const warning_modal = new WarningModal().attachTo(MODALS_CONTAINER[0]);



// -----------------
// --- LISTENERS ---
// -----------------

context.signals.onError.add((msg, origin=null) => {
    error_modal.show(msg);
    console.error((origin?origin:'') + msg);
});

context.signals.onAYS.add((text, ok_callback, cancel_callback) => {
    ays_modal.show(text, ok_callback, cancel_callback);
});

context.signals.onWarning.add((text) => {
    warning_modal.show(text);
});

context.signals.onChanged.add(() => {
    changeSaveStatus(true);
});

context.signals.onZoomComponent.add((msg) => {
    ZOOM_MODAL.modal('show');
});

context.signals.onEditComponent.add((spot) => {
    const component = layout.getComponentAt(spot);
    edit_component_modal.show(component, () => {
        component.update();
    });
    /*
    edit_component_modal.show(component.data, () => {
        component.update();
    });
    */
});

/*
context.signals.onVisualizationSelected.add((selected_id) => {
    $('.cdc-config-panel').hide();
    switch(selected_id) {
        case 'data-visualization-graph-1-num': 
            $("[data-vis='G1N'").show();
            break;
        case 'data-visualization-graph-double-num': 
            $("[data-vis='GDN'").show();
            break;
    }
});
*/


// ----------------
// TOP ROW ACTIONS
// ----------------

// ENTERS EDIT MODE
EDIT_BTN.on('click',function() {
    $(SELECTABLE_COMPONENTS).show();
    $(NON_SELECTABLE_COMPONENTS).hide();
    context.edit_mode = true;
})

// EXITS EDIT MODE
EDIT_APPLY_BTN.on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_NO_SAVE, () => {
            exitEditMode()
        });
    } else {
        exitEditMode();
    }
})

// OPENS DASHBOARD
OPEN_DASHBOARD_BTN.on('click',function() {
})

// NEW LAYOUT
DISPLAY_LAYOUT_MODAL.on('click',function() {
    LAYOUT_SELECTION_MODAL.modal('show')
})

// NEW GLOBAL LOCATION
LOCATION_BTN.on('click',function() {
});

// PRINT DASHBOARD
PRINT_BTN.on('click',function() {
});

// SAVE DASHBOARD
SAVE_BTN.on('click',function() {
});

// NEW DASHBOARD
NEW_BTN.on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_NO_SAVE, () => {
            window.location.replace(PAGE_URL);   
        });
    } else {
        window.location.replace(PAGE_URL); 
    }
});


// SET COMPONENTS CONNECTORS
CONNECTIONS_BTN.on('click',function() {
});

// DELETE CURRENT DASHBOARD
DELETE_BTN.on('click',function() {
});

// SWAP COMPONENTS POSITION
SWAP_BTN.on('click',function() {
});

// -------------
// ACTIONS
// -------------

// NEW LAYOUT CHOICE
$(LAYOUT_CHOICE).on('click', function(e) {
    LAYOUT_SELECTION_MODAL.modal('hide');
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_OVERRIDE_LAYOUT, () => {
            newLayout($(this).attr('data-id'));
            EDIT_BTN.trigger('click');
        });
    } else {
        newLayout($(this).attr('data-id'));
        EDIT_BTN.trigger('click');
    }
});



// -------------
// INIT
// -------------


const date_interval = new DataRangePicker(DATARANGE_BTN_ID, (start, end) => {
    DATE_INTERVAL.html(start + ' - ' + end);
    context.date_start = start;
    context.date_end = end;  
    context.signals.onGlobalData.dispatch(start, end);
})

$(function(){
    // default date: last month
    const interval = date_interval.getDate();
    DATE_INTERVAL.html(interval[0] + ' - ' + interval[1]);
    context.date_start = interval[0];
    context.date_end = interval[1];
});




layout = new Layout(context, 'LA2');




// -------------
// SAVE BUTTON
// -------------

function changeSaveStatus(new_status) {
    context.changed = new_status;
    if (new_status) {
        SAVE_BTN.removeClass('btn-outline-secondary').addClass('btn-danger');
    } else {
        SAVE_BTN.removeClass('btn-danger').addClass('btn-outline-secondary');
    }
}

function exitEditMode() {
    $(SELECTABLE_COMPONENTS).hide();
    $(NON_SELECTABLE_COMPONENTS).show();

    context.edit_mode = false;
}



function newLayout(layout_id) {
    $(layout.dom).remove();
    layout = new Layout(context, layout_id, null);
    $(SELECTABLE_COMPONENTS).show();
}