import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Label, Input, Br } from '../../builders/BuildingBlocks.js';


export class ControlBool extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data);


    const div = new Div().attachTo(parent);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

    new Label(data.data_config.name).attachTo(cont);

    const group = new Div().attachTo(cont);
    group.addClass('mx-auto');

    const input = new Input().attachTo(group);
    input.addClass('text-center');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('checked', data.data_config.default === data.data_config.true?'true':'false');
    input.setAttribute('data-toggle', 'toggle');
    input.setAttribute('data-on', "<i class='fa fa-thumbs-up'></i> " + data.data_config.true);
    input.setAttribute('data-off', "<i class='fa fa-thumbs-down'></i> " + data.data_config.false);
    input.setAttribute('data-onstyle', 'success');
    input.setAttribute('data-offstyle', 'danger');
    input.setAttribute('data-width', '100%');
    $(input.dom).bootstrapToggle();

  }

  execute(onReady=null) {
    if (onReady) onReady();
  }
}
