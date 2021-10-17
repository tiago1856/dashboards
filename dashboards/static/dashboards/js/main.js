

import { Context } from './Context.js';
// MODALS
import { ErrorModal } from './modals/ErrorModal.js';
import { AreYouSureModal } from './modals/AreYouSureModal.js';
import { WarningModal } from './modals/WarningModal.js';
// TEMPORAL
import { DataRangePicker } from './temporal/DataRangePicker.js';

import { Layout } from './layouts/Layout.js';

import { MSG_OVERRIDE_LAYOUT } from './constants.js';


// -----------------
// --- CONSTANTS ---
// -----------------

const MODALS_CONTAINER = $('#modals-container');
const SAVE_BTN = $('#save-btn');

// ---------------------------
// --- CONTEXT AND GLOBALS ---
// ---------------------------

let context = new Context();
let layout = null;


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




// ----------------
// TOP ROW ACTIONS
// ----------------

// ENTER EDIT MODE
$('#edit-btn').on('click',function() {
    $('.editable-component').show();
    $('.non-editable-component').hide();
    context.edit_mode = true;
})

// EXIT EDIT MODE
$('#edit-apply-btn').on('click',function() {
    $('.editable-component').hide();
    $('.non-editable-component').show();    
    context.edit_mode = false;
})

$('#layout-choice-btn').on('click',function() {
    $('#layout-selection-modal').show();   
})

// -------------
// ACTIONS
// -------------

// NEW LAYOUT CHOICE
$('.layout-choice').on('click', function(e) {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_OVERRIDE_LAYOUT, () => {
            newLayout($(this).attr('data-id'));
        });
    } else {
        newLayout($(this).attr('data-id'));
    }
});


// -------------
// INIT
// -------------


const date_interval = new DataRangePicker('#daterange-btn', (start, end) => {
    $('#date-interval').html(start + ' - ' + end);
    context.date_start = start;
    context.date_end = end;  
    context.signals.onGlobalData.dispatch(start, end);
})

$(function(){
    // default date: last month
    const interval = date_interval.getDate();
    $('#date-interval').html(interval[0] + ' - ' + interval[1]);
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

function newLayout(layout_id) {
    $('#layout-selection-modal').hide();
    $(layout.dom).remove();
    layout = new Layout(context, layout_id, null);
    $('.editable-component').show();
}