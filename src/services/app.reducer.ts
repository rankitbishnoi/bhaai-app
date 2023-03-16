export enum APP_ACTIONS {
  REFETCH_BAAN_LIST = 'refetch-baan-list',
  REFETCH_BHAAI_LIST = 'refetch-bhaai-list',
  REFETCH_BHAAI_TOTAL = 'refetch-bhaai-total',
  REFETCH_NIMTA_LIST = 'refetch-nimta-list',
  REFETCH_RELATIVE_LIST = 'refetch-relative-list',
  REFETCH_PROFILE = 'refetch-profile',
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
  queryState: QueryState;
}

export interface AppContextAction {
  type: APP_ACTIONS;
  payload?: any;
}

export const appReducer = (
  state: AppContextInterface,
  action: AppContextAction,
): AppContextInterface => {
  const {type} = action;
  switch (type) {
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

    default:
      break;
  }
  throw Error('Unknown action: ' + action.type);
};
