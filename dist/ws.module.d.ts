import { DynamicModule, HttpStatus } from '@nestjs/common';
import { Socket } from 'socket.io';
export declare type IWsApiConfig = {
    validationConfig: Record<string, any>;
    validate: (socket: Socket) => Promise<HttpStatus>;
    publicConfig?: Record<string, any>;
};
export interface IWsApiConfigModule {
    useFactory: (...args: any[]) => Promise<IWsApiConfig> | IWsApiConfig;
    inject?: any[];
    imports?: any[];
}
export declare class WsModule {
    static registerAsync(options: IWsApiConfigModule): DynamicModule;
}
//# sourceMappingURL=ws.module.d.ts.map