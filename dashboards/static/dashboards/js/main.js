
import { Context } from './Context.js';
import { ErrorModal } from './modals/ErrorModal.js';
import { AreYouSureModal } from './modals/AreYouSureModal.js';
import { WarningModal } from './modals/WarningModal.js';
import { DataRangePicker } from './temporal/DataRangePicker.js';
import { Dashboard } from './dashboards/Dashboard.js';
import { 
    MSG_OVERRIDE_LAYOUT, 
    MSG_NO_SAVE,
    MSG_DELETE_CURRENT_DASHBOARD,
    MSG_SAVE_DASH,
    MSG_PIN_DASH,
    MSG_NO_DATA_2_EXPORT,
    MSG_EXPORT_ERROR,
} from './messages.js';
import { EditComponentModal } from './modals/EditComponentModal.js';
import { SelectComponentModal } from './modals/SelectComponentModal.js';
import { SelectDashboardModal } from './modals/SelectDashboardModal.js';
import { DashboardPropertiesModal } from './modals/DashboardPropertiesModal.js';
import { LayoutSelectionModal } from './modals/LayoutSelectionModal.js';
import { LayoutEditorModal } from './modals/LayoutEditorModal.js';
import { fetchGET, fetchPOST } from "./Fetch.js";
import { 
    URL_GET_DASHBOARD,
    URL_SAVE_CONFIG,
    URL_GET_CONFIG,
    URL_SAVE_DASHBOARD,
    URL_DELETE_DASHBOARD, 
    URL_SAVE_SNAPSHOT,
    URL_GET_SNAPSHOT,
} from "./urls.js";
import { IconsModal } from './modals/IconsModal.js';
import { SaveSnapshotModal } from './modals/SaveSnapshotModal.js';
import { SelectSnapshotModal } from './modals/SelectSnapshotModal.js';
import { exportObject2Excel } from './export/ExcelCsv.js';

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
const DASHBOARD_NEW_BTN = $('#new-btn');
const DASHBOARD_DELETE_BTN = $('#delete-btn');
const SWAP_BTN = $('#swap-btn');
const PIN_DASH_BTN = $('#pin-dash-btn');
const DASH_EDIT_TAB = $('#dash-edit-tab');
const COMMS_BTN = $('#comms-btn');
const EXIT_COMMS_BTN = $('#exit-comms-btn');
const COMMS_SCREEN = $('#comms-tab-content');
const LAYOUT_SCREEN = $('#layout-tab-content');
const BRUSH_BTN = $('#brush-btn');
const SAVE_SNAPSHOT_BTN = $('#snapshot-save-btn');
const SELECT_SNAPSHOT_BTN = $('#snapshot-select-btn');

const DASH_PRINT = $('#dash-print');
const DASH_PDF = $('#dash-pdf');
const DASH_IMAGE = $('#dash-image');
const DASH_EXCEL = $('#dash-excel');

const PAGE_URL = '/dashboards';
const SELECTABLE_COMPONENTS = '.editable-component';
const NON_SELECTABLE_COMPONENTS = '.non-editable-component';

const DEFAULT_LAYOUT = 2;   // if doesn't exists => fetch first | error


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

let new_dash = false;    // new dashboard?

// to copy/paste options between components
let brush_on = false;   // copy/paste options 
let options_2_copy = null;
let brush_from = null;  // options are from which component?

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
 * SNAPSHOT SAVE MODAL
 */
const save_snapshot_modal = new SaveSnapshotModal(context);

/**
 * SNAPSHOT SELECT MODAL
 */
const snapshot_select_modal = new SelectSnapshotModal(context);


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



/**
 * ICON SELECTION MODAL
 */
const icons_modal = new IconsModal(context);

/**
 * GLOBAL DATE INTERVAL PICKER
 */
 const date_interval = new DataRangePicker(context, (start, end) => {
    DATE_INTERVAL.html(start + ' - ' + end);
    context.date_start = start;
    context.date_end = end;
    console.log(start, end);
    //context.signals.onGlobalData.dispatch(start, end);
})


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
    edit_component_modal.show(component, (relevant_changed, non_relevant_changed) => {
        if ((component.data.component_type === 'INFO' ||  component.data.component_type === 'CONTROL')
            && (original_type !== 'INFO' && original_type !== 'CONTROL')) {
                dashboard.changeComponentContainer(spot, true);
        } else if ((component.data.component_type !== 'INFO' && component.data.component_type !== 'CONTROL')
            && (original_type === 'INFO' || original_type === 'CONTROL')) {
                dashboard.changeComponentContainer(spot, false);
        } else {
            // only update component if something changed
            if (relevant_changed) component.setContent().then(() => {
                component.setOptions();
            });
        }
        if (relevant_changed || non_relevant_changed) {
            context.signals.onChanged.dispatch();
            component.setChanged(true);
        }
    });
});

