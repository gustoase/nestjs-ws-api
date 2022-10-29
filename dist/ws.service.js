"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WsService {
    constructor() {
        this.events = [];
    }
    add(event) {
        this.events.push(event);
    }
}
exports.default = new WsService();
//# sourceMappingURL=ws.service.js.map