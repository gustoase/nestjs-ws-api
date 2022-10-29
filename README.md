# @drozd/nestjs-ws-api
[![NPM version](https://img.shields.io/npm/v/@drozd/nestjs-ws-api.svg)](https://www.npmjs.com/package/@drozd/nestjs-ws-api)

1) Turns a normal REST api into a websocket.
2) Accelerates api by 10 times due to one open ws channel.
3) Controllers also remain native swagger REST API.

## Setup
```npm install @drozd/nestjs-ws-api```

or

```yarn add @drozd/nestjs-ws-api```

then inside your `app.module.ts` add config:

```javascript
@Module({
  imports: [
    ConfigModule.forRoot(),
    WsModule.registerAsync({
      useFactory: (): IWsApiConfig => {
          return {
            validationConfig,
            async validate(socket: Socket) {
              console.log(new ExecutionContextHost([socket]));
              return HttpStatus.OK;
            },
          };
      },
    }),
  ],
})
export class AppModule {}
```

See demo using https://github.com/gustoase/nestjs-ws-api-demo

## License
MIT
