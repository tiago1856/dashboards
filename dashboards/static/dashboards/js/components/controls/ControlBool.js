import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Label, Input, Br } from '../../builders/BuildingBlocks.js';


export class ControlBool extends BaseComponentContent {
  constructor(context, component) {
    super(context, component);


    const div = new Div().attachTo(component.body);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

    new Label(component.data.data_config.name).attachTo(cont);

    const group = new Div().attachTo(cont);
    group.addClass('mx-auto');

    const input = new Input().attachTo(group);
    input.addClass('text-center');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('checked', component.data.data_config.default === component.data.data_config.true?'true':'false');
    input.setAttribute('data-toggle', 'toggle');
    input.setAttribute('data-on', "<i class='fa fa-thumbs-up'></i> " + component.data.data_config.true);
    input.setAttribute('data-off', "<i class='fa fa-thumbs-down'></i> " + component.data.data_config.false);
    input.setAttribute('data-onstyle', 'success');
    input.setAttribute('data-offstyle', 'danger');
    input.setAttribute('data-width', '100%');
    $(input.dom).bootstrapToggle({
      on: component.data.data_config.true,
      off: component.data.data_config.false
    });

    $(input.dom).on('change', function(e) {
      const _value = $(this).prop('checked')?component.data.data_config.true:component.data.data_config.false;//$(this).val();
      context.signals.onCommTriggered.dispatch(component.data.uuid, component.data.data_config.name, _value);
    })

  }

  execute(onReady=null) {
    if (onReady) onReady();
  }
}
