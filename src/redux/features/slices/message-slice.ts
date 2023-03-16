import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MessagePopUpInterface} from '../../../types/MessagePopUp';
import {revertAll} from '../actions/revertAll';

const initialState: {
  messages: MessagePopUpInterface[];
} = {
  messages: [],
} as any;

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // createMessages
    createdMessages(state, action: PayloadAction<string>) {
      state.messages.push({
        id: Date.now(),
        message: action.payload,
      });
    },
    // deleteMessages
    deletedMessages(state, action: PayloadAction<number>) {
      state.messages = state.messages.filter(a => a.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const {createdMessages, deletedMessages} = messageSlice.actions;

export default messageSlice.reducer;
