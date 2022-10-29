import { ArgumentMetadata } from '@nestjs/common';
import { Socket } from "socket.io";

export type IWsAction = {
  targetClass: object;
  actionName: string;
  moduleName: string;
  handler: (payload: any, socket: Socket) => Promise<any>;
  context?: any;
  metadata?: ArgumentMetadata | undefined;
};

export type TWsMessage = {
  event: string;
  payload: any;
};

export const WS_OPTIONS = 'WS_OPTIONS';
