import { fetchGET } from "../Fetch.js";
import { URL_LIST_DASHBOARDS } from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';


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
                    if (onReady) onReady();
                }
                $("body").css("cursor","auto");                
            },
            (error) => {
                $("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[EditComponentModal::fetchQueries]");
                else
                    this.context.signals.onError.dispatch(error,"[SelectLayoutModal::fetchLayouts]");
                
            }
        );
    } 
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
