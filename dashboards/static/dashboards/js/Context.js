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
        onZoomComponent: new Signal(),

    }

    this.edit_mode = false;     // editor or presentation
    this.dash_id = null;        // dashboard id
    this.name = null;           // dashboard name
    this.changed = false;       // indicates if there was any change (save system)
    this.date_start = null;     // global starting date
    this.date_end = null;       // global end date

    //this.layout = null;         // => layout and components accessible everywhere

    // channel to communicate with the visualization framework
    this.message_broker = new BroadcastChannel('react_channel');

    // ready
    this.signals.onStuffDone.add((msg) => console.log("Log message > ", msg));

}

