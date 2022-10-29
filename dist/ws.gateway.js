"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ws_service_1 = __importDefault(require("./ws.service"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ws_types_1 = require("./ws.types");
let WsGateway = WsGateway_1 = class WsGateway {
    constructor(moduleRef, options) {
        this.moduleRef = moduleRef;
        this.options = options;
        this.logger = new common_1.Logger(WsGateway_1.name);
        this.validator = new common_1.ValidationPipe(options.validationConfig);
    }
    afterInit() {
        ws_service_1.default.events.forEach((action) => {
            // Получаем контекст  конкретного инициализированного класса где вызван был декоратор
            action.context = this.moduleRef.get(action.targetClass.constructor, {
                strict: false,
            });
            this.logger.log(`Add WS action: ${action.targetClass.constructor.name} => ${action.moduleName}:${action.actionName}`);
        });
    }
    async handleConnection(socket) {
        var _a;
        const status = await this.options.validate(socket);
        if (status >= 400) {
            socket.emit('status', status);
            return;
        }
        for (const action of ws_service_1.default.events) {
            socket.on(`${action.moduleName}:${action.actionName}`, async (payload, response) => {
                try {
                    const handler = action.handler.bind(action.context);
                    if (action.metadata) {
                        await this.validator.transform(payload, action.metadata);
                    }
                    const result = await handler(payload, socket);
                    response(result);
                }
                catch (e) {
                    console.error(e);
                    // @ts-ignore
                    response(e || (e === null || e === void 0 ? void 0 : e.message));
                }
            });
        }
        // пример передачи на фронт конфига с сервера, так же можно понять что АПИ готово для работы
        socket.emit('ready', Object.assign({ date: new Date() }, (_a = this.options) === null || _a === void 0 ? void 0 : _a.publicConfig));
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WsGateway.prototype, "server", void 0);
WsGateway = WsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        transports: ['websocket', 'polling'],
        path: '/ws-api',
    }),
    __param(1, (0, common_1.Inject)(ws_types_1.WS_OPTIONS)),
    __metadata("design:paramtypes", [core_1.ModuleRef, Object])
], WsGateway);
exports.WsGateway = WsGateway;
//# sourceMappingURL=ws.gateway.js.map