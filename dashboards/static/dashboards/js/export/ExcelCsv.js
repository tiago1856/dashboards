

/**
 * Export to either excel ou to csv.
 * @param {object} data Object with the data to export.
 * @param {string} filename Filename.
 * @param {string} extension File extension: .xlsx | .csv
 * @param {string} page_name Page name.
 */
export function exportObject2ExcelCsv(data=null, filename = 'dataoutput', extension=".xlsx", page_name='page_1') {
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, page_name);
    XLSX.writeFile(wb,filename + extension);
}

