
import { Div, AwesomeIconAndButton } from '../builders/BuildingBlocks.js';
import { getComponentProperties } from './ComponentType.js';
import { MasterComponent } from './MasterComponent.js';
import { OptionsMenu } from '../options/OptionsMenu.js';
import { ExportMenu } from './ExportMenu.js';
import { MSG_NO_DATA_2_EXPORT } from '../messages.js';
import { printCanvas } from '../utils/jsprint.js';
import { exportObject2ExcelCsv } from '../export/ExcelCsv.js';
import { 
  exportArea2PDF, 
  exportArea2PNG, 
  getAreaCanvas 
} from '../export/ElementArea.js';


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
    constructor(context, spot, _title=null, color_scheme = 'light', data=null, new_uuid=false) {
        super(context, spot, data, new_uuid);
        this.addClass('info-component-container');
        this.setStyle('position','relative'); 

        const self = this;

        this.opt_menu = null;
       
        const card_tools = new Div().attachTo(this);
        card_tools.addClass('info-component-container-buttons');

        const open_btn = toolButton('fas fa-folder-open', 'text-danger editable-component info-component-button', 'Abrir component').attachTo(card_tools);
        const save_btn = toolButton('fas fa-save', 'text-danger editable-component info-component-button', 'Guardar component').attachTo(card_tools);
        const edit_btn = toolButton('fas fa-pencil-alt', 'text-danger editable-component info-component-button', 'Novo/Editar Component').attachTo(card_tools);
        const remove_btn = toolButton('fas fa-times', 'text-danger editable-component info-component-button', 'Remover component').attachTo(card_tools);
        this.options_btn = toolButton('fas fa-cog', 'non-editable-component info-component-button', 'Configuração').attachTo(card_tools);
      
        const dop = new Div().attachTo(card_tools);
        dop.addClass('btn-group');
        const export_btn = toolButton('fas fa-file-export', 'non-editable-component info-component-button dropdown-toggle', 'Exportar/Imprimir component').attachTo(dop);
        export_btn.setAttribute('data-toggle','dropdown');
        ExportMenu(() => {
          // print
          if (!this.content || !this.content.result || !this.body) {
            this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
            return;
          }           
          $("body").css("cursor","progress");
          getAreaCanvas(this.body.dom).then(canvas => {
            printCanvas(canvas);
            $("body").css("cursor","auto");
          }).catch(() => {
            $("body").css("cursor","auto");
          });            
        }, () => {
          // pdf
          if (!this.content || !this.content.result || !this.body) {
            this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
            return;
          }            
          $("body").css("cursor","progress");
          exportArea2PDF(this.body.dom, data.name).then(()=> {
            $("body").css("cursor","auto");
          }).catch((error) => {
            this.context.signals.onError.dispatch(error,"[CardComponent::ctor]");
            $("body").css("cursor","auto");
          });            
        }, () => {
          // image
          if (!this.content || !this.content.result || !this.body) {
            this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
            return;
          }
          $("body").css("cursor","progress");
          exportArea2PNG(this.body.dom, data.name).then(()=> {
            $("body").css("cursor","auto");
          }).catch((error) => {
            this.context.signals.onError.dispatch(error,"[NonCardComponent::ctor]");
            $("body").css("cursor","auto");
          });            
        }, () => {
          // excel
          if (!this.content || !this.content.result) {            
            this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
            return;
          }
          exportObject2ExcelCsv(this.content.result, data.name, '.xlsx');
        }, () => {
          //csv
          if (!this.content || !this.content.result) {
            this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
            return;
          }
          exportObject2ExcelCsv(this.content.result, data.name, '.xlsx');
        }).attachTo(dop)


        $(edit_btn.dom).on('click',function() {
          if (self.opt_menu) {
            self.opt_menu.close();
            self.opt_menu = null;
          }          
          context.signals.onEditComponent.dispatch(self.spot, self.data.component_type);
        });

        $(open_btn.dom).on('click',function() {
          if (self.opt_menu) {
            self.opt_menu.close();
            self.opt_menu = null;
          }           
          context.signals.onLoadComponent.dispatch(self.spot);
        });

        $(save_btn.dom).on('click',function() {
          console.warn(self.data.id);
          self.save();
        });    
        
        $(remove_btn.dom).on('click',function() {
          context.signals.onComponentRemoved.dispatch(self);
        });   


        $(this.options_btn.dom).on('click', function() {
          if (self.data.component_type === 'GRAPH') return;
          if (!self.body) return;
          if (self.opt_menu) {
              self.opt_menu.close();
              self.opt_menu = null;
          } else {
              self.opt_menu = new OptionsMenu(context, self, 100,100, () => {self.opt_menu = null;}).attachTo($('#layout-tab-content').get(0));
          }            
        });        


        // outpin, value, index -> array of objects[{pin, value, index}, ...]
        this.signal_onQueryUpdated = context.signals.onQueryUpdated.add((destination_component, comm_data)/*outpin = null, value = null, index = 0)*/ => {
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

    clear() {
      super.clear();
      this.signal_onQueryUpdated.detach();
    }    


    /**
     * Updates the component's content.
     * Called when something fundamental change, like creation itself or just the component's type.
     * Body recreated because the graph framework does something weird to the container.
     * @param {string} changed_query New query
     * @param {object} component_content All the data required to restore the content. 
     * Example: query's result. Used to restore a snapshot.
     */    
     async setContent(changed_query = null, component_content=null) {
      super.setContent(changed_query);

      const component = getComponentProperties(this.data.component_type, this.data.visualization.visualization_type);
      if (component) {
          this.setSpinnerVisibility(true);
          if (this.body) {
            this.body.clear();
            $(this.body.dom).remove();
          }
          this.body = new Div().attachTo(this);
          this.body.setStyle('width','100%');
          this.body.setStyle("overflow","auto");
          this.body.setId(uuidv4());          
          this.content = null;
          this.content = new component.class(this.context, this, changed_query);
          await this.content.execute(component_content);
          this.setSpinnerVisibility(false);
          if (this.data.component_type === 'CONTROL') {
            this.context.signals.onComponentUpdated.dispatch(this, true);
          } else {
            this.context.signals.onComponentUpdated.dispatch(this, changed_query?false:true);
          }
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


