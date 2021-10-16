
export class DataRangePicker {
    constructor (id, onSelection = null) {
        this.start = null;
        this.end = null;

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
                if (onSelection) onSelection(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            }
        )
        this.start = $(id).data('daterangepicker').startDate;
        this.end = $(id).data('daterangepicker').endDate;
    }

    getDate() {
        return [this.start.format('YYYY-MM-DD'), this.end.format('YYYY-MM-DD')];
    }
}