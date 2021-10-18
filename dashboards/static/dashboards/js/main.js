

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
import { DataSourceModal } from './DataSourceModal.js';

// -----------------
// --- CONSTANTS ---
// -----------------

const MODALS_CONTAINER = $('#modals-container');
const SAVE_BTN = $('#save-btn');
const LAYOUT_SELECTION_MODAL = $('#layout-selection-modal');
const DATA_SOURCE_MODAL = $('#data-source-modal');
const DATE_INTERVAL = $('#date-interval');
const DATA_SOURCE_SELECTION = $('#data-source-selection-ok-btn');

const SELECTABLE_COMPINENTS = '.editable-component';
const NON_SELECTABLE_COMPINENTS = '.non-editable-component';

const PAGE_URL = '/dashboards';

// ---------------------------
// --- CONTEXT AND GLOBALS ---
// ---------------------------

const context = new Context();
let layout = null;

const datasourcemodal = new DataSourceModal(context);

// ------------------------------
// --- MAIN AND GLOBAL MODALS ---
// ------------------------------

/**
* Error modal.
* Triggered by onError signal.
*/
const error_modal = new ErrorModal().attachTo(MODALS_CONTAINER[0]);

/**
 * Are you sure modal.
 * Triggered by onAYS signal.
 */
const ays_modal = new AreYouSureModal().attachTo(MODALS_CONTAINER[0]);


/**
 * Global warning modal.
 * Triggered by onWarning signal.
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

context.signals.onEditComponent.add(() => {
    onEditComponent(true);
});




// ----------------
// TOP ROW ACTIONS
// ----------------

// ENTER EDIT MODE
$('#edit-btn').on('click',function() {
    $(SELECTABLE_COMPINENTS).show();
    $(NON_SELECTABLE_COMPINENTS).hide();
    context.edit_mode = true;
})

// EXIT EDIT MODE
$('#edit-apply-btn').on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_NO_SAVE, () => {
            exitEditMode()
        });
    } else {
        exitEditMode();
    }
})

// OPEN DASHBOARD
$('#open-btn').on('click',function() {
})

// NEW LAYOUT
$('#layout-choice-btn').on('click',function() {
    LAYOUT_SELECTION_MODAL.show();   
})


// NEW GLOBAL LOCATION
$('#location-btn').on('click',function() {
});

// PRINT DASHBOARD
$('#print-btn').on('click',function() {
});

// SAVE DASHBOARD
$('#save-btn').on('click',function() {
});

// NEW DASHBOARD
$('#new-btn').on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_NO_SAVE, () => {
            window.location.replace(PAGE_URL);   
        });
    } else {
        window.location.replace(PAGE_URL); 
    }
});


// SET COMPONENTS CONNECTORS
$('#network-btn').on('click',function() {
});

// DELETE CURRENT DASHBOARD
$('#delete-btn').on('click',function() {
});

// SWAP COMPONENTS POSITION
$('#swap-btn').on('click',function() {
});

// -------------
// ACTIONS
// -------------

// NEW LAYOUT CHOICE
$('.layout-choice').on('click', function(e) {
    LAYOUT_SELECTION_MODAL.hide();
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_OVERRIDE_LAYOUT, () => {
            newLayout($(this).attr('data-id'));
        });
    } else {
        newLayout($(this).attr('data-id'));
    }
});


DATA_SOURCE_SELECTION.on('click', function(e) {
    DATA_SOURCE_MODAL.modal('hide');
});


// -------------
// INIT
// -------------


const date_interval = new DataRangePicker('#daterange-btn', (start, end) => {
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
setTimeout(function(){ DATA_SOURCE_MODAL.modal('show');; }, 500);



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
    $(SELECTABLE_COMPINENTS).hide();
    $(NON_SELECTABLE_COMPINENTS).show();

    context.edit_mode = false;
}

function onEditComponent() {
    DATA_SOURCE_MODAL.modal('show');
}

function newLayout(layout_id) {
    $(layout.dom).remove();
    layout = new Layout(context, layout_id, null);
    $(SELECTABLE_COMPINENTS).show();
}