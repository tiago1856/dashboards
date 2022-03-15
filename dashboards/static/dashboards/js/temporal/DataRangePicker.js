
const GLOBLE_DATE_CONFIG = $("#global-date-format");



export class DataRangePicker {
    constructor (id, onSelection = null, format = 'YYYY-MM-DD') {
        this.start = null;
        this.end = null;
        this.format = format;
        this.selected_format = null;
        this.id = id;

        const self = this;

        this.setFormat(format);

        $(id).daterangepicker({
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
            }
        )
        this.start = $(id).data('daterangepicker').startDate;
        this.end = $(id).data('daterangepicker').endDate;      

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


    setFormat(format) {
        this.selected_format = format;
        const current = $('.date-format-selected');
        if (current.attr('data-dateformat') === format) return;
        current.removeClass('date-format-selected');
        GLOBLE_DATE_CONFIG.find(`[data-dateformat='${format}']`).addClass('date-format-selected');
        // update display
        $(this.id + ' span').html(this.start.format(this.selected_format) + ' - ' + this.end.format(this.selected_format));
    }
}