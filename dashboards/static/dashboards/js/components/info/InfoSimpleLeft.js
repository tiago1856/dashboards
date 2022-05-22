
import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, I, Span } from '../../builders/BuildingBlocks.js';
import { getNumberField } from '../Discovery.js';
import { 
    ID_ICON,
    ID_ICON_BACK_COLOR,
    ID_ICON_COLOR,
    ID_ICON_SIZE,
    ID_TEXT_SIZE,
    ID_VALUE_SIZE,
    ID_CARD_BACK_COLOR,
    ID_TEXT_COLOR,
    ID_VALUE_COLOR,
} from '../ComponentType.js';
import { isPropOk } from '../../utils/jsutils.js';
import { getInputData } from '../../Components/ComponentType.js';

/**
 * 
 */
export class InfoSimpleLeft extends BaseComponentContent {
    constructor(context, component, new_query=null) {
        super(context, component, new_query?new_query:component.data.query.query);


        this.div = new Div().attachTo(component.body);
        this.div.addClass("info-box info-component-content");

        const card_back_color = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_CARD_BACK_COLOR))?this.component.data.options[ID_CARD_BACK_COLOR]:getInputData(this.options_data,ID_CARD_BACK_COLOR);
        this.div.setStyle('background-color', card_back_color);


        this.span = new Span().attachTo(this.div);
        this.span.addClass('info-box-icon');// bg-danger');
        const back_color = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_ICON_BACK_COLOR))?this.component.data.options[ID_ICON_BACK_COLOR]:getInputData(this.options_data,ID_ICON_BACK_COLOR);
        const color = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_ICON_COLOR))?this.component.data.options[ID_ICON_COLOR]:getInputData(this.options_data,ID_ICON_COLOR);
        this.span.setStyle('background-color', back_color);
        this.span.setStyle('color', color);
 

        this.icon = new I().attachTo(this.span);
        const ion_icon = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_ICON))?this.component.data.options[ID_ICON]:getInputData(this.options_data,ID_ICON);
        this.icon.addClass('icon ' + ion_icon.replace('ion ',''));

        const icon_size = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_ICON_SIZE))?this.component.data.options[ID_ICON_SIZE]:getInputData(this.options_data,ID_ICON_SIZE);
        this.icon.setStyle("font-size", icon_size + 'px');
        this.span.setStyle("height", icon_size + "px");
        this.span.setStyle("width", icon_size + "px");

        this.content = new Div().attachTo(this.div);
        this.content.addClass('info-box-content');
        this.text = new Span().attachTo(this.content);
        this.text.addClass("info-box-text lead");
        this.text.setTextContent('SEM TEXTO');
        this.value = new Span().attachTo(this.content);
        this.value.addClass("info-box-number");
        this.value.setTextContent('SEM VALOR');

        const text_color = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_TEXT_COLOR))?this.component.data.options[ID_TEXT_COLOR]:getInputData(this.options_data,ID_TEXT_COLOR);
        const value_color = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_VALUE_COLOR))?this.component.data.options[ID_VALUE_COLOR]:getInputData(this.options_data,ID_VALUE_COLOR);
        this.text.setStyle('color', text_color);
        this.value.setStyle('color', value_color);


        //this.text.setStyle("font-size",'100px');

        /*
        this.value.setStyle("font-size","90px");
        */


        const text_size = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_TEXT_SIZE))?this.component.data.options[ID_TEXT_SIZE]:getInputData(this.options_data,ID_TEXT_SIZE);
        this.text.setStyle("font-size", text_size + 'px');

        const value_size = (this.component.data.options && this.component.data.options.hasOwnProperty(ID_VALUE_SIZE))?this.component.data.options[ID_VALUE_SIZE]:getInputData(this.options_data,ID_VALUE_SIZE);
        this.value.setStyle("font-size", value_size + 'px');
        
        //span.setStyle("height", $(div.dom).css('height'));
        //span.setStyle("width", $(div.dom).css('height')); 
                
        this.content.setStyle('max-height', icon_size + "px"); 

        this.onOptionChanged = context.signals.onOptionChanged.add((uuid, {id, value}) => {
            if (uuid !== component.data.uuid) return;
            this.setOption(id, value);
        });

    }

    async execute() {
        const results = await this.execQuery(this.query, null);
        const [comp_text_1, comp_value] = this.prepareData(results, this.component.data);
        if (comp_text_1 !== '') this.text.setTextContent(comp_text_1);   
        if (comp_value) {
            const _value = comp_value + (this.component.data.data_config.text_2!==''?this.component.data.data_config.text_2:"");
            this.value.setTextContent(_value);
        }
    }


    /**
     * 
     * @param {object} data_2_display 
     * @param {object} _data {fields:[], icon:"", text_1:"", text_2:"", value:null}
     * @returns 
     */
    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);

        let value = null;
        let text_1 = null;

        if (data_2_display.length>0) {
            // nothing defined by the user => find the first number column and its name
            if (!_data.data_config.value) {
                const _text_1 = getNumberField(data_2_display,1);
                value = data_2_display[0][_text_1];
                _data.data_config.value = _text_1;
                if (_data.data_config.text_1 === '') {
                    text_1 = _text_1;
                    _data.data_config.text_1 = text_1;
                } else {
                    text_1 = _data.data_config.text_1;
                }                
            } else {
                value = data_2_display[0][_data.data_config.value];
                if (_data.data_config.text_1 === '') {
                    text_1 = getNumberField(data_2_display,1);
                    _data.data_config.text_1 = text_1;
                } else {
                    text_1 = _data.data_config.text_1;
                }                                
            }
        }

        if (!value || !text_1) {
            this.context.signals.onError.dispatch("Erros nos dados!","[InfoSimpleLeft::prepareData]");
        } 

        return [text_1, value];
    }

    setOptions() {
        let options = this.component.data.options;
        if (!options) options = {};
        if (!isPropOk(options, ID_ICON)) options[ID_ICON] = getInputData(this.options_data,ID_ICON);
        if (!isPropOk(options, ID_ICON_BACK_COLOR)) options[ID_ICON_BACK_COLOR] = getInputData(this.options_data,ID_ICON_BACK_COLOR);
        if (!isPropOk(options, ID_ICON_COLOR)) options[ID_ICON_COLOR] = getInputData(this.options_data,ID_ICON_COLOR);
        if (!isPropOk(options, ID_ICON_SIZE)) options[ID_ICON_SIZE] = getInputData(this.options_data,ID_ICON_SIZE);
        if (!isPropOk(options, ID_TEXT_SIZE)) options[ID_TEXT_SIZE] = getInputData(this.options_data,ID_TEXT_SIZE);
        if (!isPropOk(options, ID_VALUE_SIZE)) options[ID_VALUE_SIZE] = getInputData(this.options_data,ID_VALUE_SIZE);
        if (!isPropOk(options, ID_CARD_BACK_COLOR)) options[ID_CARD_BACK_COLOR] = getInputData(this.options_data,ID_CARD_BACK_COLOR);
        if (!isPropOk(options, ID_TEXT_COLOR)) options[ID_TEXT_COLOR] = getInputData(this.options_data,ID_TEXT_COLOR);
        if (!isPropOk(options, ID_VALUE_COLOR)) options[ID_VALUE_COLOR] = getInputData(this.options_data,ID_VALUE_COLOR);

        this.component.data.options = JSON.parse(JSON.stringify(options));
    }


    setOption(id, value) {
        super.setOption(id, value);
        this.component.data.options[id] = value;
        this.context.signals.onChanged.dispatch();
        switch (id) {
            case ID_ICON:
                this.icon.removeClass();
                this.icon.addClass('icon ' + value.replace('ion ',''));
                break;
            case ID_ICON_BACK_COLOR:
                this.span.setStyle("background-color",value);
                break;
            case ID_ICON_COLOR:
                this.span.setStyle("color",value);
                break;
            case ID_ICON_SIZE:
                this.icon.setStyle("font-size",value + 'px');
                this.span.setStyle("height", value + "px");
                this.span.setStyle("width", value + "px");
                this.content.setStyle('max-height',value + "px"); 
                break;
            case ID_TEXT_SIZE:
                this.text.setStyle("font-size", value + 'px');
                break;
            case ID_VALUE_SIZE:
                this.value.setStyle("font-size", value + 'px');
                break;
            case ID_CARD_BACK_COLOR:
                this.div.setStyle('background-color', value);
                break;
            case ID_TEXT_COLOR:
                this.text.setStyle('color', value);
                break;
            case ID_VALUE_COLOR:
                this.value.setStyle('color', value);
                break;
            default:
        }           
    }

    clear() {
        super.clear();
        this.onOptionChanged.detach();
    }

}

/*
		<div class="info-box">
            <span class="info-box-icon bg-danger">
                <i class="icon ion-md-heart"></i>
            </span>
            <div class="info-box-content">
              	<span class="info-box-text">CPU Traffic</span>
              	<span class="info-box-number">90<small>%</small></span>
            </div>
        </div>
*/