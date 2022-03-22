import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, Span, Br } from '../../builders/BuildingBlocks.js';


export class ControlNumber extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data, parent);


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
        value.setTextContent($(this).val());
        
      })

      context.signals.onComponentUpdated.dispatch(data);

  }
}

/*


<div class="slidecontainer">
	<output class="range-limits">0</output>
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
  <output class="range-limits">100</output>
</div>

                    CN_DEFAULT.val(this.state.data_config.default);
                    CN_MIN.val(this.state.data_config.min);
                    CN_MAX.val(this.state.data_config.max);
                    CN_STEP.val(this.state.data_config.step);
                    CN_TYPE.val(this.state.data_config.type);
                    */