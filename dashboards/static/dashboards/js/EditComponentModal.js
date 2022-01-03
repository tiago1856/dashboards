/**
 * DATA SOURCE MODAL
 */



import { fetchGET, fetchPOST } from "./Fetch.js";
import { 
    URL_LIST_QUERIES, 
    URL_EXEC_QUERY, 
    URL_SAVE_QUERY,
    URL_DELETE_QUERY,
    URL_UPDATE_QUERY
} from "./urls.js";
import { BasicTable } from './builders/BasicTable.js';
import { ExportTable2Excel } from './export/ExportTable2Excel.js';
import { MSG_DELETE_QUERY } from './messages.js';
import { getAllNumbers } from './utils/jsutils.js';
import { VISUALIZATION_TYPE } from "./components/VisualizationType.js";

const EDIT_COMPONENT_MODAL = $('#edit-component-modal');


// GLOBAL
const GLOBAL_NAME = $('#component-global-name');
const GLOBAL_DESCRIPTION = $('#component-global-description');
const GLOBAL_TITLE = $('#component-global-title');

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

// GRAPH 1 NUM
const G1N_INVERT_BTN = $('#cdc-graph-1-num-invert-btn')
const G1N_X_AXIS = $('#cdc-graph-1-num-x-axis')
const G1N_SERIES = $('#cdc-graph-1-num-series')

const GDN_X_AXIS = $('#cdc-graph-double-num-x-axis');
const GDN_SERIES_1 = $('#cdc-graph-double-num-series-1');
const GDN_SERIES_2 = $('#cdc-graph-double-num-series-2');


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
    
    SELECTED_FIELDS.multiselect({enableFiltering: true,
        includeSelectAllOption: true,
        maxHeight: 200,
        dropUp: true
    });


    // ----------------
    // BUTTONS
    // ----------------

    // SAVE QUERY
    SAVE_BTN.on('click',function() {
        console.log("TODO: SAVE QUERY");
        self.updateQuery(() => {
            self.changeSaveStatus(false);
        });
    })

    // DELETE QUERY
    DELETE_BTN.on('click',function() {
        context.signals.onAYS.dispatch(MSG_DELETE_QUERY, 
        () => {
            self.deleteQuery();
        });
    })
    
    // EXPORT TABLE TO EXCEL
    EXCEL_BTN.on('click',function() {
        ExportTable2Excel(this.table_id,'xxx')
    })


    // NEW QUERY
    NEW_QUERY_BUTTON.on('click',function() {
        self.newQuery(QUERY_SELECTION.val() !== '');
    })

    // EDIT QUERY
    EDIT_BTN.on('click',function() {
        QUERY_AREA.removeAttr('disabled');
        EDIT_BTN.attr('disabled',true);
    })

    // EXEC QUERY
    EXEC_QUERY.on('click',function() {
        self.execQuery();
    })

    // save new query name/descr
    NEW_QUERY_SAVE_BTN.on('click', function() {
        NEW_QUERY_DIALOG.hide();
        self.saveQuery((new_query_value) => {
            QUERY_SELECTION.val(new_query_value);
            QUERY_SELECTION.trigger('change');
            QUERY_AREA.removeAttr('disabled');
        });
    });

    // cancel new query name/descr
    NEW_QUERY_CANCEL_BTN.on('click', function() {
        NEW_QUERY_DIALOG.hide();
    });

    // apply changes
    APPLY_BTN.on('click', function() {
        self.save();
    });
    


    // ----------------
    // EVENTS
    // ----------------
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
    })

    // query edited
    QUERY_AREA.on('change keyup', function(e) {
        if (original_query !== QUERY_AREA.val()) {
            self.changeSaveStatus(true);            
        } else {
            self.changeSaveStatus(false);
        }
    });

    // new query name
    NEW_QUERY_NAME.on('change keyup', function(e) {
        const val = $(this).val();
        if (val !== '') {
            NEW_QUERY_SAVE_BTN.removeAttr('disabled');
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
    });

    // -------------------
    // GRAPH 1 NUM
    // -------------------
    // GRAPH NUM 1 SWITCH LINES/COLUMNS
    G1N_INVERT_BTN.on('change', function() {
        const val_1 = G1N_X_AXIS.val();
        const val_2 = G1N_SERIES.val();
        G1N_X_AXIS.val(val_2);
        G1N_SERIES.val(val_1);
        self.state.data_config = {
            fields: [
                G1N_X_AXIS.val(),
                G1N_SERIES.val(),        
            ]
        }
    });

    G1N_X_AXIS.on('change', function(e) {
        self.state.data_config.fields[0] = e.target.value;
    });
    G1N_SERIES.on('change', function(e) {
        self.state.data_config.fields[1] = e.target.value;
    });

    // -------------------
    // GRAPH DOUBLE NUM
    // -------------------    
    GDN_X_AXIS.on('change', function(e) {
        self.state.data_config.fields[0] = e.target.value;
    });
    GDN_SERIES_1.on('change', function(e) {
        self.state.data_config.fields[1] = e.target.value;
    });
    GDN_SERIES_2.on('change', function(e) {
        self.state.data_config.fields[2] = e.target.value;
    });

}

