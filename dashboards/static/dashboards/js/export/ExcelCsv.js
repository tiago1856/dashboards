// --------------------
// Dependencies:
//      https://github.com/SheetJS/sheetjs
//      https://github.com/eligrey/FileSaver.js/
// --------------------



/**
 * Export data to either an excel (single page) ou to a csv file.
 * @param {array of objects} data Array containing a single object with the data to export.
 * @param {string} filename Filename.
 * @param {string} extension File extension: .xlsx | .csv
 * @param {string} page_name Page name.
 */
export function exportObject2ExcelCsv(data=null, filename = 'export', extension=".xlsx", page_name='pagina 1') {
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, page_name);
    XLSX.writeFile(wb,filename + extension);
}

/**
 * Export an array of objects to an excel file, with multiple pages.
 * Data lenght must be the same as pages_names.
 * 
 * Example:
 *      const data = [{something: '1', something_else:'11111111'}, {something: '2', something_else:'222222222'}];
 *      exportObject2Excel(data,['pag 1','pag 2']);
 * @param {array of objects} data Data to export.
 * @param {array of strings} pages_names Page names.
 * @param {string} filename Excel output name.
 * @returns True is success, false otherwise.
 */
export function exportObject2Excel(data=[], pages_names=[], filename = 'export.xlsx') {
	if (!data || !pages_names || !filename) return false;
	if (data.length != pages_names.length) return false;
	if (data.length == 0) return false;
    const wb = XLSX.utils.book_new();
    for (let i=0; i<data.length; i++) {
		const page_data = XLSX.utils.json_to_sheet(data[i]);
		XLSX.utils.book_append_sheet(wb, page_data, pages_names[i]);	
	}    
    XLSX.writeFile(wb,filename);
    return true;
}