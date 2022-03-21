import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, InputNumber } from '../../builders/BuildingBlocks.js';


export class ControlNumber extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data, parent);


    const div = new Div().attachTo(parent);
    div.addClass("info-box  info-component-content");
    //div.setTextContent('NUMBER CONTROL')
    //div.setStyle('height','100%');
    /*
    if (data.data_config.type === 'box') {
      const group = new Div().attachTo(div);
      group.dom.style.width = '100%';
      new Label(data.data_config.name).attachTo(group);
      const input = new InputNumber().attachTo(group);
      input.addClass('form-control');
      input.setAttribute('value', data.data_config.default);
      input.setAttribute('min', data.data_config.min);
      input.setAttribute('max', data.data_config.max);
      input.setAttribute('step', data.data_config.step);
      //input.dom.style.width = '100%';
    } else {
      */
      // slider
      const group = new Div().attachTo(div);
      group.dom.style.width = '100%';
      new Label(data.data_config.name).attachTo(group);
      const slider = new Div().attachTo(group);
      slider.addClass("range range-primary");
      const input = new Input().attachTo(slider);
      input.setAttribute('type','range');
      input.setAttribute('value', data.data_config.default);
      input.setAttribute('min', data.data_config.min);
      input.setAttribute('max', data.data_config.max);
      input.setAttribute('step', data.data_config.step);
      const output = $('<output>');
      output.text(data.data_config.default);
      $(slider.dom).append(output);


  }
}

/*


        <div class="col-xs-6">
          <div class="range range-primary">
            <input type="range" name="range" min="1" max="100" value="50" onchange="rangePrimary.value=value">
            <output id="rangePrimary">50</output>
          </div>
        </div>

                    CN_DEFAULT.val(this.state.data_config.default);
                    CN_MIN.val(this.state.data_config.min);
                    CN_MAX.val(this.state.data_config.max);
                    CN_STEP.val(this.state.data_config.step);
                    CN_TYPE.val(this.state.data_config.type);
                    */