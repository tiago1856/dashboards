
import { Div, AwesomeIconAndButton } from '../builders/BuildingBlocks.js';
import { getComponentClass } from './ComponentType.js';
import { MasterComponent } from './MasterComponent.js';

/**
 * INFO component.
 * 
* ATTENTION: USE CREATECOMPONENT.
 */
export class NonCardComponent extends MasterComponent {
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
        this.addClass('info-component-container');
        this.setStyle('position','relative'); 

        const self = this;
       
        const card_tools = new Div().attachTo(this);
        card_tools.addClass('info-component-container-buttons');

        const open_btn = toolButton('fas fa-folder-open', 'text-danger editable-component info-component-button', 'Abrir component').attachTo(card_tools);
        const save_btn = toolButton('fas fa-save', 'text-danger editable-component info-component-button', 'Guardar component').attachTo(card_tools);
        const edit_btn = toolButton('fas fa-pencil-alt', 'text-danger editable-component info-component-button', 'Novo/Editar Component').attachTo(card_tools);
        const delete_btn = toolButton('fas fa-trash', 'text-danger editable-component info-component-button', 'Apagar component').attachTo(card_tools);
        this.options_btn = toolButton('fas fa-cog', 'non-editable-component info-component-button', 'Configuração').attachTo(card_tools);
      

        $(edit_btn.dom).on('click',function() {
          context.signals.onEditComponent.dispatch(self.spot, self.data.component_type);
        });

        $(open_btn.dom).on('click',function() {
          context.signals.onLoadComponent.dispatch(self.spot);
        });


        // outpin, value, index -> array of objects[{pin, value, index}, ...]
        context.signals.onQueryUpdated.add((destination_component, comm_data)/*outpin = null, value = null, index = 0)*/ => {
          if (destination_component === data.uuid /*&& outpin && value*/) {
            console.warn("---- UPDATE QUERY CARD >>> ", data.uuid);
            if (!this.content) {
              console.warn("[NONCARDCOMPONENT] NO CONTENT!");
              return;
            }
            //const new_query = BaseComponentContent.modifyQuery(this.content.getQuery(), outpin, value, index)
            const new_query = this.content.getModifiedQuery(comm_data);//outpin, value, index);
            console.log("NEW QUERY > ", new_query);
            this.setContent(new_query);
          }
        });
    
    }

    /**
     * Updates the component's content.
     * Called when something fundamental change, like the component's type.
     * Body recreated because the graph framework does something weird to the container.
     */
     setContent(changed_query = null) {
      super.setContent(changed_query);
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
          this.body.setStyle('width','100%');
          this.body.setStyle("overflow","auto");
          this.body.setId(uuidv4());          
          this.content = null;
          this.content = new component.class(this.context, this, changed_query);
          this.content.execute(()=>{
            if (this.data.component_type === 'CONTROL') {
              this.context.signals.onComponentUpdated.dispatch(this, true);
            } else {
              this.context.signals.onComponentUpdated.dispatch(this, changed_query?false:true);
            }
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


