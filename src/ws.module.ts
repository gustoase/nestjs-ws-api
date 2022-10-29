import { WsGateway } from './ws.gateway';
import { DynamicModule, HttpStatus, Module } from '@nestjs/common';
import { WS_OPTIONS } from './ws.types';
import { Socket } from 'socket.io';

export type IWsApiConfig = {
  validationConfig: Record<string, any>;
  validate: (socket: Socket) => Promise<HttpStatus>;
  publicConfig?: Record<string, any>;
};

export interface IWsApiConfigModule {
  useFactory: (...args: any[]) => Promise<IWsApiConfig> | IWsApiConfig;
  inject?: any[];
  imports?: any[];
}

@Module({
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {
  public static registerAsync(options: IWsApiConfigModule): DynamicModule {
    return {
      module: WsModule,
      providers: [
        {
          provide: WS_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      imports: options.imports || [],
    };
  }
}
