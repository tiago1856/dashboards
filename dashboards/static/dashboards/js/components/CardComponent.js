
import { Div, AwesomeIconAndButton, Text, Ul, Li, Link } from '../builders/BuildingBlocks.js';
import { NO_TITLE_DEFINED } from '../constants.js';
import { getComponentProperties } from './ComponentType.js';
import { MasterComponent } from './MasterComponent.js';
import { OptionsMenu } from '../options/OptionsMenu.js';
import { ExportMenu } from './ExportMenu.js';
import { MSG_NO_DATA_2_EXPORT } from '../messages.js';

const { PDFDocument, PageSizes } = PDFLib

/**
 * Container for all type of components (except the INFO).
 * 
 * ATTENTION: USE CREATECOMPONENT.
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
    constructor(context, spot, _title=null, color_scheme = 'light', data=null, new_uuid=false) {
        super(context, spot, data, new_uuid);

        this.addClass('card mb-1');
        this.addClass('card-' + color_scheme);
        this.setStyle('width','100%');

        const self = this;

        this.opt_menu = null;

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
        const remove_btn = toolButton('fas fa-times', 'text-danger editable-component', 'Remover component').attachTo(card_tools);
        this.options_btn = toolButton('fas fa-cog', 'non-editable-component', 'Configuração').attachTo(card_tools);
        
        const dop = new Div().attachTo(card_tools);
        dop.addClass('btn-group');
        const export_btn = toolButton('fas fa-file-export', 'non-editable-component dropdown-toggle', 'Exportar/Imprimir component').attachTo(dop);
        export_btn.setAttribute('data-toggle','dropdown');
        ExportMenu(() => {
            // print
          }, () => {
          	// pdf
            if (!this.content || !this.content.result || !this.body) {
              this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
              return;
            }
            const currentPosition_y = this.body.dom.scrollTop;
            const currentPosition_x = this.body.dom.scrollLeft;
            const height = this.body.dom.style.height;
            const width = this.body.dom.style.width;
            this.body.dom.style.height="auto";
            this.body.dom.style.width=(this.body.dom.scrollWidth + 15) + "px";
            $("body").css("cursor","progress");
            html2canvas(this.body.dom, {logging:false, scale: 1}).then(canvas => {
                PDFDocument.create().then(pdfDoc => {
                    const page = pdfDoc.addPage(PageSizes.A4);
                    const img = canvas.toDataURL('image/png');
                    const w_ratio = page.getWidth() / canvas.width;
                    const h_ratio = page.getHeight() / canvas.height;
                    const ratio = w_ratio < h_ratio ? w_ratio : h_ratio;
                    pdfDoc.embedPng(img).then (pngImage => {
                      page.drawImage(pngImage, {
                        x: page.getWidth() / 2 - canvas.width * ratio / 2,
                        y: page.getHeight() - canvas.height * ratio,
                        width: canvas.width * ratio,
                        height: canvas.height * ratio,
                      })                     
                      pdfDoc.save().then(pdfBytes => {
                          var file = new File([pdfBytes], data.name + '.pdf', {
                            type: "application/pdf;charset=utf-8",
                          });
                          $("body").css("cursor","auto");
                          saveAs(file);
                      }).catch(() => {
                        $("body").css("cursor","auto");
                      });
                      this.body.dom.style.height=height;
                      this.body.dom.style.width=width;
                      this.body.dom.scrollTop = currentPosition_y;
                      this.body.dom.scrollLeft = currentPosition_x;
                    }).catch(() => {
                      $("body").css("cursor","auto");
                    });
                }).catch(() => {
                  $("body").css("cursor","auto");
                });
              })

          }, () => {
            // image
            if (!this.content || !this.content.result || !this.body) {
              this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
              return;
            }
            const currentPosition_y = this.body.dom.scrollTop;
            const currentPosition_x = this.body.dom.scrollLeft;
            const height = this.body.dom.style.height;
            const width = this.body.dom.style.width;
            this.body.dom.style.height="auto";
            this.body.dom.style.width=(this.body.dom.scrollWidth + 15) + "px";
            $("body").css("cursor","progress");
            html2canvas(this.body.dom, {logging:false}).then(canvas => {
                var link = document.createElement('a');
                link.download = data.name + '.png';
                link.href = canvas.toDataURL()
                link.click();
                link.remove();
                this.body.dom.style.height=height;
                this.body.dom.style.width=width;
                this.body.dom.scrollTop = currentPosition_y;
                this.body.dom.scrollLeft = currentPosition_x;
                $("body").css("cursor","auto");
            }).catch(() => {
              $("body").css("cursor","auto");
            });
          }, () => {
            // excel
            if (!this.content || !this.content.result) {
              this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
              return;
            }
            var ws = XLSX.utils.json_to_sheet(this.content.result);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "data");
            XLSX.writeFile(wb,data.name + '.xlsx');
          }, () => {
            //csv
            if (!this.content || !this.content.result) {
              this.context.signals.onWarning.dispatch(MSG_NO_DATA_2_EXPORT);
              return;
            }
            var ws = XLSX.utils.json_to_sheet(this.content.result);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "data");
            XLSX.writeFile(wb,data.name + '.csv');         
        }).attachTo(dop)

        const zoom_btn = toolButton('fas fa-expand-arrows-alt', 'non-editable-component', 'Ampliar component').attachTo(card_tools);
        const collapse_btn = toolButton('fas fa-minus', 'non-editable-component', 'Collapsar component').attachTo(card_tools);
        const close_btn = toolButton('fas fa-times', 'non-editable-component', 'Remover component').attachTo(card_tools);
        
        collapse_btn.setAttribute('data-card-widget','collapse');

        $(zoom_btn.dom).on('click',function() {
          context.signals.onZoomComponent.dispatch(self.spot, self.body);
        });
        
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
      
        // restoring a saved component
        /*
        if (data) {
          this.update();
        } 
        */

        // outpin, value, index -> array of objects[{pin, value, index}, ...]
        this.signal_onQueryUpdated = context.signals.onQueryUpdated.add((destination_component, comm_data)/*outpin = null, value = null, index = 0)*/ => {
          if (destination_component === data.uuid /*&& outpin && value*/) {
            console.warn("---- UPDATE QUERY CARD >>> ", data.uuid);
            if (!this.content) {
              console.warn("[CARDCOMPONENT] NO CONTENT!");
              return;
            }
            //const new_query = BaseComponentContent.modifyQuery(this.content.getQuery(), outpin, value, index)
            const new_query = this.content.getModifiedQuery(comm_data);//outpin, value, index);
            console.log("NEW QUERY > ", new_query);
            this.setContent(new_query);
          }
        });

        this.signal_onComponentTitleChanged = context.signals.onComponentTitleChanged.add((spot, title) => {
          if (spot == this.spot) this.setTitle(title);
        });

    }

    clear() {
      super.clear();
      this.signal_onQueryUpdated.detach();
      this.signal_onComponentTitleChanged.detach();
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
            this.body.addClass('card-body');
            this.body.setId(uuidv4());
            this.body.setStyle('width','100%');
            this.body.setStyle("overflow","auto"); 
            this.content = null;
            this.content = new component.class(this.context, this, changed_query);
            //await delay(Math.random() * 5000);
            await this.content.execute(component_content);
            this.setSpinnerVisibility(false);
            this.context.signals.onComponentUpdated.dispatch(this, changed_query?false:true); 
        }
    }   
}
/*
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/


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



export async function dataUrlToFile(dataUrl, fileName) {

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
