
import { AwesomeIconAndButton } from "../builders/BuildingBlocks.js";
import { URL_SAVE_LAYOUT } from "../urls.js";
import { fetchPOST } from "../Fetch.js";


const LGDM_MODAL = $('#layout-grid-design-modal');
const LGDM_RESET_BTN = $('#lgdm-reset-btn');
const LGDM_SAVE_CLOSE_BTN = $('#lgdm-save-close-btn');
const LGDM_SAVE_USE_BTN = $('#lgdm-save-use-btn');
const LGDM_ITEMS = $('#lgdm-items');
const LGDM_COLS_SPAN = $('#lgdm-cols-span');
const LGDM_ROWS_SPAN = $('#lgdm-rows-span');
const LGDM_DESIGN_AREA = $('#lgdm-design-area');
const LGDM_TEMPLATES = $('#lgdm-templates');
const LGDM_MULTIPLE = $('#lgdm-multiple');


export function LayoutEditorModal(context) {
	this.context = context;
    const self = this;  
	    
 	
	LGDM_ITEMS.on('change', function() {
		const items = LGDM_ITEMS.val();
		const current = $('.editor-block').length;
		if (items < current) {
			for (let i=current; i> items; i--) {
				LGDM_DESIGN_AREA.children().last().remove();
			}
		} else {
			for (let i=current; i < items; i++) {
				self.createBlock(LGDM_COLS_SPAN.val(), LGDM_ROWS_SPAN.val());
			}			
		}	
		
	});
	
	LGDM_TEMPLATES.on('change', function() {
		const option = LGDM_TEMPLATES.val();
		if (!option) return;
		LGDM_DESIGN_AREA.empty();
		switch (option) {
			case "3-1-1":
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(12,1);
				self.createBlock(12,1);
				break;				
			case "3-2-1":
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(6,1);
				self.createBlock(6,1);
				self.createBlock(12,1);	
				break;
			case "1-3-1":
				self.createBlock(12,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(12,1);	
				break;
			case "2-3-3":
				self.createBlock(6,1);
				self.createBlock(6,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				self.createBlock(4,1);
				break;
				default:				
		}
		LGDM_ITEMS.val($('.editor-block').length);
		LGDM_ROWS_SPAN.val(1);
		LGDM_COLS_SPAN.val(1);	
	});
	
	LGDM_COLS_SPAN.on('change', function() {
		const rows = LGDM_ROWS_SPAN.val();
		const cols = LGDM_COLS_SPAN.val();
		$('.editor-block.editor-block-selected').each(function(i, obj) {
			obj.classList.remove(...obj.classList);
			obj.classList.add('span-col-' + cols,'span-row-' + rows,'editor-block','editor-block-selected');
			obj.setAttribute('data-col', cols);
			obj.setAttribute('data-row', rows);			
		})
	});
	
	LGDM_ROWS_SPAN.on('change', function() {
		const rows = LGDM_ROWS_SPAN.val();
		const cols = LGDM_COLS_SPAN.val();
		$('.editor-block.editor-block-selected').each(function(i, obj) {
			obj.classList.remove(...obj.classList);
			obj.classList.add('span-col-' + cols,'span-row-' + rows,'editor-block','editor-block-selected');
			obj.setAttribute('data-col', cols);
			obj.setAttribute('data-row', rows);			
		})		
	});
	
	LGDM_RESET_BTN.on('click', function() {
		self.reset();
	});


    LGDM_SAVE_CLOSE_BTN.on('click', function() {
        const layout = self.getLayout();
        self.save(layout, () => {
            context.signals.onLayoutsChanged.dispatch();
            LGDM_MODAL.modal('hide');
        })
    });

    LGDM_SAVE_USE_BTN.on('click', function() {
        const layout = self.getLayout();
        self.save(layout, (id) => {
            LGDM_MODAL.modal('hide');
            if (self.onDone) self.onDone(id);
        })        
    });

}


LayoutEditorModal.prototype = {
	/**
	 * Displays the modal.
	 * @param {function} onDone Called when layout is done.
	 */
    show: function(onDone = null) {
        this.onDone = onDone;
		this.reset();			
        LGDM_MODAL.modal('show');
	},
	
	/**
	 * Resets the editor.
	 */
	reset: function() {
		LGDM_DESIGN_AREA.empty();
		LGDM_TEMPLATES.val('');		
		LGDM_ROWS_SPAN.val(1);
		LGDM_COLS_SPAN.val(1);
		LGDM_MULTIPLE.prop('checked', true);
		this.createBlock(1,1);
		LGDM_ITEMS.val($('.editor-block').length);		
	},

	
	/**
	 * Creates a block (spot) in the layout grid.
	 * @param {number} cols Col span.
	 * @param {number} rows Row span.
	 */
	createBlock(cols = 1, rows = 1) {
        // create block
		const div = $('<div>');
		div.addClass('span-col-' + cols + ' span-row-' + rows + ' editor-block');
		div.attr('data-col',cols);
		div.attr('data-row',rows);

        // remove block thorugh button
        const button = new AwesomeIconAndButton('','fas fa-times fa-sm').attachTo(div.get(0));
        button.addClass('block-remove-button');
        $(button.dom).on('click', function() {
            div.remove();
        });

        // select block
		LGDM_DESIGN_AREA.append(div);
		div.on('click',function(e){
			if ($(this).hasClass('editor-block-selected')) {
				if (!LGDM_MULTIPLE.prop('checked')) {
					$('.editor-block.editor-block-selected').each(function(i, obj) {
						obj.classList.remove('editor-block-selected');
					});
				} else {
					$(this).removeClass('editor-block-selected');
				}
			} else {
				if (!LGDM_MULTIPLE.prop('checked')) {
					$('.editor-block.editor-block-selected').each(function(i, obj) {
						obj.classList.remove('editor-block-selected');
					});
				}				
				$(this).addClass('editor-block-selected');			
			}
            if ($('.editor-block.editor-block-selected').length <= 1) {
                LGDM_COLS_SPAN.val($(this).attr('data-col'));
                LGDM_ROWS_SPAN.val($(this).attr('data-row'));	
            } else {
                LGDM_ROWS_SPAN.val('');
                LGDM_COLS_SPAN.val('');
            }
		});		
	},

	/**
	 * Get an array describing the layout.
	 * @returns The layout data.
	 */
    getLayout() {
		const layout = [];
		$('.editor-block').each(function(i, obj) {
			const pair = [0,0];
			obj.classList.forEach(block => {
			  const n = block.replace(/[^0-9]/g,'');
			  if (block.includes('span-col')) pair[0] = parseInt(n);
			  if (block.includes('span-row')) pair[1] = parseInt(n);
			})
			layout.push(pair);
		});
		return layout;
    },

	/**
	 * Saves the layout.
	 * @param {object} data Layout data
	 * @param {function} onReady Called when ready.
	 */
    save(data, onReady = null) {
        fetchPOST(
            URL_SAVE_LAYOUT, 
            {
                name: uuidv4(),
                description: '',
                layout: data,
            }, 
            result => {
                if (onReady) onReady(result.id);
            },
            (error) => {
              this.context.signals.onError.dispatch(error,"[Component::saveComponent]");                
            }
        )
    },
}
