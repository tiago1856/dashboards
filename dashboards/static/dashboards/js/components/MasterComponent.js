
import { Div } from '../builders/BuildingBlocks.js';
import { ComponentData } from './ComponentData.js';
import { fetchPOST } from "../Fetch.js";
import { URL_SAVE_COMPONENT } from "../urls.js";


/**
 * Container for all type of components.
 */
export class MasterComponent extends Div {
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
    constructor(context, spot, data=null) {
        super();
        this.addClass('Component');

        this.changed = false;   // something changed and it's not saved        
        this.data = data?data:JSON.parse(JSON.stringify(ComponentData));
        if (!data || !this.data.uuid) this.data.uuid = uuidv4();

        this.spot = spot;     // place in the layout
        this.content = null;  // content of the panel

        
        this.ast = null;
        this.conditionals = [];

        this.context = context;
      
    }

    /**
     * Something in this component changed.
     */
    setChanged(changed = true) {
      this.changed = changed;
      //this.data.id = null;
    }


    /**
     * Sets the components mode.
     * @param {boolean} mode True if edit mode, false otherwise.
     */
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
       * Updates the component.
       * Called when something fundamental change, like creation itself or just the component's type.
       */
      update(new_query = null) {
      }

      /**
       * Saves the component data into the database.
       * @param {boolean} individually True if the save operation is stand alone.
       */
      save(individually = true) {
        if (individually) $("body").css("cursor","progress");
        if (!this.data.uuid) this.data.uuid = uuidv4();
        fetchPOST(
            URL_SAVE_COMPONENT, 
            {
                id: this.data.id,
                uuid: this.data.uuid,
                name: this.data.name,
                description: this.data.description,
                title: this.data.title,
                data: this.data,
            }, 
            result => {
                this.data.id = result.id;
                this.changed = false;
                if (individually) $("body").css("cursor","auto");
            },
            (error) => {
              if (individually) $("body").css("cursor","auto");
              this.context.signals.onError.dispatch(error,"[Component::saveComponent]");                
            }
        )
    }


}


