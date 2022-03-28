/**
 * DATA SOURCE MODAL
 */



import { fetchGET, fetchPOST } from "../Fetch.js";
import { 
    URL_LIST_QUERIES, 
    URL_EXEC_QUERY, 
    URL_SAVE_QUERY,
    URL_DELETE_QUERY,
    URL_UPDATE_QUERY,
    URL_CHECK_NAME_COMPONENT,
    URL_SAVE_COMPONENT
} from "../urls.js";
import { BasicTable } from '../builders/BasicTable.js';
import { ExportTable2Excel } from '../export/ExportTable2Excel.js';
import { MSG_DELETE_QUERY } from '../messages.js';
import { getAllNumbers } from '../utils/jsutils.js';
import { VISUALIZATION_TYPE } from "../components/VisualizationType.js";
import { IconsModal } from './IconsModal.js';

const EDIT_COMPONENT_MODAL = $('#edit-component-modal');


// GLOBAL
const GLOBAL_NAME = $('#component-global-name');
const GLOBAL_DESCRIPTION = $('#component-global-description');
const GLOBAL_TITLE = $('#component-global-title');
const GLOBAL_NAME_ALERT = $('.component-global-name-alert');

// QUERY
const QUERY_AREA = $('#data-source-query');
const TABLE_AREA = $('#data-source-table');
const NUMBER_LINES = $('#data-source-lines');
const DATA_SOURCE_TABLE_ALERT = $('#data-source-table-alert');
const QUERY_SELECTION = $('#query-selection');
const SAVE_BTN = $('#data-source-save-query-btn');
const EDIT_BTN = $('#data-source-edit-query-btn');
const DELETE_BTN = $('#data-source-delete-query-btn');
const EXCEL_BTN = $('#data-source-excel-btn');
const NEW_QUERY_BUTTON = $('#data-source-new-query-btn');
const EXEC_QUERY = $('#data-source-execute-btn');
const SELECTED_FIELDS = $('#data-source-selected-fields');
const NEW_QUERY_DIALOG = $("#data-source-new-query-dialog");
const NEW_QUERY_NAME = $('#data-source-new-query-name');
const NEW_QUERY_DESCRIPTION = $('#data-source-new-query-description');
const NEW_QUERY_SAVE_BTN = $("#data-source-new-query-save");
const NEW_QUERY_CANCEL_BTN = $('#data-source-new-query-cancel');
const APPLY_BTN = $('#edit-component-modal-ok-btn');

const DEFAULT_MAX_LINE = 10;

// VISUALIZATION
const DATA_VISUALIZATION_SELECTION = $('.data-visualization-selection');

// TABLE SIMPLE
const TS_SORTABLE_NO = $("#vis-ts-no");
const TS_SORTABLE_YES = $("#vis-ts-yes");
// TABLE COMPLEX
const TC_SORTABLE_NO = $("#vis-tc-no");
const TC_SORTABLE_YES = $("#vis-tc-yes");
// GRAPH 1 NUM
const G1N_X_AXIS = $('#cdc-graph-1-num-x-axis')
const G1N_SERIES = $('#cdc-graph-1-num-series')
// GRAPH DOUBLE NUM
const GDN_X_AXIS = $('#cdc-graph-double-num-x-axis');
const GDN_SERIES_1 = $('#cdc-graph-double-num-series-1');
const GDN_SERIES_2 = $('#cdc-graph-double-num-series-2');
// INFO SIMPLE LEFT
const ISL_SELECT_ICON = $(".icon-preview");
const ISL_ICON_PREVIEW_AREA = $("#cdc-info-simple-left-icon-preview");
const ISL_TEXT_1 = $("#cdc-info-simple-left-text-1");
const ISL_VALUE = $("#cdc-info-simple-left-value");
const ISL_TEXT_2 = $("#cdc-info-simple-left-text-2");
// CONTROL NUMBER
const CN_NAME = $("#cdc-controls-number-name");
const CN_DEFAULT= $("#cdc-controls-number-default-value");
const CN_MIN= $("#cdc-controls-number-min");
const CN_MAX= $("#cdc-controls-number-max");
const CN_STEP= $("#cdc-controls-number-step");
const CN_TYPE= $("#cdc-controls-number-type");
// CONTROL STRING
const CS_NAME = $("#cdc-controls-string-name");
const CS_DEFAULT= $("#cdc-controls-string-default-value");
const CS_TYPE= $("#cdc-controls-string-type");
// CONTROL BOOL
const CB_NAME = $("#cdc-controls-boolean-name");
const CB_DEFAULT= $("#cdc-controls-boolean-default-value");
const CB_TRUE= $("#cdc-controls-bool-true");
const CB_FALSE= $("#cdc-controls-bool-false");
const CB_TYPE= $("#cdc-controls-bool-type");

// SAVE
const SAVE_COMPONENT_BTN = $("#scs-save-btn");


