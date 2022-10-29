import EventsService from './ws.service';
import { ArgumentMetadata } from '@nestjs/common';

export const WsAction = (
  moduleName: string,
  metadata?: ArgumentMetadata,
): MethodDecorator => {
  // @ts-ignore
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    EventsService.add({
      targetClass: target,
      actionName: propertyKey.toString(),
      moduleName: moduleName,
      handler: descriptor.value,
      metadata,
    });

    return descriptor;
  };
};
