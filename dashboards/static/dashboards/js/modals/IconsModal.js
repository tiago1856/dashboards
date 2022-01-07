

const ICONS_MODAL = $('#icons-modal');
const ICON_CONTAINER = $('.icon-results__cell');


export function IconsModal(context) {
    this.context = context;

    this.onSelected = null;
    this.selected = null;
    const self = this;

    ICON_CONTAINER.on("click",function(e) {
        if (self.selected) self.selected.removeClass('selected-icon');	
        self.selected = $(this).children('.ion').first();	
        if (self.onSelected) self.onSelected(self.selected.attr('class'));
        self.selected.addClass("selected-icon");            
    });

}


IconsModal.prototype = {
    /**
     * Shows the modal.
     * @param {string} icon_class Ionicons full class.
     * @param {function} onSelected Called when icon selected.
     */
    show: function(icon_class=null, onSelected = null) {
        this.onSelected = onSelected;
        this.icon_class = icon_class;

        this.selected = $("[class='" + icon_class + "']");
        this.selected.addClass('selected-icon');

        ICONS_MODAL.modal('show')
    },
}