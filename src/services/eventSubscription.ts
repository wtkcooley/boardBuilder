export default class eventSubscription {
    _sub_events: any = {};
    private static _instance: null | eventSubscription = null;

    public static get() {
        if (eventSubscription._instance === null) {
            eventSubscription._instance = new eventSubscription()
        }

        return eventSubscription._instance;
    }
    
    onSubEvent(eventName: string, callback: any) {
        if (!this._sub_events[eventName]) {
            this._sub_events[eventName] = [];
        }
        this._sub_events[eventName].push(callback);
    }

    emitEvent(eventName: string, args: any[] = []) {
        if (this._sub_events[eventName]) {
            for (const event of this._sub_events[eventName]) {
                event(...args);
            }
        }
    }
}