import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, Label, Input, AwesomeIconAndButton } from '../../builders/BuildingBlocks.js';


export class ControlBool extends BaseComponentContent {
  constructor(context, component) {
    super(context, component);

    const self = this;

    const div = new Div().attachTo(component.body);
    div.addClass("info-box info-component-content");

    const cont = new Div().attachTo(div);
    cont.dom.style.width = '100%';

    new Label(component.data.data_config.name + ":").attachTo(cont);
    
    const sync_btn = new AwesomeIconAndButton('','fa fa-sync').attachTo(cont);
    sync_btn.addClass('btn btn-outline-secondary btn-sm ml-2');
    
   /*
   const link = new L
    const sync_btn = new I().attachTo(cont);
    sync_btn.addClass('fa fa-sync ml-2');
    sync_btn.setStyle('color', 'blue');
    sync_btn.setStyle('background-color', 'yellow');
    sync_btn.setStyle('cursor', 'default');
    */

    const group = new Div().attachTo(cont);
    group.addClass('mx-auto');

    this.input = new Input().attachTo(group);
    this.input.addClass('text-center');
    this.input.setAttribute('type', 'checkbox');
    if (component.data.data_config.default === component.data.data_config.true) {
      this.input.setAttribute('checked', 'true');
    }
    this.input.setAttribute('data-toggle', 'toggle');
    this.input.setAttribute('data-on', "<i class='fa fa-thumbs-up'></i> " + component.data.data_config.true);
    this.input.setAttribute('data-off', "<i class='fa fa-thumbs-down'></i> " + component.data.data_config.false);
    this.input.setAttribute('data-onstyle', 'success');
    this.input.setAttribute('data-offstyle', 'danger');
    this.input.setAttribute('data-width', '100%');
    $(this.input.dom).bootstrapToggle({
      on: component.data.data_config.true,
      off: component.data.data_config.false
    });


  

    $(this.input.dom).on('change', function(e) {
      const _value = $(this).prop('checked')?component.data.data_config.true:component.data.data_config.false;//$(this).val();
      self.result[0].value = _value;
     context.signals.onCommTriggered.dispatch(component.data.uuid, [{outpin: component.data.data_config.name, value: _value, index: 0}]);

    })

    $(sync_btn.dom).on('click', function(e) {
      const _value = $(this).prop('checked')?component.data.data_config.true:component.data.data_config.false;
      self.result[0].value = _value;
      context.signals.onCommTriggered.dispatch(component.data.uuid, [{outpin: component.data.data_config.name, value: _value, index: 0}]);
    }); 
    
    if (context.is_snapshot) this.input.setAttribute('disabled', 'true');

  }

  async execute(component_content = null) {
    this.result = [{name: this.component.data.data_config.name}];
    if (component_content) {
      if (component_content) {
        $(this.input.dom).bootstrapToggle('on');
      } else {
        $(this.input.dom).bootstrapToggle('off');
      }
      this.result[0].value = component_content;
    } else {
      this.result[0].value = $(this.input.dom).prop('checked');
    }
  }

  getContents() {
    return $(this.input.dom).prop('checked');
  }
}
