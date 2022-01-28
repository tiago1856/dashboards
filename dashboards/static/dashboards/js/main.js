

import { Context } from './Context.js';
import { ErrorModal } from './modals/ErrorModal.js';
import { AreYouSureModal } from './modals/AreYouSureModal.js';
import { WarningModal } from './modals/WarningModal.js';
import { DataRangePicker } from './temporal/DataRangePicker.js';
import { Dashboard } from './dashboards/Dashboard.js';
import { 
    MSG_OVERRIDE_LAYOUT, 
    MSG_NO_SAVE,
    MSG_DELETE_DASHBOARD
} from './messages.js';
import { EditComponentModal } from './modals/EditComponentModal.js';
import { SelectComponentModal } from './modals/SelectComponentModal.js';
import { SelectDashboardModal } from './modals/SelectDashboardModal.js';
import { DashboardPropertiesModal } from './modals/DashboardPropertiesModal.js';
import { LayoutSelectionModal } from './modals/LayoutSelectionModal.js';
import { LayoutEditorModal } from './modals/LayoutEditorModal.js';
import { fetchGET } from "./Fetch.js";
import { 
    URL_GET_DASHBOARD
} from "./urls.js";




// -----------------
// --- CONSTANTS ---
// -----------------

const MODALS_CONTAINER = $('#modals-container');
const DATE_INTERVAL = $('#date-interval');

const ZOOM_MODAL = $('#zoom-modal');
const DASHBOARD_SAVE_BTN = $('#save-btn');
const DASHBOARD_EDIT_BTN = $('#edit-btn');
const EDIT_APPLY_BTN = $('#edit-apply-btn');
const DASHBOARD_OPEN_BTN = $('#open-btn');
const DISPLAY_LAYOUT_MODAL = $('#layout-choice-btn');
const LOCATION_BTN = $('#location-btn');
const DASHBOARD_PRINT_BTN = $('#print-btn');
const DASHBOARD_NEW_BTN = $('#new-btn');
const DASHBOARD_CONNECTIONS_BTN = $('#network-btn');
const DASHBOARD_DELETE_BTN = $('#delete-btn');
const SWAP_BTN = $('#swap-btn');



const PAGE_URL = '/dashboards';
const SELECTABLE_COMPONENTS = '.editable-component';
const NON_SELECTABLE_COMPONENTS = '.non-editable-component';
const DATARANGE_BTN_ID = '#daterange-btn';


// ---------------------------
// --- CONTEXT AND GLOBALS ---
// ---------------------------

/**
 * THE CONTEXT - USED AS A GLOBAL OBJECT
 */
const context = new Context();

/**
 * HOLDS THE CURRENT DASHBOARD
 */
let dashboard = null;



// ------------------------------
// --- MAIN AND GLOBAL MODALS ---
// ------------------------------

/**
 * EDIT COMPONENT MODAL
 */
const edit_component_modal = new EditComponentModal(context);

/**
 * SELECT COMPONENT MODAL
 */

const select_component_modal = new SelectComponentModal(context);

/**
 * SELECT DASHBOARD MODAL
 */

 const select_dashboard_modal = new SelectDashboardModal(context);

 /**
 * SELECT DASHBOARD MODAL
 */
const dashboard_properties_modal = new DashboardPropertiesModal(context);


 /**
 * SELECT LAYOUT MODAL
 */
const layout_selection_modal = new LayoutSelectionModal(context);


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


/**
 * LAYOUT EDITOR MODAL
 */
 const layout_editor_modal = new LayoutEditorModal(context);

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
    console.log("somethiognv cjhanged");
    changeSaveStatus(true);
});

context.signals.onZoomComponent.add((msg, body) => {
    ZOOM_MODAL.modal('show');
    /*
    $("#zoom-modal-body").empty();
    $(body.dom).clone().appendTo($("#zoom-modal-body"))
    */
});

