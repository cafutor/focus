import EventCenter from '../src/eventCenter';

const FOCUS_CENTER_EVENT='FOCUS_CENTER_EVENT';

describe('test focus event center', () => {
    // version 2.1.2 feature
    test('an ins of focus event center should have property emit and its value is equal to property emmit', () => {
        const eventIns = new EventCenter();
        expect(eventIns).toHaveProperty('emit', eventIns.emmit);
    });

    // test fire event
    test('fire event', () => {
        const eventIns = new EventCenter();
        const focusTestObj = {
            listener: function (params) {
                focusTestObj.listener.params = params;
            }
        };
        const FOCUS_EVENT_CENTER_PARAMS = 'focus_event_center_params';
        const listener = jest.spyOn(focusTestObj, 'listener');
        eventIns.on(FOCUS_CENTER_EVENT, listener);
        eventIns.emmit(FOCUS_CENTER_EVENT, FOCUS_EVENT_CENTER_PARAMS);
        expect(listener).toHaveBeenCalled();
        expect(listener.params).toBe(FOCUS_EVENT_CENTER_PARAMS);
    });


    // test off
    describe('test event center off', () => {
        const eventIns = new EventCenter();
        test('off', () => {
            eventIns.on(FOCUS_CENTER_EVENT, () => { });
            eventIns.off(FOCUS_CENTER_EVENT);
            expect(eventIns.eventSet).toHaveLength(0);
        })

    });

    // test once
    describe('test event center once', () => {
        const eventIns = new EventCenter();
        // test once
        test('once', () => {
            eventIns.once(FOCUS_CENTER_EVENT, () => { });
            eventIns.once(FOCUS_CENTER_EVENT, () => { });
            eventIns.on(FOCUS_CENTER_EVENT, () => { });
            eventIns.emit(FOCUS_CENTER_EVENT, '');
            expect(eventIns.eventSet).toHaveLength(1);
        });
    });

    // test offAll
    describe('test event center off all',()=>{
        const eventIns = new EventCenter();
        // test once
        test('offAll', () => {
            eventIns.on(FOCUS_CENTER_EVENT, () => { });
            eventIns.on(FOCUS_CENTER_EVENT, () => { });
            eventIns.on(FOCUS_CENTER_EVENT, () => { });
            eventIns.on(FOCUS_CENTER_EVENT, () => { });
            eventIns.offAll(FOCUS_CENTER_EVENT, '');
            expect(eventIns.eventSet).toHaveLength(0);
        });
    })

});