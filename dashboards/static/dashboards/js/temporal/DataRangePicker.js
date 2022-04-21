
import { DEFAULT_DATE_FORMAT } from '../constants.js';

// REQUIRED FOR COMMS
export const GLOBAL_CALENDAR_NAME = "Calendário Global";
export const GLOBAL_CALENDAR_UUID = "uuid-global-calendar";
export const GLOBAL_CALENDAR_OUTPUT_PINS = ['Data Inicio', 'Ano Inicio', 'Mês Inicio', 'Dia Inicio', 'Data Fim', 'Ano Fim', 'Mês Fim', 'Dia Fim']
export const GLOBAL_CALENDAR_INPUT_PINS = [];

const GLOBLE_DATE_CONFIG = $("#global-date-format");
const DATARANGE_BTN_ID = '#daterange-btn';

export class DataRangePicker {
    /**
     * 
     * @param {Context} context 
     * @param {*} onSelection 
     * @param {*} format 
     */
    constructor (context, onSelection = null, format = DEFAULT_DATE_FORMAT) {
        this.context = context;
        this.start = null;
        this.end = null;
        this.format = format;
        this.selected_format = null;

        const self = this;

        this.setFormat(format);

        $(DATARANGE_BTN_ID).daterangepicker({
            ranges   : {
                'Hoje'       : [moment(), moment()],
                'Ontem'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Ultimos 7 Dias' : [moment().subtract(6, 'days'), moment()],
                'Ultimos 30 Dias': [moment().subtract(29, 'days'), moment()],
                'Este Mês'  : [moment().startOf('month'), moment().endOf('month')],
                'Ultimo Mês'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
                startDate: moment().subtract(29, 'days'),
                endDate  : moment()
            },
            function (start, end) {
                this.start = start;
                this.end = end;                
                if (onSelection) onSelection(start.format(self.selected_format), end.format(self.selected_format));
                const parts = self.getParts();
                context.signals.onCommTriggered.dispatch(GLOBAL_CALENDAR_UUID, [
                    parts.start,                    
                    parts.start_year,
                    parts.start_month,
                    parts.start_day,
                    parts.end,
                    parts.end_year,
                    parts.end_month,
                    parts.end_day,
                ]);
            }
        )
        this.start = $(DATARANGE_BTN_ID).data('daterangepicker').startDate;
        this.end = $(DATARANGE_BTN_ID).data('daterangepicker').endDate;      

        GLOBLE_DATE_CONFIG.on('click', 'li', function() {
            self.setFormat($(this).attr('data-dateformat'))
        })

    }

    getDate() {
        return [this.start.format(this.selected_format), this.end.format(this.selected_format)];
    }

    getFormat() {
        return this.selected_format;
    }

    getParts() {
        return {
            start : this.start.format(this.selected_format),
            end : this.end.format(this.selected_format),
            start_year : this.start.format('YYYY'),
            start_month : this.start.format('MM'),
            start_day : this.start.format('DD'),
            end_year : this.end.format('YYYY'),
            end_month : this.end.format('MM'),
            end_day : this.end.format('DD')
        }
    }


    setFormat(format = null, dispatch_signal = true) {
        if (!format) return;
        this.selected_format = format;
        const current = $('.date-format-selected');
        if (current.attr('data-dateformat') === format) return;
        current.removeClass('date-format-selected');
        GLOBLE_DATE_CONFIG.find(`[data-dateformat='${format}']`).addClass('date-format-selected');
        // update display
        $(DATARANGE_BTN_ID + ' span').html(this.start.format(this.selected_format) + ' - ' + this.end.format(this.selected_format));

        this.context.signals.onGlobalDateFormatChanged.dispatch(this.selected_format);
        if (dispatch_signal) this.context.signals.onChanged.dispatch();
    }
}