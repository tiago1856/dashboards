/**
 * DATA SOURCE MODAL
 */



import { fetchGET, fetchPOST } from "./Fetch.js";
import { 
    URL_LIST_QUERIES, 
    URL_EXEC_QUERY, 
    URL_SAVE_QUERY,
    URL_DELETE_QUERY
} from "./urls.js";
import { BasicTable } from './builders/BasicTable.js';
import { ExportTable2Excel } from './export/ExportTable2Excel.js';
import { MSG_DELETE_QUERY } from './messages.js';
import { getAllNumbers } from './utils/jsutils.js';


const QUERY_AREA = $('#data-source-query');
const TABLE_AREA = $('#data-source-table');
const NUMBER_LINES = $('#data-source-lines');
const DATA_SOURCE_MODAL = $('#data-source-modal');
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
const DISPLAY_MODAL = $('#display-modal');
const VISUALIZATION_BUTTON = $('#data-source-modal-ok-btn');



const DEFAULT_MAX_LINE = 10;

export function DataSourceModal(context) {

    this.context = context;
    const self = this;
    let query_id = null;
    let original_query = null;
    this.new_query = false;
    this.table_id = null;

    
    SELECTED_FIELDS.multiselect({enableFiltering: true,
        includeSelectAllOption: true,
        maxHeight: 200,
        dropUp: true
    });



    context.signals.onEditComponent.add((spot) => {
        DATA_SOURCE_MODAL.modal('show');
        console.log("data source > ", self.context.layout.components[spot]);
    });

    // ----------------
    // BUTTONS
    // ----------------

    VISUALIZATION_BUTTON.on('click',function() {
        DATA_SOURCE_MODAL.modal('hide');
        DISPLAY_MODAL.modal('show');
    })

    // SAVE QUERY
    SAVE_BTN.on('click',function() {
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
        QUERY_SELECTION.val('');
        QUERY_SELECTION.trigger('change');

        NEW_QUERY_NAME.val('');
        NEW_QUERY_DESCRIPTION.val('');
        NEW_QUERY_DIALOG.show();

        self.changeSaveStatus(false);
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
    $('#data-source-new-query-cancel').on('click', function() {
        NEW_QUERY_DIALOG.hide();
    });


    // ----------------
    // EVENTS
    // ----------------

    // on modal show, fetch all available queries
    DATA_SOURCE_MODAL.on('show.bs.modal', function (e) {
        DATA_SOURCE_TABLE_ALERT.show();
        //NEW_QUERY_DIALOG.hide();
        TABLE_AREA.empty();
        SELECTED_FIELDS.empty();
        SELECTED_FIELDS.multiselect('rebuild');
        NUMBER_LINES.val(DEFAULT_MAX_LINE);

        self.fetchQueries();

        QUERY_SELECTION.val('');
        QUERY_SELECTION.trigger('change');
    })

    // on query selection
    QUERY_SELECTION.on('change', function(e) {        
        QUERY_AREA.attr('disabled','true');
        query_id = parseInt($(this).val());
        original_query = $(this).find(':selected').attr('data-query');
        QUERY_AREA.val(original_query);
        // if NaN => no choice => disable edit
        if (query_id !== query_id) {
            EDIT_BTN.attr('disabled', true);
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


}

DataSourceModal.prototype = {

    fetchQueries: function() {
        $("body").css("cursor","progress");
        fetchGET(URL_LIST_QUERIES, 
            (result) => {
                QUERY_SELECTION.empty();                
                QUERY_SELECTION.append(this.createQueryItem({name:'Selecione ou crie uma Query nova', id:'', "data-query":''}, true));
                result.forEach(query => {
                    QUERY_SELECTION.append(this.createQueryItem(query));
                });
                $("body").css("cursor","auto");
            },
            (error) => {
                $("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!");
                else
                    this.context.signals.onError.dispatch(error,"[dtasource::DATA_SOURCE_MODAL.on('show.bs.modal')]");
                
            }
        );
    },

    createQueryItem : function(item, selected=false) {
       const option = $('<option/>')
       option.text(item.name);
       option.attr('value', item.id);
       option.attr('name', item.id);
       option.attr('data-query', item.query);
       if (selected) option.attr('selected', true);
       return option;
    },

    createFieldItem : function(value, selected=false) {
        const option = $('<option/>')
        option.text(value);
        option.attr('value', value);
        if (selected) option.attr('selected', true);
        return option;
     },

    changeSaveStatus: function(new_status) {
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
            },
            (result) => {
                $("body").css("cursor","auto");
                console.log(result);
                QUERY_SELECTION.append(this.createQueryItem(result));
                if (onReady) onReady(result.id)
            },
            (error) => {
				$("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados ou utilizador não identificado!");
                else
                    this.context.signals.onError.dispatch(error,"[DataSourceModal::saveQuery]");
                                
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
                this.context.signals.onError.dispatch(error,"[DataSourceModal::deleteQuery");              
            }
        )
    },

    execQuery: function() {
        $("body").css("cursor","progress");
        fetchPOST(URL_EXEC_QUERY,
            {
                query: QUERY_AREA.val(),
            },
            (result) => {
                $("body").css("cursor","auto");
                DATA_SOURCE_TABLE_ALERT.hide();
                TABLE_AREA.empty();
                SELECTED_FIELDS.empty();                

                if (result.length == 0) return;                

                Object.keys(result[0]).forEach(column => {
                    SELECTED_FIELDS.append(this.createFieldItem(column, true));
                });
                SELECTED_FIELDS.multiselect('rebuild');

                const table = new BasicTable(result, parseInt(NUMBER_LINES.val())).attachTo(TABLE_AREA.get(0));
                this.table_id = table.getId();
                EXCEL_BTN.removeAttr('disabled');
            },
            (error) => {
				$("body").css("cursor","auto");
                this.context.signals.onError.dispatch(error,"[DataSourceModal::execQuery");
            }
        )
    },
}