export function EditComponentModal(context) {

    this.context = context;
    const self = this;
    let query_id = null;
    let original_query = null;
    this.new_query = false;
    this.table_id = null;

    // ALL THE DATA REQUIRED TO RESTORE THE MODAL TO A SPECIFIC STATE
    this.state = null;
    this.component = null;

    this.old_name = null;

    this.icons_modal = new IconsModal(context);
    
    SELECTED_FIELDS.multiselect({enableFiltering: true,
        includeSelectAllOption: true,
        maxHeight: 200,
        dropUp: true
    });


    // ----------------
    // BUTTONS
    // ----------------

    // SAVEs QUERY
    SAVE_BTN.on('click',function() {
        console.log("TODO: SAVE QUERY");
        self.updateQuery(() => {
            self.changeSaveStatus(false);
            //self.context.signals.onChanged.dispatch();
        });
    })

    // DELETEs QUERY
    DELETE_BTN.on('click',function() {
        context.signals.onAYS.dispatch(MSG_DELETE_QUERY, 
        () => {
            self.deleteQuery();
            //self.context.signals.onChanged.dispatch();
        });
    })
    
    // EXPORTs TABLE TO EXCEL
    EXCEL_BTN.on('click',function() {
        ExportTable2Excel(this.table_id,'xxx')
    })


    // NEW QUERY
    NEW_QUERY_BUTTON.on('click',function() {
        self.newQuery(QUERY_SELECTION.val() !== '');
        //self.context.signals.onChanged.dispatch();
    })

    // EDITs QUERY
    EDIT_BTN.on('click',function() {
        QUERY_AREA.removeAttr('disabled');
        EDIT_BTN.attr('disabled',true);
        //self.context.signals.onChanged.dispatch();
    })

    // EXECs QUERY
    EXEC_QUERY.on('click',function() {
        self.execQuery();
    })

    // SAVES NEW QUERY NAME / DESCRIPTION
    NEW_QUERY_SAVE_BTN.on('click', function() {
        NEW_QUERY_DIALOG.hide();
        self.saveQuery((new_query_value) => {
            QUERY_SELECTION.val(new_query_value);
            QUERY_SELECTION.trigger('change');
            QUERY_AREA.removeAttr('disabled');
            //self.context.signals.onChanged.dispatch();
        });
    });

    // CANCELS NEW QUERY NAME/DESCRIPTION
    NEW_QUERY_CANCEL_BTN.on('click', function() {
        NEW_QUERY_DIALOG.hide();
    });

    // APPLIES CHANGES => SAVES THE STATE OF THE 
    // COMPONENT (NOT IN THE DATABASE)
    APPLY_BTN.on('click', function() {
        self.save();
        //self.context.signals.onChanged.dispatch();
        //self.context.signals.onComponentChanged.dispatch(self.state.name);        
    });


    // SAVES THE COMPONENT IN THE DATABASE
    SAVE_COMPONENT_BTN.on('click', function() {
        self.save(false);
        self.component.save();
    });


    // ----------------
    // EVENTS
    // ----------------

    SELECTED_FIELDS.on('change', function(e) {
        self.setVisualizationConfigPanel(self.state.data_config.fields !== undefined);
        //self.context.signals.onChanged.dispatch();
    })


    GLOBAL_NAME.on('change focus keyup paste', function(e) {
        if (e.target.value === '') {
            console.log("invalid");
            GLOBAL_NAME.addClass('invalid-input');
            GLOBAL_NAME.removeClass('valid-input ');            
        } else {
            console.log("valid");
            GLOBAL_NAME.removeClass('invalid-input');
            GLOBAL_NAME.addClass('valid-input');
            // check name
        }
        self.checkName(self.state.id, e.target.value);
        //self.context.signals.onChanged.dispatch();
    });

    // on query selection
    QUERY_SELECTION.on('change', function(e) {
        QUERY_AREA.attr('disabled','true');
        query_id = parseInt($(this).val());
        original_query = $(this).find(':selected').attr('data-query');
        QUERY_AREA.val(original_query);
        // if NaN => no choice => disable edit
        if (query_id !== query_id) {
            //EDIT_BTN.attr('disabled', true);
            EDIT_BTN.removeAttr('disabled');
            DELETE_BTN.attr('disabled', true);
            EXCEL_BTN.attr('disabled', true);
            EXEC_QUERY.attr('disabled', true);
            //self.context.signals.onChanged.dispatch();
        } else {
            EDIT_BTN.removeAttr('disabled');
            DELETE_BTN.removeAttr('disabled');
            EXEC_QUERY.removeAttr('disabled'); 
        }
        DATA_SOURCE_TABLE_ALERT.show();
        TABLE_AREA.empty();
        SELECTED_FIELDS.empty();
        SELECTED_FIELDS.multiselect('rebuild');
        NEW_QUERY_DIALOG.hide();
        //self.setVisualizationConfigPanel(false);
        self.clearVisualizationConfigPanel();
    })

    // query edited
    QUERY_AREA.on('change keyup', function(e) {
        if (original_query !== QUERY_AREA.val()) {
            self.changeSaveStatus(true);
            //self.context.signals.onChanged.dispatch();
        } else {
            self.changeSaveStatus(false);
        }
    });

    // new query name
    NEW_QUERY_NAME.on('change keyup', function(e) {
        const val = $(this).val();
        if (val !== '') {
            NEW_QUERY_SAVE_BTN.removeAttr('disabled');
            //self.context.signals.onChanged.dispatch();
        } else {
            NEW_QUERY_SAVE_BTN.attr('disabled', true);
        }
    });

    // DISPLAY SELECTION
    DATA_VISUALIZATION_SELECTION.on('click', function(e) {        
        if (self.state.visualization.visualization_type === $(this).data('vis')) return;
        if (self.state.visualization.visualization_type) {
            $("[data-vis='" + self.state.visualization.visualization_type + "'").children('.img-vis').first().removeClass('img-vis-selected');
        }
        $(this).children('.img-vis').first().addClass('img-vis-selected');
        //self.state.visualization_type = this.id;
        self.state.visualization.visualization_type = $(this).data('vis');
        console.log( self.state.visualization.visualization_type);
        self.state.visualization.visualization_tab = $(this).closest('.collapse').attr('id');
        self.state.component_type = $(this).data('type');
        //self.context.signals.onVisualizationSelected.dispatch(this.id);
        self.setVisualizationConfigPanel(false);
        //self.context.signals.onChanged.dispatch();
    });



    // -------------------
    // INFO SIMPLE LEFT
    // -------------------   

    // SELECT INFO ICON
    ISL_SELECT_ICON.on('click', function() {
        self.icons_modal.show(self.state.data_config.icon, (icon) => {
            ISL_ICON_PREVIEW_AREA.removeClass();
            ISL_ICON_PREVIEW_AREA.addClass(icon);
            //self.context.signals.onChanged.dispatch();
        });
    });


    // -------------------------------
    // INIT AND SETUP JQUERY PLUGINS 
    // -------------------------------
    $( "#vis-ts-no, #vis-ts-yes" ).sortable({
        connectWith: ".connectedSortable",
    }).disableSelection();
    $( "#vis-tc-no, #vis-tc-yes" ).sortable({
        connectWith: ".connectedSortable",
    }).disableSelection();
}