EditComponentModal.prototype = {

    /**
     * Displays the respective panel and sets it's initial state or restore one.
     */
    setVisualizationConfigPanel: function(restore=true) {
        $('.cdc-config-panel').hide();
        $("[data-vis='" + this.state.visualization.visualization_type + "'").show();
        switch(this.state.visualization.visualization_type) {
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
                    G1N_X_AXIS.val(this.state.data_config.fields[0]);
                    G1N_SERIES.val(this.state.data_config.fields[1]);
                } else {
                    G1N_X_AXIS.val($("#cdc-graph-1-num-x-axis option:first").val());
                    G1N_SERIES.val($("#cdc-graph-1-num-series option:eq(1)").val());
                    this.state.data_config = {};
                    this.state.data_config = {
                        fields: [
                            G1N_X_AXIS.val(),
                            G1N_SERIES.val(),
                        ]
                    };
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
                });
                if (restore) {
                    GDN_X_AXIS.val(this.state.data_config.fields[0]);
                    GDN_SERIES_1.val(this.state.data_config.fields[1]);
                    GDN_SERIES_2.val(this.state.data_config.fields[2]);
                } else {
                    GDN_X_AXIS.val($("#cdc-graph-double-num-x-axis option:first").val());
                    GDN_SERIES_1.val($("#cdc-graph-double-num-series-1 option:eq(1)").val());
                    GDN_SERIES_2.val($("#cdc-graph-double-num-series-2 option:eq(2)").val());
                    this.state.data_config = {};
                    this.state.data_config = { 
                        fields: [
                            GDN_X_AXIS.val(),
                            GDN_SERIES_1.val(),
                            GDN_SERIES_2.val(),
                        ]
                    }
                }
                break;
            }
        }        
    },

    /**
     * Saves the current state of the modal in the state variable, which
     * should be holding a reference to the component's ComponentData, set in
     * show().
     * @returns The current state.
     */
    save: function() {
        // global
        this.state.name = GLOBAL_NAME.val();
        this.state.description = GLOBAL_DESCRIPTION.val();
        this.state.title = GLOBAL_TITLE.val();

        // query
        this.state.query.query_selection = QUERY_SELECTION.val();
        this.state.query.query = QUERY_AREA.val();
        this.state.query.query_selected_fields = SELECTED_FIELDS.val();

        console.warn("SAVE > ", this.state);

        // CLOSE MODAL
        EDIT_COMPONENT_MODAL.modal('hide');

        // UPDATE COMPONENT
        if (this.onReady) this.onReady();

        return this.state;
    },

    /**
     * Opens the modal and sets its inputs and selection accoding to the saved state.
     * @param {Component} component Component to edit.
     * @param {function} onReady Called to apply the changes.
     */
    show: function(component, onReady=null) {
        this.onReady = onReady;
        DATA_SOURCE_TABLE_ALERT.show();
        //NEW_QUERY_DIALOG.hide();
        TABLE_AREA.empty();
        SELECTED_FIELDS.empty();
        SELECTED_FIELDS.multiselect('rebuild');
        
        NUMBER_LINES.val(DEFAULT_MAX_LINE);
        SAVE_BTN.attr('disabled',true);

        this.fetchQueries(() => {
            /*
            QUERY_SELECTION.val('');
            QUERY_SELECTION.trigger('change');
            */
            console.warn("RESTORE > ", component.data);
            this.state = component.data;
            // open first tab
            $('.process-model a[href="#edit-component-description-tab"]').tab('show');
            $('.img-vis').removeClass('img-vis-selected');
            // restore?
            // a component must always have a name
            if (component.data.name != null) {
                console.log(">>>RESTORE<<<");
                // global
                GLOBAL_NAME.val(this.state.name);
                GLOBAL_DESCRIPTION.val(this.state.description);
                GLOBAL_TITLE.val(this.state.title);

                // query
                QUERY_SELECTION.val(this.state.query.query_selection);
                QUERY_SELECTION.trigger('change');
                QUERY_AREA.val(this.state.query.query);
                // restore only the previous selected fields
                // if others are needed, exec the query
                this.state.query.query_selected_fields.forEach(field => {
                    SELECTED_FIELDS.append(createFieldItem(field, true));
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
                if (getAllNumbers(error.toString())[0] == 500)
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
                this.context.signals.onError.dispatch(error,"[EditComponentModal::execQuery]");
            }
        )
    },
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


