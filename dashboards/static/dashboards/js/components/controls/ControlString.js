import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, Button } from '../../builders/BuildingBlocks.js';


export class ControlString extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data);


    const div = new Div().attachTo(parent);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

    new Label(data.data_config.name).attachTo(cont);

    const group = new Div().attachTo(cont);
    group.addClass('input-group mx-auto')

    const input = new Input().attachTo(group);
    input.addClass('form-control');
    input.setAttribute('value', data.data_config.default);

    const append = new Div().attachTo(group);
    append.addClass("input-group-append");
    const button = new Button('Ok').attachTo(append);
    button.addClass("btn btn-outline-secondary");
    button.setAttribute('type','button');

  }

  execute(onReady=null) {
    if (onReady) onReady();
  }
}