context.signals.onLoadComponent.add((spot) => {
    const current_component_uuid = dashboard.getComponentAt(spot).data.uuid;
    select_component_modal.show((component_id => {
        dashboard.loadComponent(spot, component_id, true).then(() => {
            // consider loading a new component as a complete new one => remove the old one
            // from comms
            dashboard.comms.deleteComponent(current_component_uuid);
        });
    }));
});


context.signals.onLayoutEditor.add((spot) => {
    layout_editor_modal.show((new_layout_id) => {
        if (dashboard) dashboard.clear();
        setSnapshotMode(false);
        dashboard = new Dashboard(context, new_layout_id, null);
        dashboard.init();
    });
});


context.signals.onIconSelectionModal.add((current, onSelection = null) => {
    icons_modal.show(current, onSelection);
});



context.signals.onComponentClicked.add(component => {
    // brush not active
    if (!brush_on) return;
    // get the options to copy
    if (!options_2_copy) {
        options_2_copy = component.getOptions();
        brush_from = component.getUUID();
        component.addClass('brush-component-selected');
        return;
    }
    // don't apply to the same component
    if (brush_from == component.getUUID()) return;
    // apply the copied options to the component
    component.setOptions(options_2_copy);
})

context.signals.onDashboardDeleted.add(deleted_dashboard_id => {
    if (dashboard.id == deleted_dashboard_id) {
        window.location.replace(PAGE_URL);
    }    
});
    

// ----------------
// TOP ROW ACTIONS
// ----------------

// ENTER COMMS SCREEN
COMMS_BTN.on('click', function() {
    LAYOUT_SCREEN.removeClass('d-block').addClass('d-none');
    COMMS_SCREEN.removeClass('d-none').addClass('d-block');

    setTimeout(() => {
        dashboard.comms.repaint();
    }, 50);
    
})

// EXITS COMMS SCREEN
EXIT_COMMS_BTN.on('click', function() {
    COMMS_SCREEN.removeClass('d-block').addClass('d-none');
    LAYOUT_SCREEN.removeClass('d-none').addClass('d-block');
})


// ENTERS EDIT MODE
DASHBOARD_EDIT_BTN.on('click',function() {
    enterEditMode(true);
})

// EXITS EDIT MODE
EDIT_APPLY_BTN.on('click',function() {
    enterEditMode(false);
})

// OPENS DASHBOARD
DASHBOARD_OPEN_BTN.on('click',function() {
    select_dashboard_modal.show((dash_id) => {
        // already opened?
        //if (dash_id == dashboard.id) return;

        console.log("load dash > ", dash_id);

        getDashboard(dash_id, (result) => {
            changeSaveStatus(false);
            if (dashboard) dashboard.clear();
            setSnapshotMode(false);
            dashboard = new Dashboard(context, result.layout, result);
            dashboard.init().then(() => {
                date_interval.setFormat(result.date_format, false);
            });
        });
    });
})

// NEW LAYOUT
DISPLAY_LAYOUT_MODAL.on('click',function() {
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_OVERRIDE_LAYOUT, () => {
            layout_selection_modal.show(dashboard.layout_id, (selection) => {
                newDashboard(selection/*, true*/);                
            })
        });
    } else {
        layout_selection_modal.show(dashboard.layout_id,(selection) => {
            newDashboard(selection/*, true*/);            
        })        
    }
})

// NEW GLOBAL LOCATION
LOCATION_BTN.on('click',function() {
});


// SAVE DASHBOARD
DASHBOARD_SAVE_BTN.on('click',function() {
    dashboard_properties_modal.show(dashboard, () => {
        saveDashboard((result) => {
            console.log("DASHBOARD SAVED");
            changeSaveStatus(false);
        });
    })
});

// NEW DASHBOARD
DASHBOARD_NEW_BTN.on('click',function() {
    localStorage.setItem("dash_new", true); 
    if (context.changed) {
        context.signals.onAYS.dispatch(MSG_NO_SAVE, () => {
            window.location.replace(PAGE_URL);   
        });
    } else {
        window.location.replace(PAGE_URL); 
    }
});



// DELETE CURRENT DASHBOARD
DASHBOARD_DELETE_BTN.on('click',function() {
    if (!dashboard.id) return;
    context.signals.onAYS.dispatch(MSG_DELETE_CURRENT_DASHBOARD, () => {
        deleteDashboard(dashboard.id, () => {
            context.signals.onDashboardDeleted.dispatch(dashboard.id);
            //window.location.replace(PAGE_URL);
        });
    });
});

