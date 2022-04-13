import { fetchGET } from "../Fetch.js";
import { URL_LIST_COMPONENTS } from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';

const SELECT_COMPONENT_MODAL = $('#select-component-modal');
const TABLE_BODY = $("#scm-table-components");
const ALERT_MSG = $('#scm-no-component-alert');

export function SelectComponentModal(context) {
    this.context = context;
    this.onSelected = null;
}


SelectComponentModal.prototype = {

    show: function(onSelected = null) {
        this.onSelected = onSelected;
        const self = this;
        this.fetchComponents(() => {
            $('.scm-component-row').on('click', function(e) {
                self.onSelected($(this).attr('data-id'));
                SELECT_COMPONENT_MODAL.modal('hide');
            })
        });
        SELECT_COMPONENT_MODAL.modal('show');
    },


    fetchComponents: function(onReady=null) {
        $("body").css("cursor","progress");
        fetchGET(URL_LIST_COMPONENTS, 
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
                const error_codes = getAllNumbers(error.toString());
                if (error_codes && error_codes.length > 0 && error_codes[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[EditComponentModal::fetchQueries]");
                else
                    this.context.signals.onError.dispatch(error,"[SelectComponentModal::fetchComponents]");
                
            }
        );
    } 
}

const createRow = (data) => {
    const tr = $('<tr/>');
    tr.attr('data-id', data.id);
    tr.addClass('scm-component-row');
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
