import { Table, TableTr, TableTd, TableTh, TableTbody, TableThead } from './BuildingBlocks.js';


/**
 * Bootstrap 4 simple table.
 * 
 * @param {array} data Array of objects.
 * @param {number} max_lines Maximum number of lines (<0 => ALL).
 * @param {array of strings} order Order of the columns.
 * @returns HTML Table or null if empty.
 */
export function BasicTable(data, max_lines = 10, order=null) {

    if (data.length == 0) return null;
    const table = new Table({classes:['table','table-bordered', 'table-hover','table-sm']});
    //table.setId(uuidv4());
    const head = new TableThead().attachTo(table);
    const head_row = new TableTr().attachTo(head);
    if (order) {
        order.forEach(column => {
            const col = new TableTh().attachTo(head_row);
            col.setTextContent(column.toUpperCase());
        })        
    } else {
        Object.keys(data[0]).forEach(column => {
            //if (order && !order.includes(column)) return false;
            const col = new TableTh().attachTo(head_row);
            col.setTextContent(column.toUpperCase());
        })
    }

    const body = new TableTbody().attachTo(table);
    
    data.forEach((row, index) => {
        if (max_lines >= 0 && index >= max_lines) return false;
        const _row = new TableTr().attachTo(body);
        if (order) {
            order.forEach(_order => {
                const td = new TableTd().attachTo(_row);
                td.setTextContent(row[_order]);
            });
        } else {
            for (const v in row) {
                const td = new TableTd().attachTo(_row);
                td.setTextContent(row[v]);
            }
        }
    })
    
    return table;

}

