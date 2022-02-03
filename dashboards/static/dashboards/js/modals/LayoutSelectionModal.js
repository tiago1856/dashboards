
import { 
    URL_LIST_LAYOUTS, 
    URL_LIST_IN_USE_LAYOUTS,
    URL_DELETE_LAYOUT
} from "../urls.js";
import { fetchGET, fetchPOST } from "../Fetch.js";
import { Div, Canvas, Img, AwesomeIconAndButton } from "../builders/BuildingBlocks.js";
import { 
    MSG_DELETE_LAYOUT, 
    MSG_LAYOUT_IN_USE
} from '../messages.js';

const LSM_MODAL = $("#layout-selection-modal");
const LSM_REFRESH_BTN = $('#lsm-refresh');
const LSM_CHOICES_AREA = $('#lsm-choices');
const LSM_ALERT = $('#lsm-no-layout-alert');
const LSM_ADD_LAYOUT_BTN = $('#lsm-add-layout');

const LSM_MAX_X = 64;
const LSM_MAX_Y = 64;
const LSM_MARGIN = 5;
const LSM_COLS = 12;	// bootstrap max cols
const LSM_SIZE_PER_COL = parseInt(LSM_MAX_X / LSM_COLS);

export function LayoutSelectionModal(context) {
    this.context = context;
    this.current_layout_id = null;
    this.onSelected = null;
    this.changed = false;
    const self = this;

    // use a single canvas to create all layout images
    this.canvas =  new Canvas();
    this.canvas.setAttribute('width', LSM_MAX_X);
    this.canvas.setAttribute('height', LSM_MAX_Y);       
    this.ctx = this.canvas.dom.getContext("2d");
    this.ctx.strokeStyle = "#000";
 
    // MANUAL REFRESH => REBUILD THE ICONS AND STATUS
    LSM_REFRESH_BTN.on('click', function(e) {
        self.populate();
    });

    // CREATE A NEW LAYOUT ... WILL SIGNAL TO 
    // OPEN THE LAYOUT EDITOR MODAL
    LSM_ADD_LAYOUT_BTN.on('click', function(e) {
        LSM_MODAL.modal('hide');
        context.signals.onLayoutEditor.dispatch();
    });

    // THE LAYOUTS CHANGED, EITHER BY:
    //  - ADDING A NEW ONE
    //  - ADDING / REMOVING A DASHBOARD => NEEDS TO CHECK IF 
    //      A LAYOUT IS IN USE OR NOT
    context.signals.onLayoutsChanged.add((layout_id = null) => {
        if (layout_id) {
            // mark as used
            $('[data-id=' + layout_id + ']').addClass('layout-used');
            // remove delete button
            $('[data-id=' + layout_id + ']').parent().find('button').first().remove();
            
        } else {
            this.changed = true;
        }        
    });

    this.populate();

}


