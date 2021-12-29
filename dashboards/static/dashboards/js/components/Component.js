
import { Div, AwesomeIconAndButton, Text } from '../builders/BuildingBlocks.js';
import { ComponentData } from './ComponentData.js';
import { data_1, data_2, data_3 } from './temp_data.js';

/**
 * 
 */
export class Component extends Div {
    constructor(context, spot, _title=null, h100 = false, color_scheme = 'light', id=null) {
        super(context);
        this.addClass('Component card mb-1');
        this.addClass('card-' + color_scheme);
        
        this.data = { ...ComponentData };

        this.spot = spot;

        //if (vh100) this.setStyle('min-height','100%');
        if (h100) this.addClass('full-height');

        this.context = context;   

        const header = new Div().attachTo(this);
        header.addClass('card-header py-1 px-2');       
        
        this.title = new Text().attachTo(header);
        this.title.addClass('card-title');
        this.setTitle(_title);
        
        const card_tools = new Div().attachTo(header);
        card_tools.addClass('card-tools');


        const open_btn = new AwesomeIconAndButton('','fas fa-folder-open').attachTo(card_tools);
        open_btn.addClass('btn btn-sm text-danger editable-component');
        open_btn.setAttribute('type','button');
        open_btn.setAttribute('data-toggle','tooltip');
        open_btn.setAttribute('title','Abrir component');

        const save_btn = new AwesomeIconAndButton('','fas fa-save').attachTo(card_tools);
        save_btn.addClass('btn btn-sm text-danger editable-component');
        save_btn.setAttribute('type','button');
        save_btn.setAttribute('data-toggle','tooltip');
        save_btn.setAttribute('title','Guardar component');

        const edit_btn = new AwesomeIconAndButton('','fas fa-pencil-alt').attachTo(card_tools);
        edit_btn.addClass('btn btn-sm text-danger editable-component');
        edit_btn.setAttribute('type','button');
        edit_btn.setAttribute('data-toggle','tooltip');
        edit_btn.setAttribute('title','Nova/Editar Query');

        const delete_btn = new AwesomeIconAndButton('','fas fa-trash').attachTo(card_tools);
        delete_btn.addClass('btn btn-sm text-danger editable-component');
        delete_btn.setAttribute('type','button');
        delete_btn.setAttribute('data-toggle','tooltip');
        delete_btn.setAttribute('title','Apagar Componente');

        this.options_btn = new AwesomeIconAndButton('','fas fa-cog').attachTo(card_tools);
        this.options_btn.addClass('btn btn-sm non-editable-component');
        this.options_btn.setAttribute('type','button');
        this.options_btn.setAttribute('data-toggle','tooltip');
        this.options_btn.setAttribute('title','Configuração'); 

        const print_btn = new AwesomeIconAndButton('','fas fa-print').attachTo(card_tools);
        print_btn.addClass('btn btn-sm non-editable-component');
        print_btn.setAttribute('type','button');
        print_btn.setAttribute('data-toggle','tooltip');
        print_btn.setAttribute('title','Imprimir componente');

        const zoom_btn = new AwesomeIconAndButton('','fas fa-expand-arrows-alt').attachTo(card_tools);
        zoom_btn.addClass('btn btn-sm non-editable-component');
        zoom_btn.setAttribute('type','button');
        zoom_btn.setAttribute('data-toggle','tooltip');
        zoom_btn.setAttribute('title','Ampliar componente');

        const collapse_btn = new AwesomeIconAndButton('','fas fa-minus').attachTo(card_tools);
        collapse_btn.addClass('btn btn-sm non-editable-component');
        collapse_btn.setAttribute('type','button');
        collapse_btn.setAttribute('data-card-widget','collapse');
        collapse_btn.setAttribute('data-toggle','tooltip');
        collapse_btn.setAttribute('title','Collapsar componente');

        const close_btn = new AwesomeIconAndButton('','fas fa-times').attachTo(card_tools);
        close_btn.addClass('btn btn-sm non-editable-component');
        close_btn.setAttribute('type','button');
        close_btn.setAttribute('data-card-widget','remove');
        close_btn.setAttribute('data-toggle','tooltip');
        close_btn.setAttribute('title','Remover componente');

        this.body = new Div().attachTo(this);
        this.body.addClass('card-body');
        
        // set a random id for this component's body if none is provided
        if (!id) id = uuidv4();
        this.body.setId(id);

        // randomly select and send message to the framework to create a graph 
        const n = Math.floor(Math.random() * 3);
        switch (n) {
          case 0:
            this.context.message_broker.postMessage({
              operation:'create_component', 
              id: id,
              data: data_1,
            });
            break;
          case 1:
            this.context.message_broker.postMessage({
              operation:'create_component', 
              id: id,
              data: data_2,
            });
            break;
          case 2:
            this.context.message_broker.postMessage({
              operation:'create_component', 
              id: id,
              data: data_3,
            });            
            break;
        }

        $(this.options_btn.dom).on('click',function() {
          self.context.message_broker.postMessage({
            operation:'show_options', 
            id: id,
          }); 
        });
        

        $(zoom_btn.dom).on('click',function() {
          context.signals.onZoomComponent.dispatch(self.spot);
        });
        
        $(edit_btn.dom).on('click',function() {
          context.signals.onEditComponent.dispatch(self.spot);
        });
        

        
        // necessary, otherwise only the contents collapse/show and not the box itself.
        const self = this;
        if (h100) {
          $(collapse_btn.dom).on('click', function() {
            if (self.hasClass('full-height')) {             
              $(self.dom).animate({height: '34px'}, 'slow', () => {
                self.removeClass('full-height');                
              });
              
            } else {
              $(self.dom).animate({height: '100%'}, 'slow', () => {
                self.addClass('full-height');
              });              
            }
          });
        }

      context.signals.onGlobalData.add((start, end) => {
          console.log("[" + id + "] new date > ", start, end);
      });
      
    }

    getBody() {
      return this.body;
    }

    getOptionsButton() {
      return this.options_btn;
    }

    /**
     * Clear the body of the card, by removing all element.
     */
    clearBody() {
      $(this.body.dom).empty();
    }

    setTitle(_title) {
      if (_title) {
        this.title.setTextContent(_title);
        this.data.title = _title;
      } else {
        this.title.dom.innerHTML = '<span style="color: red;">Titulo não definido!</span>';
      }
    }

    getComponentData() {
      return this.data;
    }
}