// SWAP COMPONENTS POSITION
SWAP_BTN.on('click',function() {
});


// PIN CURRENT DASHBOARD
// when dashboard view opens, 
// the pin dashboard will be loaded and displayed
PIN_DASH_BTN.on('click',function() {
    // only save if dashboard exists in db
    if (dashboard.id) {
        context.signals.onAYS.dispatch(MSG_PIN_DASH, () => {
            saveConfig(() => {})
        })        
    } else {
        context.signals.onWarning.dispatch(MSG_SAVE_DASH);
    }
});

BRUSH_BTN.on('click',function() {   
    if (!brush_on) {    
        brush_on = true;
        BRUSH_BTN.addClass('btn-outline-danger pulsate-opacity-scale');
    } else {
        brush_on = false;
        options_2_copy = null;
        brush_from = null;
        BRUSH_BTN.removeClass('btn-outline-danger pulsate-opacity-scale');
        $('.Component').removeClass('brush-component-selected');
    }
});

SAVE_SNAPSHOT_BTN.on('click',function() {
    save_snapshot_modal.show((name, description) => {
        saveSnapshot(name, description, (result) => {
        });
    });
});

SELECT_SNAPSHOT_BTN.on('click',function() {
    snapshot_select_modal.show((snapshot_id) => {
        getSnapshot(snapshot_id, (result) => {
            if (dashboard) dashboard.clear();
            setSnapshotMode(true);
            dashboard = new Dashboard(context, result.layout, result);            
            dashboard.init().then(() => {
                date_interval.setFormat(result.date_format, false);
            });
        });

    });
});


DASH_PRINT.on('click',function() {
    window.print();
    //printwin.document.write(document.getElementById("TARGET").innerHTML);
    //printwin.print(); 
});
DASH_PDF.on('click',function() {
});
DASH_IMAGE.on('click',function() {
});
DASH_EXCEL.on('click',function() {
    if (!dashboard) {
        context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
        return;
    }
    const [data, names] = dashboard.getComponentsExportData();
    if (!exportObject2Excel(data, names, dashboard.title ? (dashboard.title + '.xlsx') : 'export.xlsx')) {
        context.signals.onError.dispatch(MSG_EXPORT_ERROR,"[main::DASH_EXCEL]");
    }
});


// -------------
// INIT
// -------------


$(function(){
    // default date: last month
    const interval = date_interval.getDate();
    DATE_INTERVAL.html(interval[0] + ' - ' + interval[1]);
    context.date_start = interval[0];
    context.date_end = interval[1];
});


// INIT - LO
setSnapshotMode(false);
if (localStorage.getItem("dash_new") === null || !localStorage.getItem("dash_new")) {
    localStorage.removeItem("dash_new"); 
    loadConfig((config) => {
        if (config.config !== null) {
            getDashboard(config.dashboard, (result) => {
                if (dashboard) dashboard.clear();
                dashboard = new Dashboard(context, result.layout, result);
                dashboard.init().then(() => {
                    date_interval.setFormat(result.date_format, false);          
                    new_dash = false;
                    changeSaveStatus(false);
                });
            });        
        } else {
            if (dashboard) dashboard.clear();
            dashboard = new Dashboard(context, DEFAULT_LAYOUT, null);
            dashboard.init().then(() => {
                new_dash = true;
                changeSaveStatus(true);
            });
        }
    })
} else {
    if (dashboard) dashboard.clear();
    dashboard = new Dashboard(context, DEFAULT_LAYOUT, null);
    dashboard.init().then(() => {
        new_dash = true;
       // changeSaveStatus(true);
        localStorage.removeItem("dash_new"); 
    });
}
//changeSaveStatus(true);






// -------------
// FUNCTIONS
// -------------

function setSnapshotMode(mode = false) {
    if (mode) {
        PIN_DASH_BTN.attr('disabled', true);
        DASHBOARD_EDIT_BTN.attr('disabled', true);
        SAVE_SNAPSHOT_BTN.attr('disabled', true);
        DASHBOARD_NEW_BTN.attr('disabled', true);
    } else {
        PIN_DASH_BTN.removeAttr('disabled');
        DASHBOARD_EDIT_BTN.removeAttr('disabled');
        SAVE_SNAPSHOT_BTN.removeAttr('disabled');
        DASHBOARD_NEW_BTN.removeAttr('disabled');
    }
}

/**
 * 
 * @param {boolean} new_status 
 */