LayoutSelectionModal.prototype = {
    /**
     * Displays the modal
     * @param {function} onSelected Called when a layout is selected.
     */
    show: function(current_layout_id, onSelected = null) {
        this.onSelected = onSelected;
        this.current_layout_id = current_layout_id;
        if (this.changed) {
            this.populate();
            this.changed = false;
        }
        LSM_MODAL.modal('show');
        console.log(current_layout_id);               
        console.log(current_layout_id);               
        console.log(current_layout_id);               
        console.log(current_layout_id);               
    },

    /**
     * Get an array of IDs being used in dashboard.
     * @param {function} onReady Called when ready.
     */
    getInUseDashboards: function(onReady = null) {
        $("body").css("cursor","progress");        
        fetchGET(URL_LIST_IN_USE_LAYOUTS, 
            (result) => {
                $("body").css("cursor","auto");
                if (onReady) onReady(result);               
            },
            (error) => {
                $("body").css("cursor","auto");
                this.context.signals.onError.dispatch(error,"[LayoutSelectionModal::getInUseDashboards]");                
            }
        );
    },

    /**
     * Gets the data os all layouts in the database and create an icon
     * for each one of them
     * If a layout is currently being used by a dashboard, it will not
     * have a button that allows the user to delete it.
     * @param {function} onReady Called when ready.
     */
    populate: function(onReady=null) {
        const self = this;
        $("body").css("cursor","progress");

        this.getInUseDashboards(in_use => {
            fetchGET(URL_LIST_LAYOUTS, 
                (result) => {
                    $("body").css("cursor","auto");
                    LSM_CHOICES_AREA.empty();
                    if (result.length == 0) {
                        LSM_ALERT.show();
                    } else {
                        LSM_ALERT.hide();
                    }
                    result.forEach(layout => {
                        const spot = _createSpot().attachTo(LSM_CHOICES_AREA.get(0));
                        const img = this.createIcon(layout.data, layout.id, in_use.includes(layout.id)).attachTo(spot);
                        if (!in_use.includes(layout.id)) {                            
                            const button = new AwesomeIconAndButton('','fas fa-times fa-sm').attachTo(spot);
                            button.addClass('layout-remove-button');
                            $(button.dom).on('click', function() {
                                if (self.current_layout_id == layout.id) {
                                    self.context.signals.onWarning.dispatch(MSG_LAYOUT_IN_USE);
                                } else {
                                    self.context.signals.onAYS.dispatch(MSG_DELETE_LAYOUT, () => {
                                        self.deleteLayout(layout.id, () => {
                                            $(spot.dom).remove();
                                        })
                                    });
                                }
                            });
                            if (onReady) onReady();
                        }

                        $(img.dom).on('click', function(e) {
                            LSM_MODAL.modal('hide');
                            if (self.onSelected) self.onSelected(layout.id);
                        });
                    })
                },
                (error) => {
                    $("body").css("cursor","auto");
                    this.context.signals.onError.dispatch(error,"[LayoutSelectionModal::populate]");                
                }
            );

        });

    },

    /**
     * Given a layout data, creates and returns its image.
     * @param {object} data Layout data.
     * @param {number} id Layout ID.
     * @param {boolean} contains True if this layout is being used.
     * @returns Image of the layout.
     */
    createIcon(data, id, contains) {
        //this.ctx.fillStyle = contains?"#ff0000":"#ffffff";
        this.ctx.fillStyle = "#ffffff";
        //this.ctx.fillStyle = "#ffffff";
        this.ctx.clearRect(0, 0, LSM_MAX_X, LSM_MAX_Y);	
    
        // number of rows
        let total = 0;
        data.forEach(block => {
            total += block[0] * block[1];
        });
        const n_rows = Math.ceil(total / 12);

        const heigth_per_row = parseInt((LSM_MAX_Y - LSM_MARGIN) / n_rows);    

        const empty_row = [true, true, true, true, true, true, true, true, true, true, true, true]
        const spots = [[...empty_row]]; 

        let offset = 0;
        let row = 0;
        data.forEach(block => {
           
            if (!spots[row][offset]) {
                for (let i=offset; i<13; i++) {
                    offset = i;					
                    if (spots[row][offset]) break;
                }
            }
            if (offset >= 12) {
                offset = 0;
                row += 1;
            }		
            
            if (block[1] > 1) {
                for (let i=0; i<block[1]; i++) {
                    if (spots.length <= (row + i)) {
                        spots.push([...empty_row])
                    }
                    for (let k=0; k<block[0]; k++) {
                        spots[row + i][offset + k] = false;
                    }
                }
            }
           
            const x = offset * LSM_SIZE_PER_COL;
            const delta_x = block[0] * LSM_SIZE_PER_COL;			
            const y = row * heigth_per_row;
            const delta_y = block[1] * heigth_per_row;
            offset += block[0];
            if (offset >= 12) {
                row += 1;
                offset = 0;
            }
            this.ctx.fillRect(x + LSM_MARGIN,y + LSM_MARGIN,delta_x - LSM_MARGIN, delta_y - LSM_MARGIN);
            this.ctx.strokeRect(x + LSM_MARGIN,y + LSM_MARGIN,delta_x - LSM_MARGIN, delta_y - LSM_MARGIN);

            
            if (spots.length <= row)  spots.push([...empty_row])
            
        });

        const image = new Img();
        image.setAttribute('src', this.canvas.dom.toDataURL());
        image.addClass('img-fluid rounded m-2 layout-choice');
        image.setAttribute('data-id', id);
        if (contains) image.addClass('layout-used');
        return image;
    
    },

    /**
     * Deletes a specific layout.
     * @param {number} layout_id Layout ID.
     * @param {function} onReady Called when ready.
     */
    deleteLayout(layout_id, onReady = null) {
        $("body").css("cursor","progress");
        fetchPOST(
            URL_DELETE_LAYOUT, 
            {
                layout_id: layout_id
            }, 
            result => {
                $("body").css("cursor","auto");
                 if (onReady) onReady(result);
            },
            (error) => {
                $("body").css("cursor","auto");
                this.context.signals.onError.dispatch(error,"[LayoutSelectionModal::deleteLayout]");                
            }
        )
    },
    
}

/**
 * Helper builder function.
 * @returns A Div.
 */
const _createSpot = () => {
    const div = new Div();
    div.addClass('layout d-inline-block m-2')
    div.setStyle('position','relative');
    return div;
}
