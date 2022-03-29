import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, Span, Br } from '../../builders/BuildingBlocks.js';


export class ControlNumber extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data);


    const div = new Div().attachTo(parent);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

      new Label(data.data_config.name).attachTo(cont);


      const group = new Div().attachTo(cont);
      group.addClass('mx-auto');

      const slider = new Div().attachTo(group);
      slider.addClass("slidecontainer");      

      const lower = new Span().attachTo(slider);
      lower.addClass('slider-output');
      lower.setTextContent(data.data_config.min);

      const input = new Input().attachTo(slider);
      input.addClass('slider');
      input.setAttribute('type','range');
      input.setAttribute('value', data.data_config.default);
      input.setAttribute('min', data.data_config.min);
      input.setAttribute('max', data.data_config.max);
      input.setAttribute('step', data.data_config.step);

      const upper = new Span().attachTo(slider);
      upper.addClass('slider-output');
      upper.setTextContent(data.data_config.max);

      const value = new Span().attachTo(slider);
      value.addClass('slider-output2');
      value.setTextContent(data.data_config.default);

      $(input.dom).on('change', function(e) {
        const _value = $(this).val();
        value.setTextContent(_value);
        context.signals.onCommTriggered.dispatch(data.uuid, data.data_config.name, _value);
      })

      $(input.dom).on('input', function(e) {
        const _value = $(this).val();
        value.setTextContent(_value);
      })      
  }

  execute(onReady=null) {
    if (onReady) onReady();
  }
}