EditComponentModal.prototype = {

    clearVisualizationConfigPanel: function() {
        switch(this.state.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
                TS_SORTABLE_NO.empty();
                TS_SORTABLE_YES.empty();
                break;
            case VISUALIZATION_TYPE.TC:
                TC_SORTABLE_NO.empty();
                TC_SORTABLE_YES.empty();
                break;                
            case VISUALIZATION_TYPE.G1N:
                G1N_X_AXIS.empty();
                G1N_SERIES.empty();
                break;
            case VISUALIZATION_TYPE.GDN:
                GDN_X_AXIS.empty();
                GDN_SERIES_1.empty();
                GDN_SERIES_2.empty();                
                break;
            case VISUALIZATION_TYPE.ISL:
                ISL_TEXT_1.val("");
                ISL_TEXT_2.val("");   
                ISL_VALUE.empty();  
                break;
            case VISUALIZATION_TYPE.TEC:
                console.log("CALENDAR [clearVisualizationConfigPanel]");
                break;
            case VISUALIZATION_TYPE.CN:
                console.log("CONTROL NUMBER [clearVisualizationConfigPanel]");
                CN_NAME.val(uuidv4());
                CN_DEFAULT.val(0);
                CN_MIN.val(0);
                CN_MAX.val(100);
                CN_STEP.val(1);
                //CN_TYPE.val('box');
                break;
            case VISUALIZATION_TYPE.CS:
                console.log("CONTROL STRING [clearVisualizationConfigPanel]");
                CS_NAME.val(uuidv4());
                CS_DEFAULT.val('');
                //CS_TYPE.val('box');
                break;
            case VISUALIZATION_TYPE.CB:
                console.log("CONTROL BOOL [clearVisualizationConfigPanel]");
                CB_NAME.val(uuidv4());
                CB_DEFAULT.val('');
                CB_TRUE.val('V');
                CB_FALSE.val('F');
                //CB_TYPE.val('switch');
                break;
            case VISUALIZATION_TYPE.CNI:
                break;
        }
    },

    /**
     * Displays the respective panel and sets it's initial state or restores one.
     */
    setVisualizationConfigPanel: function(restore=true) {
        $('.cdc-config-panel').hide();
        $("[data-vis='" + this.state.visualization.visualization_type + "'").show();
        switch(this.state.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
            {
                TS_SORTABLE_NO.empty();
                TS_SORTABLE_YES.empty();
                const fields = SELECTED_FIELDS.val();
                if (restore && SELECTED_FIELDS.children().length > 0) {
                    this.state.data_config.fields.forEach(field => {
                        const item = createSortableListItem(field);
                        TS_SORTABLE_YES.append(item);
                    })
                    fields.forEach(field => {
                        if (this.state.data_config.fields.includes(field)) return false;
                        const item = createSortableListItem(field);
                        TS_SORTABLE_NO.append(item);
                    })
                } else {
                    // no config |=> no field selected = all fields selected => show all fields
                    if (SELECTED_FIELDS.children().length == 0 && 'fields' in this.state.data_config &&  this.state.query.query_selected_fields) {
                        SELECTED_FIELDS.empty();
                        this.state.data_config.fields.forEach(field => {
                            const item = createSortableListItem(field);
                            TS_SORTABLE_YES.append(item);                            
                            SELECTED_FIELDS.append(createFieldItem(field, this.state.query.query_selected_fields.includes(field)));
                        })
                        SELECTED_FIELDS.multiselect('rebuild');
                        SELECTED_FIELDS.multiselect('selectAll', true);
                    } else {
                        // all new => everything is visible
                        this.state.data_config = {};
                        fields.forEach(field => {
                            const item = createSortableListItem(field);
                            TS_SORTABLE_YES.append(item);
                        })
                    }
                }
                break;
            }
            case VISUALIZATION_TYPE.TC:
            {
                TC_SORTABLE_NO.empty();
                TC_SORTABLE_YES.empty();
                const fields = SELECTED_FIELDS.val();
                if (restore && SELECTED_FIELDS.children().length > 0) {
                    this.state.data_config.fields.forEach(field => {
                        const item = createSortableListItem(field);
                        TC_SORTABLE_YES.append(item);
                    })
                    fields.forEach(field => {
                        if (this.state.data_config.fields.includes(field)) return false;
                        const item = createSortableListItem(field);
                        TC_SORTABLE_NO.append(item);
                    })
                } else {
                    // no config |=> no field selected = all fields selected => show all fields
                    if (SELECTED_FIELDS.children().length == 0 && 'fields' in this.state.data_config &&  this.state.query.query_selected_fields) {
                        SELECTED_FIELDS.empty();
                        this.state.data_config.fields.forEach(field => {
                            const item = createSortableListItem(field);
                            TC_SORTABLE_YES.append(item);                            
                            SELECTED_FIELDS.append(createFieldItem(field, this.state.query.query_selected_fields.includes(field)));
                        })
                        SELECTED_FIELDS.multiselect('rebuild');
                        SELECTED_FIELDS.multiselect('selectAll', true);
                    } else {
                        // all new => everything is visible
                        this.state.data_config = {};
                        fields.forEach(field => {
                            const item = createSortableListItem(field);
                            TC_SORTABLE_YES.append(item);
                        })
                    }
                }
                break;
            }
            case VISUALIZATION_TYPE.G1N: 
            {
                G1N_X_AXIS.empty();
                G1N_SERIES.empty();
                const fields = SELECTED_FIELDS.val();
                fields.forEach(field => {
                    const option = createFieldItem(field, false);
                    G1N_X_AXIS.append(option);
                    G1N_SERIES.append(option.clone());
                })                 
                if (restore) {
                    if (SELECTED_FIELDS.children().length == 0 && 'fields' in this.state.data_config) {                        
                        //SELECTED_FIELDS.empty();
                        this.state.data_config.fields.forEach(field => {
                            SELECTED_FIELDS.append(createFieldItem(field, this.state.query.query_selected_fields.includes(field)));
                            const option = createFieldItem(field, false);
                            G1N_X_AXIS.append(option);
                            G1N_SERIES.append(option.clone());
                        })
                        SELECTED_FIELDS.multiselect('rebuild');
                        SELECTED_FIELDS.multiselect('selectAll', true);
                    } else {                        
                        fields.forEach(field => {
                            const option = createFieldItem(field, false);
                            G1N_X_AXIS.append(option);
                            G1N_SERIES.append(option.clone());
                        })
                    }
                    G1N_X_AXIS.val(this.state.data_config.fields[0]);
                    G1N_SERIES.val(this.state.data_config.fields[1]);
                } else {
                    if ('fields' in this.state.data_config && this.state.data_config.fields[0]) {                        
                        G1N_X_AXIS.val(this.state.data_config.fields[0]);
                        G1N_SERIES.val(this.state.data_config.fields[1]);
                        if (!G1N_X_AXIS.val()) {
                            G1N_X_AXIS.val($("#cdc-graph-1-num-x-axis option:first").val());
                            G1N_SERIES.val($("#cdc-graph-1-num-series option:eq(1)").val());
                        }
                    } else {                        
                        G1N_X_AXIS.val($("#cdc-graph-1-num-x-axis option:first").val());
                        G1N_SERIES.val($("#cdc-graph-1-num-series option:eq(1)").val());
                    } 
                    this.state.data_config.fields = [G1N_X_AXIS.val(),G1N_SERIES.val()];
                }
                break;
            }
            case VISUALIZATION_TYPE.GDN:
            {
                GDN_X_AXIS.empty();
                GDN_SERIES_1.empty();
                GDN_SERIES_2.empty();
                const fields = SELECTED_FIELDS.val();
                fields.forEach(field => {
                    const option = createFieldItem(field, false);
                    GDN_X_AXIS.append(option);
                    GDN_SERIES_1.append(option.clone());
                    GDN_SERIES_2.append(option.clone());
                })                 
                if (restore) {
                    if (SELECTED_FIELDS.children().length == 0 && 'fields' in this.state.data_config) {
                        //SELECTED_FIELDS.empty();
                        this.state.data_config.fields.forEach(field => {
                            SELECTED_FIELDS.append(createFieldItem(field, this.state.query.query_selected_fields.includes(field)));
                            const option = createFieldItem(field, false);
                            GDN_X_AXIS.append(option);
                            GDN_SERIES_1.append(option.clone());
                            GDN_SERIES_2.append(option.clone());
                        })
                        SELECTED_FIELDS.multiselect('rebuild');
                        SELECTED_FIELDS.multiselect('selectAll', true);
                    } else {
                        fields.forEach(field => {
                            const option = createFieldItem(field, false);
                            GDN_X_AXIS.append(option);
                            GDN_SERIES_1.append(option.clone());
                            GDN_SERIES_2.append(option.clone());
                        })
                    }
                    GDN_X_AXIS.val(this.state.data_config.fields[0]);
                    GDN_SERIES_1.val(this.state.data_config.fields[1]);
                    GDN_SERIES_2.val(this.state.data_config.fields[2]);
                } else {
                    if ('fields' in this.state.data_config && this.state.data_config.fields[0]) {
                        GDN_X_AXIS.val(this.state.data_config.fields[0]);
                        GDN_SERIES_1.val(this.state.data_config.fields[1]);
                        GDN_SERIES_2.val(this.state.data_config.fields[2]);
                        if (!GDN_X_AXIS.val()) {
                            GDN_X_AXIS.val($("#cdc-graph-1-num-x-axis option:first").val());
                            GDN_SERIES_1.val($("#cdc-graph-1-num-series option:eq(1)").val());
                            GDN_SERIES_2.val($("#cdc-graph-1-num-series option:eq(2)").val());                            
                        }
                    } else {
                        GDN_X_AXIS.val($("#cdc-graph-1-num-x-axis option:first").val());
                        GDN_SERIES_1.val($("#cdc-graph-1-num-series option:eq(1)").val());
                        GDN_SERIES_2.val($("#cdc-graph-1-num-series option:eq(2)").val());
                    }                    
                    this.state.data_config.fields = [GDN_X_AXIS.val(),GDN_SERIES_1.val(),GDN_SERIES_2.val()];
                }                
                break;
            }
            case VISUALIZATION_TYPE.ISL:
            {
                ISL_VALUE.empty();
                const fields = SELECTED_FIELDS.val();
                fields.forEach(field => {
                    const option = createFieldItem(field, false);
                    ISL_VALUE.append(option);
                });
                console.log("1111111 > ", fields);

                if (restore) {
                    if (SELECTED_FIELDS.children().length == 0 && this.state.data_config.text_1 && this.state.data_config.text_1!== '') {
                        SELECTED_FIELDS.append(createFieldItem(this.state.data_config.text_1, true));
                        SELECTED_FIELDS.multiselect('rebuild');
                        SELECTED_FIELDS.multiselect('selectAll', true);
                        const option = createFieldItem(this.state.data_config.text_1, false);
                        ISL_VALUE.append(option); 
                        ISL_TEXT_1.val(this.state.data_config.text_1);
                    } else {
                        ISL_ICON_PREVIEW_AREA.removeClass();
                        ISL_ICON_PREVIEW_AREA.addClass(this.state.data_config.icon);
                        ISL_TEXT_1.val(this.state.data_config.text_1);
                        ISL_TEXT_2.val(this.state.data_config.text_2);
                        ISL_VALUE.val(this.state.data_config.value);
                    }
                } else {
                    this.state.data_config = {};
                    //ISL_ICON_PREVIEW_AREA.removeClass();                    
                    ISL_TEXT_1.val("");
                    ISL_TEXT_2.val("");
                    ISL_VALUE.val($("#cdc-info-simple-left-value option:first").val());
                    this.state.data_config.value = ISL_VALUE.val();
                    this.state.data_config.text_1 = "";
                    this.state.data_config.text_2 = "";
                    this.state.data_config.icon = "icon ion-md-alert";
                    console.log("222222 > ", fields);
                }
                break;
            }
            case VISUALIZATION_TYPE.TEC:
            {
                console.log("TEMPLATE CALENDAR [setVisualizationConfigPanel]");
                break;
            }
            case VISUALIZATION_TYPE.CN:
            {
                if (restore) {
                    CN_NAME.val(this.state.data_config.name);
                    CN_DEFAULT.val(this.state.data_config.default);
                    CN_MIN.val(this.state.data_config.min);
                    CN_MAX.val(this.state.data_config.max);
                    CN_STEP.val(this.state.data_config.step);
                    CN_TYPE.val(this.state.data_config.type);
                } else {
                    CN_NAME.val(uuidv4());
                    CN_DEFAULT.val(0);
                    CN_MIN.val(0);
                    CN_MAX.val(100);
                    CN_STEP.val(1);
                    //CN_TYPE.val('box');
                }
                break;
            }
            case VISUALIZATION_TYPE.CS:
            {
                if (restore) {
                    CS_NAME.val(this.state.data_config.name);
                    CN_DEFAULT.val(this.state.data_config.default);
                    CS_TYPE.val(this.state.data_config.type);
                } else {
                    CS_NAME.val(uuidv4());
                    CS_DEFAULT.val('');
                    //CS_TYPE.val('box');
                }
                break;
            }
            case VISUALIZATION_TYPE.CB:
            {
                if (restore) {
                    CB_NAME.val(this.state.data_config.name);
                    CB_DEFAULT.val(this.state.data_config.default);
                    CB_TRUE.val(this.state.data_config.true);
                    CB_FALSE.val(this.state.data_config.false);
                    CB_TYPE.val(this.state.data_config.type);
                } else {
                    CB_NAME.val(uuidv4());
                    CB_DEFAULT.val('V');
                    CB_TRUE.val('V');
                    CB_FALSE.val('F');
                    //CB_TYPE.val('radio');                    
                }
                break;
            }
            case VISUALIZATION_TYPE.CNI:
            {
                break;
            }
        }
    },


    /**
     * Saves the current state of the modal in the state variable (not int the database), which
     * should be holding a reference to the component's ComponentData, set in
     * show().
     * @param {boolean} close If true, closes the modal after save.
     * @returns The current state.
     */
    save: function(close = true) {
        const self = this;
        // global
        this.state.name = GLOBAL_NAME.val();
        this.state.description = GLOBAL_DESCRIPTION.val();
        this.state.title = GLOBAL_TITLE.val();

        // query
        this.state.query.query_selection = QUERY_SELECTION.val();
        this.state.query.query = QUERY_AREA.val();
        this.state.query.query_selected_fields = SELECTED_FIELDS.val();
        //this.state.query.query_fields = [];
        this.state.query.query_fields = $.map($('#data-source-selected-fields option') ,function(option) {
            return option.value;
        });

        // visuzalization
        switch(this.state.visualization.visualization_type) {
            case VISUALIZATION_TYPE.TS:
            {
                self.state.data_config = { fields: [] };
                $.each($( "#vis-ts-yes" ).children(), function(key, value) {
                    self.state.data_config.fields.push(value.textContent);
                });
                break;
            }
            case VISUALIZATION_TYPE.TC:
            {
                self.state.data_config = { fields: [] };
                $.each($( "#vis-tc-yes" ).children(), function(key, value) {
                    self.state.data_config.fields.push(value.textContent);
                });
                break;
            }            
            case VISUALIZATION_TYPE.G1N:
            {
                self.state.data_config.fields[0] = G1N_X_AXIS.val();
                self.state.data_config.fields[1] = G1N_SERIES.val();
                break;
            }
            case VISUALIZATION_TYPE.GDN:            
            {
                self.state.data_config.fields[0] = GDN_X_AXIS.val();
                self.state.data_config.fields[1] = GDN_SERIES_1.val();
                self.state.data_config.fields[2] = GDN_SERIES_2.val();
                break;
            }
            case VISUALIZATION_TYPE.ISL:
            {
                self.state.data_config.icon = ISL_ICON_PREVIEW_AREA.attr('class');
                self.state.data_config.text_1 = ISL_TEXT_1.val();
                self.state.data_config.text_2 = ISL_TEXT_2.val();
                self.state.data_config.value = ISL_VALUE.val();
                break;
            }
            case VISUALIZATION_TYPE.CN:
            {
                self.state.data_config.name = CN_NAME.val();
                self.state.data_config.default = CN_DEFAULT.val();
                self.state.data_config.min = CN_MIN.val();
                self.state.data_config.max = CN_MAX.val();
                self.state.data_config.step = CN_STEP.val();
                self.state.data_config.type = CN_TYPE.val();
                break;
            }
            case VISUALIZATION_TYPE.CS:
            {
                self.state.data_config.name = CS_NAME.val();
                self.state.data_config.default = CS_DEFAULT.val();
                self.state.data_config.type = CS_TYPE.val();                
                break;
            }
            case VISUALIZATION_TYPE.CB:
            {
                self.state.data_config.name = CB_NAME.val();
                self.state.data_config.default = CB_DEFAULT.val();
                self.state.data_config.true = CB_TRUE.val();
                self.state.data_config.false = CB_FALSE.val();
                self.state.data_config.type = CB_TYPE.val();           
                break;
            }
            case VISUALIZATION_TYPE.CNI:
            {
                break;
            }
        }


        // no order or selection was done yet by the user
        // and therefore, default = all fields and data_config
        // still not set
        // if fields = [] => nothing selected => all fields selected
        if (this.state.data_config.fields === undefined ) {
            this.state.data_config.fields = SELECTED_FIELDS.val();
        }

        console.warn("SAVE > ", this.state);
        // did something changed?
        if (JSON.stringify(this.component.data) !== JSON.stringify(this.state)) this.context.signals.onChanged.dispatch();
        // ------------------ TO PREVENT CANCEL BUG -------------        
        this.component.data = JSON.parse(JSON.stringify(this.state));
        // ------------------

        // CLOSE MODAL
        if (close) {
            if (this.old_name && this.old_name !== this.state.name) {
                this.context.signals.onComponentNameChanged.dispatch(this.state.uuid, this.old_name, this.state.name);
            }
            EDIT_COMPONENT_MODAL.modal('hide');
            // UPDATE COMPONENT
            if (this.onReady) this.onReady();
        }        

        return this.state;
    },

    /**
     * Opens the modal and sets its inputs and selection accoding to the saved state.
     * @param {MasterComponent} component Component to edit.
     * @param {function} onReady Called to apply the changes.
     */
    show: function(component, onReady=null) {
        this.old_name = null;
        this.onReady = onReady;
        this.component = component;
        DATA_SOURCE_TABLE_ALERT.show();
        //NEW_QUERY_DIALOG.hide();
        TABLE_AREA.empty();
        SELECTED_FIELDS.empty();
        SELECTED_FIELDS.multiselect('rebuild');
        
        NUMBER_LINES.val(DEFAULT_MAX_LINE);
        SAVE_BTN.attr('disabled',true);

        GLOBAL_NAME_ALERT.hide();

        this.fetchQueries(() => {
            /*
            QUERY_SELECTION.val('');
            QUERY_SELECTION.trigger('change');
            */
            console.warn("RESTORE > ", component.data);
            // ------------------ TO PREVENT CANCEL BUG -------------
            // all changes are done in a copy of the components data and not directly
            // any change is only applied if Apply click
            this.state = JSON.parse(JSON.stringify(component.data));
            // ------------------
            // open first tab
            $('.process-model a[href="#edit-component-description-tab"]').tab('show');
            $('.img-vis').removeClass('img-vis-selected');
            // a component must always have a name
            // if not => restore
            if (component.data.name != null) {
                console.log(">>>RESTORE<<<");
                // global
                GLOBAL_NAME.val(this.state.name);
                this.old_name = this.state.name;
                GLOBAL_DESCRIPTION.val(this.state.description);
                GLOBAL_TITLE.val(this.state.title);

                // query
                QUERY_SELECTION.val(this.state.query.query_selection);
                QUERY_SELECTION.trigger('change');
                QUERY_AREA.val(this.state.query.query);
                this.state.query.query_fields.forEach(field => {
                    SELECTED_FIELDS.append(createFieldItem(field, this.state.query.query_selected_fields.includes(field)));
                });
                SELECTED_FIELDS.multiselect('rebuild');

                // display
                // open respective collapsed card
                $('#' + this.state.visualization.visualization_tab).collapse('show');
                // select the display image
                //$('#' + this.state.visualization.visualization).children('.img-vis').first().addClass('img-vis-selected');
                $("[data-vis='" + this.state.visualization.visualization_type + "'").children('.img-vis').first().addClass('img-vis-selected');
                this.setVisualizationConfigPanel(true);
            } else {
                console.log(">>>NEW<<<");
                // global
                GLOBAL_NAME.val(uuidv4());
                GLOBAL_DESCRIPTION.val('');
                GLOBAL_TITLE.val('');
                this.state.component_type = 'TABLE';

                // query
                QUERY_SELECTION.val('');
                QUERY_SELECTION.trigger('change');

                // visualization
                // by default select simple table
                // open first collapsed card
                $('#data-visualization-tables').collapse('show');
                // select tabe
                $('#data-visualization-table-simple').children('.img-vis').first().addClass('img-vis-selected');
                this.state.visualization.visualization_type = VISUALIZATION_TYPE.TS;
                this.state.visualization.visualization_tab = 'data-visualization-tables';
                this.setVisualizationConfigPanel(false);
            }
            
            // this.setConnections();
            EDIT_COMPONENT_MODAL.modal('show')
        });        
        
    },

    newQuery: function(deleteQuery = true) {
        if (deleteQuery) {
            QUERY_SELECTION.val('');
            QUERY_SELECTION.trigger('change');
        }

        NEW_QUERY_NAME.val('');
        NEW_QUERY_DESCRIPTION.val('');
        NEW_QUERY_DIALOG.show();

        this.changeSaveStatus(false);
    },

    fetchQueries: function(onReady=null) {
        $("body").css("cursor","progress");
        fetchGET(URL_LIST_QUERIES, 
            (result) => {
                QUERY_SELECTION.empty();
                QUERY_SELECTION.append(createQueryItem({name:'Selecione ou crie uma Query nova', id:'', "data-query":''}, true));
                result.forEach(query => {
                    QUERY_SELECTION.append(createQueryItem(query));
                });
                $("body").css("cursor","auto");
                if (onReady) onReady();
            },
            (error) => {
                $("body").css("cursor","auto");
                if (error && getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[EditComponentModal::fetchQueries]");
                else
                    this.context.signals.onError.dispatch(error,"[EditComponentModal::fetchQueries]");
                
            }
        );
    },


    changeSaveStatus: function(new_status) {
        // not save if no query selected
        if (QUERY_SELECTION.val() === '') return;
        //context.changed = new_status;
        this.new_query = new_status;
        if (new_status) {
            SAVE_BTN.removeClass('btn-outline-secondary').addClass('btn-danger');
            SAVE_BTN.removeAttr('disabled');
        } else {
            SAVE_BTN.removeClass('btn-danger').addClass('btn-outline-secondary');
            SAVE_BTN.attr('disabled', true);
        }
    },
    
    saveQuery: function(onReady=null) {
        $("body").css("cursor","progress");
        fetchPOST(URL_SAVE_QUERY,
            {
                query_name: NEW_QUERY_NAME.val(),
                query_description: NEW_QUERY_DESCRIPTION.val(),
                query: QUERY_AREA.val(),
            },
            (result) => {
                $("body").css("cursor","auto");
                console.log(result);
                QUERY_SELECTION.append(createQueryItem(result));
                if (onReady) onReady(result.id)
            },
            (error) => {
				$("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados ou utilizador não identificado!","[EditComponentModal::saveQuery]");
                else
                    this.context.signals.onError.dispatch(error,"[EditComponentModal::saveQuery]");
                                
            }
        )
    },


    updateQuery: function(onReady=null) {
        $("body").css("cursor","progress");
        const description = NEW_QUERY_DESCRIPTION.val();
        const query = QUERY_AREA.val();
        const name = NEW_QUERY_NAME.val();
        const id = QUERY_SELECTION.val();
        fetchPOST(URL_UPDATE_QUERY,
            {
                query_name: name,
                query_description: description,
                query: query,
                query_id: id,
            },
            (result) => {
                $("body").css("cursor","auto");
                console.log(result);
                updateQueryItem(query);
                if (onReady) onReady();
            },
            (error) => {
				$("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados ou utilizador não identificado!","[EditComponentModal::saveQuery]");
                else
                    this.context.signals.onError.dispatch(error,"[EditComponentModal::saveQuery]");
                                
            }
        )
    },


    deleteQuery: function() {
        $("body").css("cursor","progress");
        const query_id = QUERY_SELECTION.val();
        fetchPOST(URL_DELETE_QUERY,
            {
                query_id: query_id,
            },
            (result) => {
                $("body").css("cursor","auto");
                QUERY_SELECTION.find('[value="' + query_id +'"]').remove();
                QUERY_SELECTION.val('');
                QUERY_SELECTION.trigger('change');
            },
            (error) => {
                $("body").css("cursor","auto");
                this.context.signals.onError.dispatch(error,"[EditComponentModal::deleteQuery]");              
            }
        )
    },

    execQuery: function() {
        $("body").css("cursor","progress");
        fetchPOST(URL_EXEC_QUERY,
            {
                query: QUERY_AREA.val(),
                rows: NUMBER_LINES.val(),
            },
            (result) => {
                $("body").css("cursor","auto");
                DATA_SOURCE_TABLE_ALERT.hide();
                TABLE_AREA.empty();
                SELECTED_FIELDS.empty();                

                if (result.length == 0) return;                

                Object.keys(result[0]).forEach(column => {
                    SELECTED_FIELDS.append(createFieldItem(column, true));
                });
                SELECTED_FIELDS.multiselect('rebuild');

                const table = new BasicTable(result, parseInt(NUMBER_LINES.val())).attachTo(TABLE_AREA.get(0));
                this.table_id = table.getId();
                EXCEL_BTN.removeAttr('disabled');

                this.setVisualizationConfigPanel(false);
            },
            (error) => {
				$("body").css("cursor","auto");
                this.context.signals.onError.dispatch("Query inválida!","[EditComponentModal::execQuery]");
            }
        )
    },


    /**
     * Checks if name exists,
     * if so, show error message
     */
    checkName: function(id, name) {
        fetchPOST(
            URL_CHECK_NAME_COMPONENT, 
            {
                id: id,
                name: name
            }, 
            result => {
                if (result.status == 200) {
                    GLOBAL_NAME_ALERT.hide();
                    SAVE_COMPONENT_BTN.attr('disabled',false);
                } else {
                    GLOBAL_NAME_ALERT.show();
                    SAVE_COMPONENT_BTN.attr('disabled', true); 
                }
            },
            (error) => {
                    this.context.signals.onError.dispatch(error,"[EditComponentModal::checkName]");                
            }
        )
    },
    /*
    saveComponent: function() {
        console.log("saving");
        fetchPOST(
            URL_SAVE_COMPONENT, 
            {
                id: this.state.id,
                name: this.state.name,
                description: this.state.description,
                title: this.state.title,
                data: this.state,
            }, 
            result => {
                //console.log(result);
                this.state.id = result.id;
            },
            (error) => {
                    this.context.signals.onError.dispatch(error,"[EditComponentModal::saveComponent]");                
            }
        )
    },   
    */ 


      
}

/**
 * 
 * @param {*} item 
 * @param {*} selected 
 * @returns 
 */
const createQueryItem = (item, selected=false) => {
    const option = $('<option/>')
    option.text(item.name);
    option.attr('value', item.id);
    option.attr('name', item.id);
    option.attr('data-query', item.query);
    if (selected) option.attr('selected', true);
    return option;
 }

/**
 * 
 * @param {*} query 
 * @returns 
 */
const updateQueryItem = (query) => {
     const option = QUERY_SELECTION.find("option:selected");
     option.attr('data-query', query);
     return option;
}

/**
 * 
 * @param {*} value 
 * @param {*} selected 
 * @returns 
 */
const createFieldItem = (value, selected=false) => {
     const option = $('<option/>')
     option.text(value);
     option.attr('value', value);
     if (selected) option.attr('selected', true);
     return option;
}


/**
 * 
 * @param {*} value 
 * @returns 
 */
const createSortableListItem = (value) => {
    const item = $('<li/>')
    item.addClass('ui-state-highlight list-group-item py-0');
    item.text(value);
    return item;
}
