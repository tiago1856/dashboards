import { fetchGET, fetchPOST } from "../Fetch.js";
import { URL_LIST_SNAPSHOTS, URL_DELETE_SNAPSHOT } from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { mysqlTimeStamp2JS } from '../utils/jstime.js';
import { MSG_DELETE_SNAPSHOT } from '../messages.js';
import { AwesomeIconAndButton } from '../builders/BuildingBlocks.js';


const SELECT_DASHBOARD_MODAL = $('#select-snapshot-modal');
const TABLE_BODY = $("#ssm-table-snapshots");
const ALERT_MSG = $('#ssm-no-snapshot-alert');

export function SelectSnapshotModal(context) {
    this.context = context;
    this.onSelected = null;
}


SelectSnapshotModal.prototype = {

    show: function(onSelected = null) {
        this.onSelected = onSelected;
        this.fetchSnapshots(() => {
            $('.ssm-snapshot-row').on('click', function(e) {
                SELECT_DASHBOARD_MODAL.modal('hide');
                onSelected($(this).attr('data-id'));                
            })
        });
        SELECT_DASHBOARD_MODAL.modal('show');
    },


    fetchSnapshots: function(onReady=null) {
        $("body").css("cursor","progress");
        const self = this;
        fetchGET(URL_LIST_SNAPSHOTS, 
            (result) => {
                TABLE_BODY.empty();
                if (result.length == 0) {
                    ALERT_MSG.show();
                } else {
                    ALERT_MSG.hide();
                    result.forEach(component => {
                        TABLE_BODY.append(createRow(component));
                    })

                    // add operations - delete component
                    TABLE_BODY.find('tr').each(function(){
                        const td = $('<td>');
                        td.addClass('text-center');
                        const btn = new AwesomeIconAndButton('','fas fa-trash');
                        btn.addClass('btn btn-sm btn-danger');
                        btn.setAttribute('type','button');
                        btn.setAttribute('data-toggle','tooltip');
                        btn.setAttribute('title','Apagar snapshot');
                        td.append(btn.dom);
                        $(this).find('td').eq(3).after(td);
                        $(btn.dom).on('click',function(e) {
                            e.stopPropagation();
                            const row = $(this).closest('tr');
                            self.context.signals.onAYS.dispatch(MSG_DELETE_SNAPSHOT, () => {
                                self.deleteSnapshot(row.attr('data-id'), () => {
                                    row.remove();                                    
                                });                                
                            });                            
                        });
                    });
                    if (onReady) onReady();
                }
                $("body").css("cursor","auto");                
            },
            (error) => {
                $("body").css("cursor","auto");
                const error_codes = getAllNumbers(error.toString());
                if (error_codes && error_codes.length > 0 && error_codes[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[SelectDashboardModal::fetchLayouts]");
                else
                    this.context.signals.onError.dispatch(error,"[SelectSnapshotModal::fetchSnapshots]");
                
            }
        );
    },


    deleteSnapshot: function(id, onReady = null) {
        $("body").css("cursor","progress");
        fetchPOST(URL_DELETE_SNAPSHOT,
            {
                snapshot_id: id,
            },  
            (result) => {                
                $("body").css("cursor","auto");
                if (onReady) onReady(result);
            },
            (error) => {
                $("body").css("cursor","auto");
                context.signals.onError.dispatch(error,"[SelectSnapshotModal::deleteSnapshot]");                
            }
        );
    },

}

const createRow = (data) => {
    const tr = $('<tr/>');
    tr.attr('data-id', data.id);
    tr.addClass('ssm-snapshot-row');
    const id = $('<td/>');
    id.text(data.id);
    tr.append(id)
    const name = $('<td/>');
    name.text(data.name);
    tr.append(name)
    const description = $('<td/>');
    description.text(data.description);
    tr.append(description)
    const date = $('<td/>');
    date.text(mysqlTimeStamp2JS(data.date_created));
    tr.append(date)   
    return tr;
 }
