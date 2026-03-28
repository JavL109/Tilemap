class Signal {
    constructor() {
        this.subscribers = [];
    }

    fire(...args) {
        for (const suscriber in suscribers) {
            suscriber(args)
        };
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }
}