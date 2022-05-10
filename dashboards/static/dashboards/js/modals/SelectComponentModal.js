import { fetchGET, fetchPOST } from "../Fetch.js";
import { 
    URL_LIST_COMPONENTS,
    URL_DELETE_COMPONENT,
} from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { AwesomeIconAndButton } from '../builders/BuildingBlocks.js';
import { MSG_DELETE_COMPONENT } from '../messages.js';

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
        const self = this;
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

                    // add operations - delete component
                    TABLE_BODY.find('tr').each(function(){
                        const td = $('<td>');
                        td.addClass('text-center');
                        const btn = new AwesomeIconAndButton('','fas fa-trash');
                        btn.addClass('btn btn-sm btn-danger');
                        btn.setAttribute('type','button');
                        btn.setAttribute('data-toggle','tooltip');
                        btn.setAttribute('title','Apagar componente');
                        td.append(btn.dom);
                        $(this).find('td').eq(3).after(td);
                        $(btn.dom).on('click',function(e) {
                            e.stopPropagation();
                            const row = $(this).closest('tr');
                            self.context.signals.onAYS.dispatch(MSG_DELETE_COMPONENT, () => {
                                self.deleteComponent(row.attr('data-id'), () => {
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
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[EditComponentModal::fetchQueries]");
                else
                    this.context.signals.onError.dispatch(error,"[SelectComponentModal::fetchComponents]");
                
            }
        );
    },

    /**
     * Deletes a component.
     * @param {Component} component Component 2 delete.
     * @param {function} onReady Called when ready.
     */
    deleteComponent: function(id, onReady = null) {
        $("body").css("cursor","progress");
        fetchPOST(URL_DELETE_COMPONENT,
            {
                id: id,
            },  
            (result) => {                
                $("body").css("cursor","auto");
                if (onReady) onReady(result);
            },
            (error) => {
                $("body").css("cursor","auto");
                context.signals.onError.dispatch(error,"[SelectComponentModal::deleteComponent]");                
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
    tr.append(id);
    const name = $('<td/>');
    name.text(data.name);
    tr.append(name);
    const description = $('<td/>');
    description.text(data.description);
    tr.append(description);
    const title = $('<td/>');
    title.text(data.title);
    tr.append(title); 
    return tr;
 }
