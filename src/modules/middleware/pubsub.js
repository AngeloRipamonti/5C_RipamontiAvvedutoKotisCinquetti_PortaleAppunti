module.exports = function generatePubSub() {
    const events = {};

    return {
        subscribe: (eventName, callback) => {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(callback);
        },
        publish: async (eventName, data) => {
            if (events[eventName]) {
                return Promise.all(events[eventName].map(callback => callback(data)));
            }
        }
    };
};