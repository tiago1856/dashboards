import { fetchGET } from "./Fetch.js";
import { URL_LIST_COMPONENTS } from "./urls.js";
import { getAllNumbers } from './utils/jsutils.js';

const LOAD_COMPONENT_MODAL = $('#load-component-modal');
const TABLE_BODY = $("#scm-table-components");

export function SelectComponentModal(context) {
    this.context = context;
    this.onSelected = null;
    const self = this;

}


SelectComponentModal.prototype = {

    show: function(onSelected = null) {
        this.onSelected = onSelected;
        const self = this;
        this.fetchComponents(() => {
            $('.scm-component-row').on('click', function(e) {
                self.onSelected($(this).attr('data-id'));
                LOAD_COMPONENT_MODAL.modal('hide');
            })
        });
        LOAD_COMPONENT_MODAL.modal('show');
    },


    fetchComponents: function(onReady=null) {
        $("body").css("cursor","progress");
        fetchGET(URL_LIST_COMPONENTS, 
            (result) => {
                TABLE_BODY.empty();
                result.forEach(component => {
                    TABLE_BODY.append(createRow(component));
                })                
                $("body").css("cursor","auto");
                if (onReady) onReady();
            },
            (error) => {
                $("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
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
