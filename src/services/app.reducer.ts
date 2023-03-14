import mmkv from '../services/mmkv';
import {MessagePopUpInterface} from '../types/MessagePopUp';

export enum APP_ACTIONS {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REMOVE_MESSAGE = 'remove-message',
  NEW_MESSAGE = 'new-message',
  SELECT_PARIWAR = 'select-pariwar',
  REFETCH_BAAN_LIST = 'refetch-baan-list',
  REFETCH_BHAAI_LIST = 'refetch-bhaai-list',
  REFETCH_BHAAI_TOTAL = 'refetch-bhaai-total',
  REFETCH_NIMTA_LIST = 'refetch-nimta-list',
  REFETCH_RELATIVE_LIST = 'refetch-relative-list',
  REFETCH_PROFILE = 'refetch-profile',
  TOGGLE_THEME = 'toggle-theme',
}

export enum themeColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface QueryState {
  baanList: number;
  bhaaiList: number;
  bhaaiTotal: number;
  nimtaList: number;
  relativeList: number;
  profile: number;
}

export interface AppContextState {
  appSettings: AppContextInterface;
  dispatch: (action: AppContextAction) => any;
}

export interface AppContextInterface {
  isLoggedIn: boolean;
  messages: MessagePopUpInterface[];
  selectedPariwar: string;
  queryState: QueryState;
  theme: themeColor;
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

    case APP_ACTIONS.REFETCH_BAAN_LIST:
      return {
        ...state,
        queryState: {
          ...state.queryState,
          baanList: Date.now(),
        },
      };

    case APP_ACTIONS.REFETCH_BHAAI_LIST:
      return {
        ...state,
        queryState: {
          ...state.queryState,
          bhaaiList: Date.now(),
        },
      };

    case APP_ACTIONS.REFETCH_BHAAI_TOTAL:
      return {
        ...state,
        queryState: {
          ...state.queryState,
          bhaaiTotal: Date.now(),
        },
      };

    case APP_ACTIONS.REFETCH_NIMTA_LIST:
      return {
        ...state,
        queryState: {
          ...state.queryState,
          nimtaList: Date.now(),
        },
      };

    case APP_ACTIONS.REFETCH_RELATIVE_LIST:
      return {
        ...state,
        queryState: {
          ...state.queryState,
          relativeList: Date.now(),
        },
      };

    case APP_ACTIONS.REFETCH_PROFILE:
      return {
        ...state,
        queryState: {
          ...state.queryState,
          profile: Date.now(),
        },
      };

    case APP_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        theme:
          state.theme === themeColor.DARK ? themeColor.LIGHT : themeColor.DARK,
      };

    default:
      break;
  }
  throw Error('Unknown action: ' + action.type);
};
