import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, Span, AwesomeIconAndButton, Button } from '../../builders/BuildingBlocks.js';


export class ControlNumber extends BaseComponentContent {
  constructor(context, component) {
    super(context, component);

    const div = new Div().attachTo(component.body);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

      new Label(component.data.data_config.name + ":").attachTo(cont);

      const sync_btn = new AwesomeIconAndButton('','fa fa-sync').attachTo(cont);
      sync_btn.addClass('btn btn-outline-secondary btn-sm ml-2');

      const group = new Div().attachTo(cont);
      //group.addClass('mx-auto');
      //group.setStyle('min-width','100%')

      const slider = new Div().attachTo(group);
      slider.addClass("slidecontainer");
      //slider.setStyle('display','inline flow')

      const lower = new Span().attachTo(slider);
      lower.addClass('slider-output');
      lower.setTextContent(component.data.data_config.min);

      const input = new Input().attachTo(slider);
      input.addClass('slider');
      input.setAttribute('type','range');
      input.setAttribute('value', component.data.data_config.default);
      input.setAttribute('min', component.data.data_config.min);
      input.setAttribute('max', component.data.data_config.max);
      input.setAttribute('step', component.data.data_config.step);

      const upper = new Span().attachTo(slider);
      upper.addClass('slider-output');
      upper.setTextContent(component.data.data_config.max);

      const value = new Span().attachTo(slider);
      value.addClass('slider-output2');
      value.setTextContent(component.data.data_config.default);
              
            
      $(input.dom).on('change', function(e) {
        const _value = $(this).val();
        value.setTextContent(_value);
        context.signals.onCommTriggered.dispatch(component.data.uuid, [{outpin: component.data.data_config.name, value: _value, index: 0}]);
      })

      $(input.dom).on('input', function(e) {
        const _value = $(this).val();
        value.setTextContent(_value);
      })

      $(sync_btn.dom).on('click', function(e) {
        const _value = input.getValue();
        context.signals.onCommTriggered.dispatch(component.data.uuid, [{outpin: component.data.data_config.name, value: _value, index: 0}]);
      });
  }

  async execute() {
  }
}