function changeSaveStatus(new_status) {
    context.changed = new_status;
    if (new_status) {
        DASHBOARD_SAVE_BTN.removeClass('btn-outline-secondary').addClass('btn-danger');
        DASHBOARD_SAVE_BTN.removeAttr('disabled');
    } else {
        DASHBOARD_SAVE_BTN.removeClass('btn-danger').addClass('btn-outline-secondary');        
        DASHBOARD_SAVE_BTN.attr('disabled', true);
    }
}

/**
 * Exits the edit mode.
 */
function enterEditMode(enter=true) {
    if (enter) {
        $(SELECTABLE_COMPONENTS).show();
        $(NON_SELECTABLE_COMPONENTS).hide();
        context.edit_mode = true;
        DASH_EDIT_TAB.removeClass('d-none')
    } else {
        $(SELECTABLE_COMPONENTS).hide();
        $(NON_SELECTABLE_COMPONENTS).show();
        context.edit_mode = false;
        DASH_EDIT_TAB.addClass('d-none')
    }
}


/**
 * Starts a new dashboard.
 * @param {number} layout_id Layout ID.
 * @param {boolean} edit_mode Edit mode?
 */
function newDashboard(layout_id/*, edit_mode = false*/) {
    if (dashboard) dashboard.clear();
    setSnapshotMode(false);
    dashboard = new Dashboard(context, layout_id, null);
    dashboard.init().then(() => {
        $(SELECTABLE_COMPONENTS).show();
        DASHBOARD_EDIT_BTN.trigger('click');
    });
}


/**
 * Loads the last config of this user.
 * TODO: for now it gets the first config (if it exists)
 * @param {function} onReady Called when ready
 */
function loadConfig(onReady = null) {
    $("body").css("cursor","progress");
    fetchGET(URL_GET_CONFIG, 
        (result) => {                
            $("body").css("cursor","auto");
            console.log(result);
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::loadConfig]");
        }
    );
}


/**
 * 
 * @param {function} onReady Called when ready;
 */
function saveConfig(onReady = null) {
    $("body").css("cursor","progress");
    fetchPOST(URL_SAVE_CONFIG,
        {
            dashboard: dashboard.id,
            name: uuidv4(),
        },  
        (result) => {                
            $("body").css("cursor","auto");
            console.log(result);
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::loadConfig]");                
        }
    );
}


/**
 * 
 * @param {number} dash_id Dashboard ID.
 * @param {function} onReady Called when ready.
 */
function getDashboard(dash_id, onReady = null) {
    $("body").css("cursor","progress");
    fetchGET(URL_GET_DASHBOARD + dash_id, 
        (result) => {                
            $("body").css("cursor","auto");
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::getDashboard]");                
        }
    );
}


function saveDashboard(onReady = null) {
    $("body").css("cursor","progress");
    const data = dashboard.getData();
    fetchPOST(
        URL_SAVE_DASHBOARD, 
        {
            name: data.name,
            description: data.description,
            title: data.title,
            layout: data.layout_id,
            data: {
                components: data.components_data,
                comms: data.comms,
            },
            id: data.id,
            date_format: data.date_format,
        }, 
        result => {
            $("body").css("cursor","auto");
            dashboard.id = result.id;
            context.signals.onDashboardSaved.dispatch(result);
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::saveDashboard]");                
        }
    )
}

function deleteDashboard(id, onReady = null) {
    $("body").css("cursor","progress");
    fetchPOST(URL_DELETE_DASHBOARD,
        {
            dashboard_id: id,
        },  
        (result) => {                
            $("body").css("cursor","auto");
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::deleteDashboard]");                
        }
    );
}



function saveSnapshot(name, description, onReady = null) {
    $("body").css("cursor","progress");
    const data = dashboard.getFullData();
    fetchPOST(
        URL_SAVE_SNAPSHOT, 
        {
            name: name,
            description: description,
            title: data.title,
            layout: data.layout_id,
            data: {
                components: data.components_data,
                comms: data.comms,
            },
            date_format: data.date_format,
            components_content: data.components_content,
        }, 
        result => {
            $("body").css("cursor","auto");
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::saveSnapshot]");                
        }
    )
}

function getSnapshot(snapshot_id, onReady = null) {
    $("body").css("cursor","progress");
    fetchGET(URL_GET_SNAPSHOT + snapshot_id, 
        (result) => {                
            $("body").css("cursor","auto");
            if (onReady) onReady(result);
        },
        (error) => {
            $("body").css("cursor","auto");
            context.signals.onError.dispatch(error,"[main::getSnapshot]");                
        }
    );
}