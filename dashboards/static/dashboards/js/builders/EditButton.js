
import { ButtonAndAwesomeIcon } from './BuildingBlocks.js';


export class EditButton extends ButtonAndAwesomeIcon {
    constructor(onClick = null) {
        super('','fa fa-pencil-alt');

        this.addClass('btn text-primary align-top btn-tool btn-sm editable-component');
        this.setAttribute('data-toggle','tooltip');
        this.setAttribute('title','Editar titulo');

        const self = this;
        if (onClick) {
            $(self.dom).on('click', function() {
                onClick();
            })
        }
    }
}