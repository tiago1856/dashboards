//  #####################################
//  #                                   #
//  #   DATE / TIME RELATED FUNCTIONS   #
//  #                                   #
//  #####################################

/**
 *  
 * @param {string} mysql_timestamp MySql timestamp.
 * @param {string} connector Connector between date and time.
 * @returns A date | time string from a mysql TimeStamp field value or empty if invalid. 
 */
 export function mysqlTimeStamp2JS(mysql_timestamp, connector = ' ') {
    if (!mysql_timestamp || typeof mysql_timestamp == undefined || typeof mysql_timestamp === '') return '';
    return mysql_timestamp.substr(0,10) + connector + mysql_timestamp.substr(11,8);
}


/**
 * Current date YYYY-MM-DD.
 * @returns The current date in YYYY-MM-DD format.
 */
 export function today() {
    var date = new Date();
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);    
    return date.getFullYear() + "-" + (month) + "-" + (day);
}

/**
 * Current date YYYY-MM-DD HH:MM:SS.
 * @returns The current date in YYYY-MM-DD HH:MM:SS format.
 */
export function now() {
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    return cDate + ' ' + cTime;
}



/**
 * Delay with a promise.
 * 
 * @param {number} ms Time in ms.
 * @returns A promise.
 */
 export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
