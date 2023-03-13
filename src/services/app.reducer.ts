import mmkv from '../services/mmkv';
import {MessagePopUpInterface} from '../types/MessagePopUp';

export enum APP_ACTIONS {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REMOVE_MESSAGE = 'remove-message',
  NEW_MESSAGE = 'new-message',
  SELECT_PARIWAR = 'select-pariwar',
}

export interface AppContextState {
  appSettings: AppContextInterface;
  dispatch: (action: AppContextAction) => any;
}

export interface AppContextInterface {
  isLoggedIn: boolean;
  messages: MessagePopUpInterface[];
  selectedPariwar: string;
}

export interface AppContextAction {
  type: APP_ACTIONS;
  payload?: any;
}

export const appReducer = (
  state: AppContextInterface,
  action: AppContextAction,
): AppContextInterface => {
  const {type, payload} = action;
  switch (type) {
    case APP_ACTIONS.LOGIN:
      mmkv.saveKey('id_token', payload);
      return {
        ...state,
        isLoggedIn: true,
      };

    case APP_ACTIONS.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
      };

    case APP_ACTIONS.REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(a => a.id !== payload),
      };

    case APP_ACTIONS.NEW_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now(),
            message: payload,
          },
        ],
      };

    case APP_ACTIONS.SELECT_PARIWAR:
      return {
        ...state,
        selectedPariwar: payload,
      };

    default:
      break;
  }
  throw Error('Unknown action: ' + action.type);
};
