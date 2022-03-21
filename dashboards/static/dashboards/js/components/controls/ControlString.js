import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Input, Label } from '../../builders/BuildingBlocks.js';


export class ControlString extends BaseComponentContent {
  constructor(context, data, parent, opt_btn) {
    super(context, data, parent);


    const div = new Div().attachTo(parent);
    div.addClass("info-box info-component-content");

    const group = new Div().attachTo(div);
    group.dom.style.width = '100%';
    new Label(data.data_config.name).attachTo(group);
    const input = new Input().attachTo(group);
    input.addClass('form-control');
    input.setAttribute('value', data.data_config.default);


  }
}

/*
                    CS_NAME.val(this.state.data_config.name);
                    CN_DEFAULT.val(this.state.data_config.default);
                    CS_TYPE.val(this.state.data_config.type);
                    */