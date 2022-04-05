import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, Button } from '../../builders/BuildingBlocks.js';


export class ControlString extends BaseComponentContent {
  constructor(context, component) {
    super(context, component);


    const div = new Div().attachTo(component.body);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

    new Label(component.data.data_config.name).attachTo(cont);

    const group = new Div().attachTo(cont);
    group.addClass('input-group mx-auto')

    const input = new Input().attachTo(group);
    input.addClass('form-control');
    input.setAttribute('value', component.data.data_config.default);

    const append = new Div().attachTo(group);
    append.addClass("input-group-append");
    const button = new Button('Ok').attachTo(append);
    button.addClass("btn btn-outline-secondary");
    button.setAttribute('type','button');

    $(input.dom).on('change', function(e) {
      const _value = $(this).val();
      //context.signals.onCommTriggered.dispatch(component.data.uuid, component.data.data_config.name, _value);
      context.signals.onCommTriggered.dispatch(component.data.uuid, [{outpin: component.data.data_config.name, value: _value, index: 0}]);

    })


  }

  execute(onReady=null) {
    if (onReady) onReady();
  }
}
