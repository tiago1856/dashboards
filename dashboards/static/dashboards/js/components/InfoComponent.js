
import { Div, AwesomeIconAndButton, Text } from '../builders/BuildingBlocks.js';
import { ComponentData } from './ComponentData.js';
import { NO_TITLE_DEFINED } from '../constants.js';
import { getComponentClass } from './ComponentType.js';

/**
 * Container for info components.
 */
export class InfoComponent extends Div {
  /**
   * Constructor.
   * The component is identified not by its ID but by its spot.
   * @param {Context} context Context.
   * @param {number} spot Spot in the layout.
   * @param {string} _title Card title.
   * @param {string} color_scheme light/dark.
   * @param {string} data Data to retore the component.
   * 
   */
    constructor(context, spot, _title=null, color_scheme = 'light', data=null) {
        super(context);
        this.addClass('Component info-component-container');
        this.setStyle('position','relative');
        //this.setStyle('width','100%');
        
        this.data = data?data:JSON.parse(JSON.stringify(ComponentData));

        this.spot = spot;     // place in the layout
        this.content = null;  // content of the panel
        this.new_subcomponent = false;  // whether or not to create/re-recreate the subcomponent
                                        // example: when new visualizaton type, new data, ...

        this.context = context;  
        
        const self = this;

       
        const card_tools = new Div().attachTo(this);
        card_tools.addClass('info-component-container-buttons');

        const open_btn = toolButton('fas fa-folder-open', 'text-danger editable-component info-component-button', 'Abrir component').attachTo(card_tools);
        const save_btn = toolButton('fas fa-save', 'text-danger editable-component info-component-button', 'Guardar component').attachTo(card_tools);
        const edit_btn = toolButton('fas fa-pencil-alt', 'text-danger editable-component info-component-button', 'Nova/Editar Query').attachTo(card_tools);
        const delete_btn = toolButton('fas fa-trash', 'text-danger editable-component info-component-button', 'Apagar component').attachTo(card_tools);
        this.options_btn = toolButton('fas fa-cog', 'non-editable-component info-component-button', 'Configuração').attachTo(card_tools);

        // restoring a saved component
        if (data) {
         this.update();
        }     
       

        $(edit_btn.dom).on('click',function() {
          context.signals.onEditComponent.dispatch(self.spot, self.data.component_type);
        });

        $(open_btn.dom).on('click',function() {
          context.signals.onLoadComponent.dispatch(self.spot);
        });


      context.signals.onGlobalData.add((start, end) => {
          console.log("[" + id + "] new date > ", start, end);
      });
      
    }

    setEditMode(mode) {
      if (mode) {
        $(this.dom).find('.editable-component').show();
        $(this.dom).find('.non-editable-component').hide();
      } else {
        $(this.dom).find('.editable-component').hide();
        $(this.dom).find('.non-editable-component').show();
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
      //if (this.new_subcomponent) {
        const component = getComponentClass(this.data.component_type, this.data.visualization.visualization_type);
        if (component) {
          if (this.body) $(this.body.dom).remove();
          this.body = new Div().attachTo(this);
          //this.body.setStyle('min-height','100%');
          this.body.setStyle('width','100%');
          this.body.setStyle("overflow","auto");
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


