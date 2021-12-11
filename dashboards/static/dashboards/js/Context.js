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


        // component options
        onTest: new Signal(),
        onTable: new Signal(),
        onList: new Signal(),
        onMatrix: new Signal(),
        onGraph: new Signal(),
        onGraph3D: new Signal(),
        onGeo: new Signal(),
        onInfo: new Signal(),

        onColumn: new Signal(),
        onBar: new Signal(),
        onArea: new Signal(),
        onLine: new Signal(),
        onPie: new Signal(),
        onTitle: new Signal(),
        onSubTitle: new Signal(),
        onTitleAxisX: new Signal(),
        onTitleAxisY: new Signal(),
        onGridAxisX: new Signal(),
        onGridAxisY: new Signal(),
        onLegend: new Signal(),
        onLegendUp: new Signal(),
        onLegendBottom: new Signal(),
        onLegendLeft: new Signal(),
        onLegendRight: new Signal(),

    }

    this.edit_mode = false;     // editor or presentation
    this.dash_id = null;        // dashboard id
    this.name = null;           // dashboard name
    this.changed = false;       // indicates if there was any change (save system)
    this.date_start = null;
    this.date_end = null;

    this.layout = null;         // => layout and components accessible everywhere


    this.message_broker = new BroadcastChannel('react_channel');

    // ready
    this.signals.onStuffDone.add((msg) => console.log("Log message > ", msg));

    this.componentsItems = {
        onTest: this.signals.onTest,

        onTable: this.signals.onTable,
        onList: this.signals.onList,
        onMatrix: this.signals.onMatrix,
        onGraph: this.signals.onGraph,
        onGraph3D: this.signals.onGraph3D,
        onGeo: this.signals.onGeo,
        onInfo: this.signals.onInfo,

        onColumn: this.signals.onColumn,
        onBar: this.signals.onBar,
        onArea: this.signals.onArea,
        onLine: this.signals.onLine,
        onPie: this.signals.onPie,
        onTitle: this.signals.onTitle,
        onSubTitle: this.signals.onSubTitle,
        onTitleAxisX: this.signals.onTitleAxisX,
        onTitleAxisY: this.signals.onTitleAxisY,
        onGridAxisX: this.signals.onGridAxisX,
        onGridAxisY: this.signals.onGridAxisY,
        onLegend: this.signals.onLegend,
        onLegendUp: this.signals.onLegendUp,
        onLegendBottom: this.signals.onLegendBottom,
        onLegendLeft: this.signals.onLegendLeft,
        onLegendRight: this.signals.onLegendRight,

    }
}

