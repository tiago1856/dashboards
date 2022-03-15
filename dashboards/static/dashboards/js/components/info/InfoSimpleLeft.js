
import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, I, Span } from '../../builders/BuildingBlocks.js';
import { getNumberField, getStringField, isNumber } from '../Discovery.js';


/**
 * 
 */
export class InfoSimpleLeft extends BaseComponentContent {
    constructor(context, data, parent, opt_btn) {
        super(context, data, parent);

        const div = new Div().attachTo(parent);
        div.addClass("info-box");

        //div.setStyle('height','100%');
        const span = new Span().attachTo(div);
        span.addClass('info-box-icon bg-danger');
        const icon = new I().attachTo(span);
        icon.addClass("icon ion-md-alert");
        icon.setStyle("font-size","56px");


        const content = new Div().attachTo(div);
        content.addClass('info-box-content');
        const text = new Span().attachTo(content);
        text.addClass("info-box-text lead");
        text.setTextContent('SEM TEXTO');
        const value = new Span().attachTo(content);
        value.addClass("info-box-number");
        value.setTextContent('SEM VALOR');
     

        this.execQuery(data.query.query, null, (results) => {
            const [comp_text_1, comp_value] = this.prepareData(results, data);
            if (data.data_config.icon !== '') {
                $(icon.dom).removeClass();
                $(icon.dom).addClass(data.data_config.icon);
            }
            if (comp_text_1 !== '') text.setTextContent(comp_text_1,);            
            if (comp_value) {
                const _value = comp_value + (data.data_config.text_2!==''?data.data_config.text_2:"");
                value.setTextContent(_value);
            }
            context.signals.onComponentUpdated.dispatch(data);
        });

        $(opt_btn).on('click',function() {
        });
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