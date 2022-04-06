
import { Div, AwesomeIconAndButton, Text } from '../builders/BuildingBlocks.js';
import { NO_TITLE_DEFINED } from '../constants.js';
import { BaseComponentContent } from './BaseComponentContent.js';
import { getComponentClass } from './ComponentType.js';
import { MasterComponent } from './MasterComponent.js';

/**
 * Container for all type of components (except the INFO).
 */
export class CardComponent extends MasterComponent {
  /**
   * Constructor.
   * The component is identified not by its ID but by its spot.
   * @param {Context} context Context.
   * @param {number} spot Spot in the layout.
   * @param {string} _title Card title.
   * @param {string} color_scheme light/dark.
   * @param {string} data Data to retore the component.
   */
    constructor(context, spot, _title=null, color_scheme = 'light', data=null) {
        super(context, spot, data);

        this.addClass('card mb-1');
        this.addClass('card-' + color_scheme);
        this.setStyle('width','100%');

        const self = this;

        const header = new Div().attachTo(this);
        header.addClass('card-header py-1 px-2');       
        
        this.title = new Text().attachTo(header);
        this.title.addClass('card-title');
        this.setTitle(_title?_title:(data?data.title:_title));
        
        const card_tools = new Div().attachTo(header);
        card_tools.addClass('card-tools');

        const open_btn = toolButton('fas fa-folder-open', 'text-danger editable-component', 'Abrir component').attachTo(card_tools);
        const save_btn = toolButton('fas fa-save', 'text-danger editable-component', 'Guardar component').attachTo(card_tools);
        const edit_btn = toolButton('fas fa-pencil-alt', 'text-danger editable-component', 'Novo/Editar Component').attachTo(card_tools);
        const delete_btn = toolButton('fas fa-trash', 'text-danger editable-component', 'Apagar component').attachTo(card_tools);
        this.options_btn = toolButton('fas fa-cog', 'non-editable-component', 'Configuração').attachTo(card_tools);
        const print_btn = toolButton('fas fa-print', 'non-editable-component', 'Imprimir component').attachTo(card_tools);
        const zoom_btn = toolButton('fas fa-expand-arrows-alt', 'non-editable-component', 'Ampliar component').attachTo(card_tools);
        const collapse_btn = toolButton('fas fa-minus', 'non-editable-component', 'Collapsar component').attachTo(card_tools);
        const close_btn = toolButton('fas fa-times', 'non-editable-component', 'Remover component').attachTo(card_tools);
        
        collapse_btn.setAttribute('data-card-widget','collapse');


        $(zoom_btn.dom).on('click',function() {
          context.signals.onZoomComponent.dispatch(self.spot, self.body);
        });
        
        $(edit_btn.dom).on('click',function() {
          context.signals.onEditComponent.dispatch(self.spot, self.data.component_type);
        });

        $(open_btn.dom).on('click',function() {
          context.signals.onLoadComponent.dispatch(self.spot);
        });

        $(save_btn.dom).on('click',function() {
          self.save();
        });
      
        // restoring a saved component
        if (data) {
          this.update();
        } 

        // outpin, value, index -> array of objects[{pin, value, index}, ...]
        context.signals.onQueryUpdated.add((destination_component, comm_data)/*outpin = null, value = null, index = 0)*/ => {
          if (destination_component === data.uuid /*&& outpin && value*/) {
            console.warn("---- UPDATE QUERY CARD >>> ", data.uuid);
            if (!this.content) {
              console.warn("[CARDCOMPONENT] NO CONTENT!");
              return;
            }
            //const new_query = BaseComponentContent.modifyQuery(this.content.getQuery(), outpin, value, index)
            const new_query = this.content.getModifiedQuery(comm_data);//outpin, value, index);
            console.log("NEW QUERY > ", new_query);
            this.update(new_query);
          }
        });

    }


    /**
     * Get the component's card body.
     * @returns Body Div.
     */
    getBody() {
      return this.body;
    }

    /**
     * Get the options button.
     * @returns AwesomeIconAndButton corresponding to the options button.
     */
    getOptionsButton() {
      return this.options_btn;
    }

    /**
     * Clears the body of the card, by removing all element and events.
     */
    clearBody() {
      $(this.body.dom).empty();
    }

    /**
     * Sets the title of the card.
     * If the title is empty or nll, set the default title.
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
     * Updates the component.
     * Called when something fundamental change, like creation itself or just the component's type.
     * Body recreated because the graph framework does something weird to the container.
     */
    update(changed_query = null) {
      super.update(changed_query);
      this.setTitle(this.data.title);
      /*
      if (this.content) {
        //if (!this.content.hasOwnProperty('getQuery')) return;
        const old_query = this.content.getQuery();
        // only update if query different
        if (old_query && old_query === (new_query?new_query:this.data.query.query)) {
          return;
        }
      }
      */
      
      const component = getComponentClass(this.data.component_type, this.data.visualization.visualization_type);
      if (component) {
          if (this.body) $(this.body.dom).remove();
          this.body = new Div().attachTo(this);
          this.body.addClass('card-body');
          this.body.setId(uuidv4());
          this.body.setStyle('width','100%');
          this.body.setStyle("overflow","auto"); 
          this.content = null;
          this.content = new component.class(this.context, this, changed_query);
          this.content.execute(()=>{
            this.context.signals.onComponentUpdated.dispatch(this, changed_query?false:true);
          })
        }
    }   
}

/**
 * Helper builder.
 * @param {*} icon 
 * @param {*} classes 
 * @param {*} title 
 * @returns AwesomeIconAndButton.
 */
const toolButton = (icon, classes, title) => {
  const btn = new AwesomeIconAndButton('',icon);
  btn.addClass('btn btn-sm ' + classes);
  btn.setAttribute('type','button');
  btn.setAttribute('data-toggle','tooltip');
  btn.setAttribute('title',title);
  return btn;
}


