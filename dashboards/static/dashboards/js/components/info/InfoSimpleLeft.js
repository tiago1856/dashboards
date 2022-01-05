
import { BaseComponentContent } from '../BaseComponentContent.js';
import { Div, I, Span } from '../../builders/BuildingBlocks.js';


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


        const content = new Div().attachTo(div);
        content.addClass('info-box-content');
        const text = new Span().attachTo(content);
        text.addClass("info-box-text lead");
        text.setTextContent('SEM TEXTO');
        const value = new Span().attachTo(content);
        value.addClass("info-box-number");
        value.setTextContent('SEM VALOR');
     

        this.execQuery(data.query.query, null, (results) => {
            const component_data = this.prepareData(results, data);            
            if (data.data_config.icon !== '') {
                $(icon.dom).removeClass();
                $(icon.dom).addClass(data.data_config.icon);
            }
            if (data.data_config.text_1 !== '') text.setTextContent(data.data_config.text_1);            
            if (component_data) {
                const _value = component_data + (data.data_config.text_2!==''?data.data_config.text_2:"");
                value.setTextContent(_value);
            }
        });

        $(opt_btn).on('click',function() {
        });
    }

    prepareData(data_2_display, _data=null) {
        super.prepareData(data_2_display);

        if (data_2_display.length > 0) {
            return data_2_display[0][_data.data_config.value];
        }

        return null;
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