context.signals.onEditComponent.add((spot, original_type) => {
    const component = dashboard.getComponentAt(spot);
    edit_component_modal.show(component, () => {
        if (component.data.component_type === 'INFO' && original_type !== 'INFO') {
            const new_comp = dashboard.changeComponentContainer(spot, true);
            new_comp.update();
        } else if (component.data.component_type !== 'INFO' && original_type === 'INFO') {
            const new_comp = dashboard.changeComponentContainer(spot, false);
            new_comp.update();
        } else {           
            component.update();
        }       
    });
});

context.signals.onLoadComponent.add((spot) => {
    select_component_modal.show((component_id => {
        dashboard.loadComponent(spot, component_id);
    }));
});


context.signals.onLayoutEditor.add((spot) => {
    layout_editor_modal.show((new_layout_id) => {
        dashboard = new Dashboard(context, new_layout_id, null, true);
    });
});

// ----------------
// TOP ROW ACTIONS
// ----------------

// ENTERS EDIT MODE
DASHBOARD_EDIT_BTN.on('click',function() {
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
DASHBOARD_OPEN_BTN.on('click',function() {
    select_dashboard_modal.show((dash_id) => {
        console.log("load dash > ", dash_id);

        $("body").css("cursor","progress");
        fetchGET(URL_GET_DASHBOARD + dash_id, 
            (result) => {                
                $("body").css("cursor","auto");
                console.log(result);
                dashboard = new Dashboard(context, result.layout, result);
            },
            (error) => {
                $("body").css("cursor","auto");
                context.signals.onError.dispatch(error,"[main::DASHBOARD_OPEN_BTN]");                
            }
        );

        //dashboard = new Dashboard(context, dashboard_id, null);        

    });
})

// NEW LAYOUT
DISPLAY_LAYOUT_MODAL.on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_OVERRIDE_LAYOUT, () => {
            layout_selection_modal.show((selection) => {
                newDashboard(selection, true);
                DASHBOARD_EDIT_BTN.trigger('click');
            })
        });
    } else {
        layout_selection_modal.show((selection) => {
            newDashboard(selection, true);
            DASHBOARD_EDIT_BTN.trigger('click');
        })        
    }
})

// NEW GLOBAL LOCATION
LOCATION_BTN.on('click',function() {
});

// PRINT DASHBOARD
DASHBOARD_PRINT_BTN.on('click',function() {
});

// SAVE DASHBOARD
DASHBOARD_SAVE_BTN.on('click',function() {
    dashboard_properties_modal.show(dashboard, () => {
        console.log("DASHBOARD SAVED");
    });
});

// NEW DASHBOARD
DASHBOARD_NEW_BTN.on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_NO_SAVE, () => {
            window.location.replace(PAGE_URL);   
        });
    } else {
        window.location.replace(PAGE_URL); 
    }
});


// SET COMPONENTS CONNECTORS
DASHBOARD_CONNECTIONS_BTN.on('click',function() {
});

// DELETE CURRENT DASHBOARD
DASHBOARD_DELETE_BTN.on('click',function() {
    if (!dashboard.id) return;
    context.signals.onAYS.dispatch(MSG_DELETE_DASHBOARD, () => {
        dashboard.delete(() => {
            dashboard = new Dashboard(context, 2, null, true);
        });
    });
});

// SWAP COMPONENTS POSITION
SWAP_BTN.on('click',function() {
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




dashboard = new Dashboard(context, 2);



// -------------
// SAVE BUTTON
// -------------

function changeSaveStatus(new_status) {
    context.changed = new_status;
    if (new_status) {
        DASHBOARD_SAVE_BTN.removeClass('btn-outline-secondary').addClass('btn-danger');
    } else {
        DASHBOARD_SAVE_BTN.removeClass('btn-danger').addClass('btn-outline-secondary');
    }
}

function exitEditMode() {
    $(SELECTABLE_COMPONENTS).hide();
    $(NON_SELECTABLE_COMPONENTS).show();
    context.edit_mode = false;
}



function newDashboard(dashboard_id, edit_mode = false) {
    dashboard = new Dashboard(context, dashboard_id, null, edit_mode);
    $(SELECTABLE_COMPONENTS).show();
}