import { IWsAction } from './ws.types';

class WsService {
  public events: IWsAction[] = [];

  add(event: IWsAction) {
    this.events.push(event);
  }
}

export default new WsService();
