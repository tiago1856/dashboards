
import { Div, AwesomeIconAndButton, Text } from '../builders/BuildingBlocks.js';
import { ComponentData } from './ComponentData.js';
import { NO_TITLE_DEFINED } from '../constants.js';
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
        
        this.data = data?data:JSON.parse(JSON.stringify(ComponentData));

        this.spot = spot;     // place in the layout
        this.content = null;  // content of the panel
        this.new_subcomponent = false;  // whether or not to create/re-recreate the subcomponent
                                        // example: when new visualizaton type, new data, ...

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

        const open_btn = toolButton('fas fa-folder-open', 'text-danger editable-component', 'Abrir component').attachTo(card_tools);
        const save_btn = toolButton('fas fa-save', 'text-danger editable-component', 'Guardar component').attachTo(card_tools);
        const edit_btn = toolButton('fas fa-pencil-alt', 'text-danger editable-component', 'Nova/Editar Query').attachTo(card_tools);
        const delete_btn = toolButton('fas fa-trash', 'text-danger editable-component', 'Apagar component').attachTo(card_tools);
        this.options_btn = toolButton('fas fa-cog', 'non-editable-component', 'Configuração').attachTo(card_tools);
        const print_btn = toolButton('fas fa-print', 'non-editable-component', 'Imprimir component').attachTo(card_tools);
        const zoom_btn = toolButton('fas fa-expand-arrows-alt', 'non-editable-component', 'Ampliar component').attachTo(card_tools);
        const collapse_btn = toolButton('fas fa-minus', 'non-editable-component', 'Collapsar component').attachTo(card_tools);
        const close_btn = toolButton('fas fa-times', 'non-editable-component', 'Remover component').attachTo(card_tools);


        // restoring a saved component
        if (data) {
          this.body = new Div().attachTo(this);
          this.body.addClass('card-body');
          this.body.setId(uuidv4());   // set a random id for this component's body       
          const component = getComponentClass(data.visualization_type, data.visualization);
          if (component) {
            this.content = new component.class(context, data, this.body, this.options_btn.dom);
          }
        }     

        $(zoom_btn.dom).on('click',function() {
          context.signals.onZoomComponent.dispatch(self.spot, self.body);
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
      //if (this.new_subcomponent) {
        const component = getComponentClass(this.data.component_type, this.data.visualization.visualization_type);
        if (component) {
          if (this.body) $(this.body.dom).remove();
          this.body = new Div().attachTo(this);
          this.body.addClass('card-body');
          this.body.setId(uuidv4());
          this.content = null;
          this.content = new component.class(this.context, this.data, this.body, this.options_btn.dom);
        }
      }
}

const toolButton = (icon, classes, title) => {
  const btn = new AwesomeIconAndButton('',icon);
  btn.addClass('btn btn-sm ' + classes);
  btn.setAttribute('type','button');
  btn.setAttribute('data-toggle','tooltip');
  btn.setAttribute('title',title);
  return btn;
}


