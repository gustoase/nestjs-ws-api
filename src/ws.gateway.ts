import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  GatewayMetadata,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import EventsService from './ws.service';
import { Inject, Logger, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { WS_OPTIONS } from './ws.types';
import { IWsApiConfig } from './ws.module';

@WebSocketGateway<GatewayMetadata>({
  transports: ['websocket', 'polling'],
  path: '/ws-api',
})
export class WsGateway implements OnGatewayConnection, OnGatewayInit {
  private readonly logger = new Logger(WsGateway.name);
  private readonly validator: ValidationPipe;

  @WebSocketServer()
  server!: Server;

  constructor(
    private moduleRef: ModuleRef,
    @Inject(WS_OPTIONS) private options: IWsApiConfig,
  ) {
    this.validator = new ValidationPipe(options.validationConfig);
  }


  afterInit() {
    EventsService.events.forEach((action) => {
      // Получаем контекст  конкретного инициализированного класса где вызван был декоратор
      action.context = this.moduleRef.get(action.targetClass.constructor, {
        strict: false,
      });
      this.logger.log(
        `Add WS action: ${action.targetClass.constructor.name} => ${action.moduleName}:${action.actionName}`,
      );
    });
  }

  async handleConnection(socket: Socket): Promise<void> {
    const status = await this.options.validate(socket);
    if (status >= 400) {
      socket.emit('status', status);
      return;
    }

    for (const action of EventsService.events) {
      socket.on(
        `${action.moduleName}:${action.actionName}`,
        async (payload: any, response: (data: any) => void) => {
          try {
            const handler = action.handler.bind(action.context);

            if (action.metadata) {
              await this.validator.transform(payload, action.metadata);
            }

            const result = await handler(payload, socket);

            response(result);
          } catch (e) {
            console.error(e);
            // @ts-ignore
            response(e || e?.message);
          }
        },
      );
    }

    // пример передачи на фронт конфига с сервера, так же можно понять что АПИ готово для работы
    socket.emit('ready', { date: new Date() });
  }
}
