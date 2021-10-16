

import { Context } from './Context.js';
// MODALS
import { ErrorModal } from './modals/ErrorModal.js';
import { AreYouSureModal } from './modals/AreYouSureModal.js';
import { WarningModal } from './modals/WarningModal.js';
// TEMPORAL
import { DataRangePicker } from './temporal/DataRangePicker.js';

import { Layout } from './layouts/Layout.js';



// -----------------
// --- CONSTANTS ---
// -----------------

const MODALS_CONTAINER = document.getElementById('modals-container');


// ---------------
// --- CONTEXT ---
// ---------------
let context = new Context();


// ------------------------------
// --- MAIN AND GLOBAL MODALS ---
// ------------------------------

/**
* Error modal.
* Triggered by onError signal.
*/
const error_modal = new ErrorModal().attachTo(MODALS_CONTAINER);

/**
 * Are you sure modal.
 * Triggered by onAYS signal.
 */
const ays_modal = new AreYouSureModal().attachTo(MODALS_CONTAINER);


/**
 * Global warning modal.
 * Triggered by onWarning signal.
 */
 const warning_modal = new WarningModal().attachTo(MODALS_CONTAINER);



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



// -------------
// SETUP
// -------------

const date_interval = new DataRangePicker('#daterange-btn', (start, end) => {
    $('#date-interval').html(start + ' - ' + end);
    context.date_start = start;
    context.date_end = end;  
    context.signals.onGlobalData.dispatch(start, end);
  })

// -------------
// INIT
// -------------

$(function(){
    // default date: last month
    const interval = date_interval.getDate();
    $('#date-interval').html(interval[0] + ' - ' + interval[1]);
    context.date_start = interval[0];
    context.date_end = interval[1];
});


$('#edit-btn').on('click',function() {
    $('.editable-component').show();
})
$('#edit-apply-btn').on('click',function() {
    $('.editable-component').hide();
})


const layout = new Layout(context, 'LE2');
