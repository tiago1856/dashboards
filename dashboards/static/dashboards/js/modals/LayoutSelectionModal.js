import { URL_LIST_LAYOUTS } from "../urls.js";
import { fetchGET } from "../Fetch.js";
import { Div, Canvas, Img } from "../builders/BuildingBlocks.js";


const LSM_MODAL = $("#layout-selection-modal");
const LSM_REFRESH_BTN = $('#lsm-refresh');
const LSM_CHOICES_AREA = $('#lsm-choices');
const LSM_ALERT = $('#lsm-no-layout-alert');

const LSM_MAX_X = 64;
const LSM_MAX_Y = 64;
const LSM_MARGIN = 5;
const LSM_COLS = 12;	// bootstrap max cols
const LSM_SIZE_PER_COL = parseInt(LSM_MAX_X / LSM_COLS);

export function LayoutSelectionModal(context) {
    this.context = context;
    this.onSelected = null;
    const self = this;

    // use a single canvas to create all layout images
    this.canvas =  new Canvas();
    this.canvas.setAttribute('width', LSM_MAX_X);
    this.canvas.setAttribute('height', LSM_MAX_Y);       
    this.ctx = this.canvas.dom.getContext("2d");
    this.ctx.strokeStyle = "#000";
 
    LSM_REFRESH_BTN.on('click', function(e) {
        self.populate();
    });

    this.populate();

}


LayoutSelectionModal.prototype = {
    show: function(onSelected = null) {
        this.onSelected = onSelected;
        LSM_MODAL.modal('show');
    },

    populate: function() {
        const self = this;
        $("body").css("cursor","progress");        
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
                    const img = this.createIcon(layout.data).attachTo(spot);
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
    },

    /**
     * Given a layout data, creates and returns its image.
     * @param {object} data Layout data.
     * @returns Image of the layout.
     */
    createIcon(data) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.clearRect(0, 0, LSM_MAX_X, LSM_MAX_Y);	
    
        // number of rows
        let n_rows = 0;
        data.forEach(row => {
            let temp = row[0][1];
            for (let i=1; i<row.length; i++){
                if (row[i][1] > temp) temp = row[i][1];
            }
            n_rows += temp;
        });         
            
        let heigth_per_row = parseInt((LSM_MAX_Y - LSM_MARGIN) / n_rows);    
    
        data.forEach((row, i) => {
            // check if there is a multi-row component
            let h100 = false;
            let hrows = 1;
            for (let i=0; i<row.length; i++){
                if (row[i][1] > 1) {
                    h100 = true;
                    hrows = row[i][1];
                    break;
                }
            };
                
                
            let prev_x = 0;
            row.forEach((col, j) => {
                const x = prev_x;				
                const delta_x = col[0] * LSM_SIZE_PER_COL;
                for (let c = 0; c < col[1]; c++) {					
                    const y = i * heigth_per_row + c * heigth_per_row;
                    const delta_y = heigth_per_row * ((h100 && col[1] == 1)?hrows:1);
                    this.ctx.fillRect(x + LSM_MARGIN,y + LSM_MARGIN,delta_x - LSM_MARGIN, delta_y - LSM_MARGIN);
                    this.ctx.strokeRect(x + LSM_MARGIN,y + LSM_MARGIN,delta_x - LSM_MARGIN, delta_y - LSM_MARGIN);
                }
                prev_x = x + delta_x;
            });
        });

        const image = new Img();
        image.setAttribute('src', this.canvas.dom.toDataURL());
        image.addClass('img-fluid rounded m-2 layout-choice');
        image.setAttribute('data-id', 1);
        return image;
    
    }
    
}

const _createSpot = () => {
    const div = new Div();
    div.addClass('layout d-inline-block m-2')
    return div;
}
