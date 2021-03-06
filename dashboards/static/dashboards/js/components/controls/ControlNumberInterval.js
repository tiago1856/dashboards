import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label, Span, Br } from '../../builders/BuildingBlocks.js';


export class ControlNumberInterval extends BaseComponentContent {
  constructor(context, component) {
    super(context, component);


    const div = new Div().attachTo(component.body);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

    new Label('number interval').attachTo(cont);

  }

  async execute(component_content = null) {
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