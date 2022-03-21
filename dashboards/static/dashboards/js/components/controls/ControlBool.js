import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Label, Input, Br } from '../../builders/BuildingBlocks.js';


export class ControlBool extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data, parent);


    const div = new Div().attachTo(parent);
    div.addClass("info-box info-component-content");

    const group = new Div().attachTo(div);
    //group.addClass('text-center');
    group.dom.style.width = '100%';
    new Label(data.data_config.name).attachTo(group);
    new Br().attachTo(group);

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
}
/*


<input type="checkbox" checked data-toggle="toggle" data-on="Ready" data-off="Not Ready" data-onstyle="success" data-offstyle="danger">
</input>

<div class="form-check-inline">
  <label class="form-check-label">
    <input type="radio" class="form-check-input" name="optradio">Option 1
  </label>
</div>
<div class="form-check-inline">
  <label class="form-check-label">
    <input type="radio" class="form-check-input" name="optradio">Option 2
  </label>
</div>


                    CB_NAME.val(this.state.data_config.name);
                    CB_DEFAULT.val(this.state.data_config.default);
                    CB_TRUE.val(this.state.data_config.true);
                    CB_FALSE.val(this.state.data_config.false);
                    CB_TYPE.val(this.state.data_config.type);
                    */