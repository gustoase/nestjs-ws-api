"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAction = void 0;
const ws_service_1 = __importDefault(require("./ws.service"));
const WsAction = (moduleName, metadata) => {
    // @ts-ignore
    return (target, propertyKey, descriptor) => {
        ws_service_1.default.add({
            targetClass: target,
            actionName: propertyKey.toString(),
            moduleName: moduleName,
            handler: descriptor.value,
            metadata,
        });
        return descriptor;
    };
};
exports.WsAction = WsAction;
//# sourceMappingURL=ws.decorator.js.map