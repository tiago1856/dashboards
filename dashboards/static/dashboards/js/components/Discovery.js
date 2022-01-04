
/**
 * Valid date formats.
 */
const DATE_FORMATS = [
    moment.ISO_8601,    // => YYYY*
    "MM/DD/YYYY",
    "MM-DD-YYYY",
    "YYYY-MM-DD",
]

/**
 * Checks if an object is a number.
 * @param {any} n Object to check.
 * @returns True if n is a number. False otherwise.
 */
export const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Get a column name of a supposed column of numbers.
 * Note: it only checks the first value.
 * @param {object} data_2_display [{field1:value, field2:value}, ...]
 * @param {number} n n=1 => first | n=2 => second | ...
 * @returns The column name of a supposed column of numbers.
 */
export const getNumberField = (data_2_display, n=1) => {
    const keys = Object.keys(data_2_display[0]);
    for (let i=0; i<keys.length; i++) {
        // number and not date
        if (isNumber(data_2_display[0][keys[i]]) &&
        !moment(data_2_display[0][keys[i]], DATE_FORMATS, true).isValid()) {
            n--;
            if (n==0) return keys[i]           
        }
    }
    return null;
}

/**
 * Get a column name of a supposed column of strings.
 * Note: it only checks the first value.
 * @param {object} data_2_display [{field1:value, field2:value}, ...]
 * @param {number} n n=1 => first | n=2 => second | ...
 * @returns The column name of a supposed column of strings.
 */
export const getStringField = (data_2_display, n=1) => {
    const keys = Object.keys(data_2_display[0]);
    for (let i=0; i<keys.length; i++) {
        // not a number?
        if (!isNumber(data_2_display[0][keys[i]])) {
            n--;
            if (n==0) return keys[i]           
        }
    }
    return null;
}


/**
 * Get a column name of a supposed column of dates.
 * Note: it only checks the first value.
 * @param {object} data_2_display [{field1:value, field2:value}, ...]
 * @param {number} n n=1 => first | n=2 => second | ...
 * @returns The column name of a supposed column of dates.
 */
export const getDateField = (data_2_display, n=1) => {
    const keys = Object.keys(data_2_display[0]);
    for (let i=0; i<keys.length; i++) {
        if (moment(data_2_display[0][keys[i]], DATE_FORMATS, true).isValid()) {
            n--;
            if (n==0) return keys[i]         
        }
    }
    return null;
}