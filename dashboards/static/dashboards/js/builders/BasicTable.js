import { Table, TableTr, TableTd, TableTh, TableTbody, TableThead } from './BuildingBlocks.js';


/**
 * Bootstrap 4 simple table.
 * 
 * @param {array} data Array of objects.
 * @param {number} max_lines Maximum number of lines (<0 => ALL).
 * @param {array of strings} order Order of the columns. If none or empty, then all and default order.
 * @param {function} onSelect Called when row selected | returns {index: [column, value], ... }
 * @returns HTML Table or null if empty.
 */
export function BasicTable(data, max_lines = 10, order=null, onSelect=null) {

    if (data.length == 0) return null;
    const table = new Table({classes:['table','table-bordered', 'table-hover','table-sm']});
    const head = new TableThead().attachTo(table);
    const head_row = new TableTr().attachTo(head);
    if (order && order.length > 0) {
        order.forEach(column => {
            const col = new TableTh().attachTo(head_row);
            col.setTextContent(column.toUpperCase());
        })        
    } else {
        Object.keys(data[0]).forEach(column => {
            const col = new TableTh().attachTo(head_row);
            col.setTextContent(column.toUpperCase());
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

