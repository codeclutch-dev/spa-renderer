export default class Cache {

    constructor() {
        this.memory = new Map();
    }

    has(key) {
        return this.memory.has(key);
    }

    get(key) {
        return this.memory.get(key);
    }

    set(key, value) {
        this.memory.set(key, value);
    }

    delete(key) {
        this.memory.delete(key);
    }

    clear() {
        this.constructor();
    }
}
