export default class EventCenter {
    eventSet = [];
    constructor(){
        this.emit=this.emmit;
    }
    on(eventName, listener, once = false) {
        if (!eventName || !eventName.replace(/\s/g, '') === '' || typeof eventName !== 'string') {
            throw new TypeError('evnet name is needed and it is value must be a string');
        };
        if (!listener || typeof listener !== 'function') {
            throw new TypeError('listener is needed and it is value must be a function');
        }
        this.eventSet.push({
            eventName,
            listener,
            once,
        });
    };

    emmit(eventName, params) {
        for (let i = 0, len = this.eventSet.length; i < len; i++) {
            if (eventName === this.eventSet[i].eventName) {
                this.eventSet[i].listener(params);
                if (this.eventSet[i].once) {
                    this.eventSet = this.eventSet.filter((eventObj) => {
                        return eventName === eventObj.eventName && eventObj.once;
                    });
                };
            };
        };
    };

    once(eventName, listener) {
        this.on(eventName, listener, true);
    };

    off(eventName) {
        for (let i = this.eventSet.length; i >= 0; i--) {
            if (this.eventSet[i].eventName === eventName) {
                delete this.eventSet[i];
                break;
            }
        };
        this.eventSet = this.eventSet.filter((eventObj) => {
            return eventObj !== void 0;
        });
    };
}