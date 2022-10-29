import { ArgumentMetadata } from '@nestjs/common';
import { Socket } from "socket.io";
export declare type IWsAction = {
    targetClass: object;
    actionName: string;
    moduleName: string;
    handler: (payload: any, socket: Socket) => Promise<any>;
    context?: any;
    metadata?: ArgumentMetadata | undefined;
};
export declare type TWsMessage = {
    event: string;
    payload: any;
};
export declare const WS_OPTIONS = "WS_OPTIONS";
//# sourceMappingURL=ws.types.d.ts.map