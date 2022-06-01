import { fetchGET, fetchPOST } from "../Fetch.js";
import { URL_LIST_DASHBOARDS, URL_DELETE_DASHBOARD } from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { MSG_DELETE_DASHBOARD } from '../messages.js';
import { AwesomeIconAndButton } from '../builders/BuildingBlocks.js';


const SELECT_DASHBOARD_MODAL = $('#load-dashboard-modal');
const TABLE_BODY = $("#sdm-table-dashboards");
const ALERT_MSG = $('#ldm-no-dash-alert');

export function SelectDashboardModal(context) {
    this.context = context;
    this.onSelected = null;
}


SelectDashboardModal.prototype = {

    show: function(onSelected = null) {
        this.onSelected = onSelected;
        const self = this;
        this.fetchLayouts(() => {
            $('.sdm-dashboard-row').on('click', function(e) {
                SELECT_DASHBOARD_MODAL.modal('hide');
                onSelected($(this).attr('data-id'));                
            })
        });
        SELECT_DASHBOARD_MODAL.modal('show');
    },


    fetchLayouts: function(onReady=null) {
        $("body").css("cursor","progress");
        const self = this;
        fetchGET(URL_LIST_DASHBOARDS, 
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
                        btn.setAttribute('title','Apagar dashboard');
                        td.append(btn.dom);
                        $(this).find('td').eq(3).after(td);
                        $(btn.dom).on('click',function(e) {
                            e.stopPropagation();
                            const row = $(this).closest('tr');
                            self.context.signals.onAYS.dispatch(MSG_DELETE_DASHBOARD, () => {
                                self.deleteDashboard(row.attr('data-id'), () => {
                                    row.remove();
                                    self.context.signals.onDashboardDeleted.dispatch(row.attr('data-id'));
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
                    this.context.signals.onError.dispatch(error,"[SelectDashboardModal::fetchLayouts]");
                
            }
        );
    },


    deleteDashboard: function(id, onReady = null) {
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
                context.signals.onError.dispatch(error,"[SelectDashboardModal::deleteDashboard]");                
            }
        );
    },

}

const createRow = (data) => {
    const tr = $('<tr/>');
    tr.attr('data-id', data.id);
    tr.addClass('sdm-dashboard-row');
    const id = $('<td/>');
    id.text(data.id);
    tr.append(id)
    const name = $('<td/>');
    name.text(data.name);
    tr.append(name)
    const description = $('<td/>');
    description.text(data.description);
    tr.append(description)
    const title = $('<td/>');
    title.text(data.title);
    tr.append(title)   
    return tr;
 }
