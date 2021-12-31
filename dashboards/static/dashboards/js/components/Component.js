
import { Div, AwesomeIconAndButton, Text } from '../builders/BuildingBlocks.js';
import { ComponentData } from './ComponentData.js';
import { NO_TITLE_DEFINED } from '../constants.js';
import { Graph1Num } from './graphs/Graph1Num.js';
import { GraphDoubleNum } from './graphs/GraphDoubleNum.js';
import { GraphTimeSeries } from './graphs/GraphTimeSeries.js';
import { getComponentClass } from './ComponentType.js';

/**
 * Container for all type of components.
 */
export class Component extends Div {
  /**
   * Constructor.
   * The component is identified not by its ID but by its spot.
   * @param {Context} context Context.
   * @param {number} spot Spot in the layout.
   * @param {string} _title Card title.
   * @param {boolean} h100 Full height. True if multirow, false otherwise.
   * @param {string} color_scheme light/dark.
   * @param {string} data Data to retore the component.
   * 
   */
    constructor(context, spot, _title=null, h100 = false, color_scheme = 'light', data=null) {
        super(context);
        this.addClass('Component card mb-1');
        this.addClass('card-' + color_scheme);
        
        this.data = data?data:{ ...ComponentData };

        this.spot = spot;     // place in the layout
        this.content = null;  // content of the panel

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
        
        // set a random id for this component's body
        this.body.setId(uuidv4());

        // 
        if (data) {
          const component = getComponentClass(data.visualization_type, data.visualization);
          if (component)
            this.content = new component.class(context, data, this.body, this.options_btn);
          /*
          const n = Math.floor(Math.random() * 3);
          switch (n) {
            case 0:
              this.content = new Graph1Num(context, null, this.body, this.options_btn);
              break;
            case 1:
              this.content = new GraphDoubleNum(context, null, this.body, this.options_btn);
              break;
            case 2:
              this.content = new GraphTimeSeries(context, null, this.body, this.options_btn);            
              break;
          }
          */
        }     

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

    /**
     * Sets the title of the card.
     * @param {string} _title Card title.
     */
    setTitle(_title) {
      if (_title) {
        this.title.setTextContent(_title);
        this.data.title = _title;
      } else {
        this.title.dom.innerHTML = NO_TITLE_DEFINED;
      }
    }

    /**
     * Get component's data.
     * @returns All the data required to restore the entire component.
     */
    getComponentData() {
      return this.data;
    }

    /**
     * Update component.
     * Called when something fundamental change, like the component's type.
     */
    update() {
      console.log("UPDATE COMPONENT > ", this.spot, this.data);
      this.setTitle(this.data.title);
      const component = getComponentClass(this.data.visualization_type, this.data.visualization);
      if (component) {
        this.content = new component.class(this.context, this.data, this.body, this.options_btn);
      }

    }
}
