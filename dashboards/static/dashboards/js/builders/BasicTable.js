import { Table, TableTr, TableTd, TableTh, TableTbody, TableThead } from './BuildingBlocks.js';
import { 
    ID_HEADER_BACK_COLOR,
    ID_HEADER_COLOR,
    ID_HEADER_ALIGNMENT,
    ID_HEADER_VERTICAL_ALIGNMENT,
    ID_ROWS_BACK_COLOR,
    ID_ROWS_COLOR,
    ID_ROWS_ALIGNMENT,
    ID_ROWS_VERTICAL_ALIGNMENT,
    getInputDataFromType,
} from '../Components/ComponentType.js';
import { VISUALIZATION_TYPE } from '../components/VisualizationType.js'


/**
 * Bootstrap 4 simple table.
 * 
 * @param {array} data Array of objects.
 * @param {number} max_lines Maximum number of lines (<0 => ALL).
 * @param {array of strings} order Order of the columns. If none or empty, then all and default order.
 * @param {function} onSelect Called when row selected | returns {index: [column, value], ... }
 * @param {object} options Table configuration: colors, alignments, ...
 * @returns HTML Table or null if empty.
 */ 
export function BasicTable(data, max_lines = 10, order=null, onSelect=null, options=null) {

    if (data.length == 0) return null;
    const table = new Table({classes:['table','table-bordered', 'table-hover','table-sm']});
    const head = new TableThead().attachTo(table);
    const head_row = new TableTr().attachTo(head);
    if (order && order.length > 0) {
        order.forEach(column => {
            const col = new TableTh().attachTo(head_row);
            col.setTextContent(column.toUpperCase());
            if (options) {
                const col_q = $(col.dom);
                if (options.hasOwnProperty(ID_HEADER_BACK_COLOR)) col_q.css('background-color', options[ID_HEADER_BACK_COLOR]);
                if (options.hasOwnProperty(ID_HEADER_COLOR)) col_q.css('color', options[ID_HEADER_COLOR]);
                if (options.hasOwnProperty(ID_HEADER_ALIGNMENT)) col_q.css('text-align', options[ID_HEADER_ALIGNMENT]);
                if (options.hasOwnProperty(ID_HEADER_VERTICAL_ALIGNMENT)) col_q.css('vertical-align', options[ID_HEADER_VERTICAL_ALIGNMENT]);
            } else {
                const col_q = $(col.dom);              
                col_q.css('background-color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS,ID_HEADER_BACK_COLOR));
                col_q.css('color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_HEADER_COLOR));
                col_q.css('text-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_HEADER_ALIGNMENT));
                col_q.css('vertical-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_HEADER_VERTICAL_ALIGNMENT));
            }
        })        
    } else {
        Object.keys(data[0]).forEach(column => {
            const col = new TableTh().attachTo(head_row);
            col.setTextContent(column.toUpperCase());
            if (options) {
                const col_q = $(col.dom);
                if (options.hasOwnProperty(ID_HEADER_BACK_COLOR)) col_q.css('background-color', options[ID_HEADER_BACK_COLOR]);
                if (options.hasOwnProperty(ID_HEADER_COLOR)) col_q.css('color', options[ID_HEADER_COLOR]);
                if (options.hasOwnProperty(ID_HEADER_ALIGNMENT)) col_q.css('text-align', options[ID_HEADER_ALIGNMENT]);
                if (options.hasOwnProperty(ID_HEADER_VERTICAL_ALIGNMENT)) col_q.css('vertical-align', options[ID_HEADER_VERTICAL_ALIGNMENT]);
            } else {
                const col_q = $(col.dom);
                col_q.css('background-color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS,ID_HEADER_BACK_COLOR));
                col_q.css('color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_HEADER_COLOR));
                col_q.css('text-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_HEADER_ALIGNMENT));
                col_q.css('vertical-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_HEADER_VERTICAL_ALIGNMENT));
            }         
        })
    }

    const body = new TableTbody().attachTo(table);
    data.forEach((row, index) => {
        if (max_lines >= 0 && index >= max_lines) return false;
        const _row = new TableTr().attachTo(body);
        if (order && order.length > 0) {
            order.forEach((_order,index) => {
                const td = new TableTd().attachTo(_row);
                td.setTextContent(row[_order]);
                if (onSelect) {
                    td.setAttribute('data-header',order[index]);
                    td.setAttribute('data-index',index);
                }
                if (options) {
                    const td_q = $(td.dom);
                    if (options.hasOwnProperty(ID_ROWS_BACK_COLOR)) td_q.css('background-color', options[ID_ROWS_BACK_COLOR]);
                    if (options.hasOwnProperty(ID_ROWS_COLOR)) td_q.css('color', options[ID_ROWS_COLOR]);
                    if (options.hasOwnProperty(ID_ROWS_ALIGNMENT)) td_q.css('text-align', options[ID_ROWS_ALIGNMENT]);
                    if (options.hasOwnProperty(ID_ROWS_VERTICAL_ALIGNMENT)) td_q.css('vertical-align', options[ID_ROWS_VERTICAL_ALIGNMENT]);
                } else {
                    const col_q = $(td.dom);
                    col_q.css('background-color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS,ID_ROWS_BACK_COLOR));
                    col_q.css('color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_ROWS_COLOR));
                    col_q.css('text-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_ROWS_ALIGNMENT));
                    col_q.css('vertical-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_ROWS_VERTICAL_ALIGNMENT));
                }  
            });
        } else {
            const headers = Object.keys(data[0]);
            for (const v in row) {
                const td = new TableTd().attachTo(_row);
                td.setTextContent(row[v]);
                if (onSelect) {
                    td.setAttribute('data-header',headers[v]);
                    td.setAttribute('data-index',v);
                }
                if (options) {
                    const td_q = $(td.dom);
                    if (options.hasOwnProperty(ID_ROWS_BACK_COLOR)) td_q.css('background-color', options[ID_ROWS_BACK_COLOR]);
                    if (options.hasOwnProperty(ID_ROWS_COLOR)) td_q.css('color', options[ID_ROWS_COLOR]);
                    if (options.hasOwnProperty(ID_ROWS_ALIGNMENT)) td_q.css('text-align', options[ID_ROWS_ALIGNMENT]);
                    if (options.hasOwnProperty(ID_ROWS_VERTICAL_ALIGNMENT)) td_q.css('vertical-align', options[ID_ROWS_VERTICAL_ALIGNMENT]);
                } else {
                    const col_q = $(td.dom);
                    col_q.css('background-color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS,ID_ROWS_BACK_COLOR));
                    col_q.css('color', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_ROWS_COLOR));
                    col_q.css('text-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_ROWS_ALIGNMENT));
                    col_q.css('vertical-align', getInputDataFromType('TABLE',VISUALIZATION_TYPE.TS, ID_ROWS_VERTICAL_ALIGNMENT));
                }               
            }
        }
    })

    if (onSelect) {
        let old_selection = null;
        $(table.dom).find('tr').on('click', function () {            
            //const selected_row = {};
            const selected_row = [];
            const row = $(this).find('td'); 
            if (old_selection) old_selection.removeClass('selected-row');
            old_selection = row;
            if (row.hasClass('selected-row')) {
                row.removeClass('selected-row');
            } else {
                row.addClass('selected-row');
            }
            row.each(function(e) {
                const value = $(this).text();
                const column = $(this).attr('data-header');
                // index necessary since columns can have the same name
                const index = $(this).attr('data-index');
                //selected_row[index] = [column, value];
                selected_row.push({outpin: column, value: value, index: index});
            });
            onSelect(selected_row);
        });  
    }  
    
    return table;

}

