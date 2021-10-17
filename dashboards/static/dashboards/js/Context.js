export function Context() {

    // ---------------
    // --- SIGNALS ---
    // ---------------
    // Use signals to communicate and pass values.
    var Signal = signals.Signal;
    this.signals = {
        // dispatches originated from everywhere
        onStuffDone: new Signal(),              // basically for logging the execution flow
        onError: new Signal(),
        onAYS: new Signal(),                    // are you sure
        onWarning: new Signal(),

        onChanged: new Signal(),                // somethig changed => save button on

        onGlobalData: new Signal(),             // new temporal interval
        onEditComponent: new Signal(),          // edit a specific component

    }

    this.edit_mode = false;  // editor or presentation
    this.dash_id = null;        // dashboard id
    this.name = null;           // dashboard name
    this.changed = false;       // indicates if there was any change (save system)
    this.date_start = null;
    this.date_end = null;


    // ready
    this.signals.onStuffDone.add((msg) => console.log("Log message > ", msg));

}

