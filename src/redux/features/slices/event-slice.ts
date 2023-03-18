import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
  EventInterface as Event,
  TaskInterface,
  TaskStatus,
} from '../../../types/event';
import {revertAll} from '../actions/revertAll';
import {createModel, Model} from '../helper';

const initialState: Model<Event>[] = [];

const eventSlice = createSlice({
  name: 'eventList',
  initialState,
  reducers: {
    // createEvent
    createdEvent(state, action: PayloadAction<Event>) {
      state.push(
        createModel<Event>({
          ...action.payload,
          createdAt: new Date().toISOString(),
        }),
      );
    },
    // updateEvent
    updatedEvent(state, action: PayloadAction<Partial<Event>>) {
      const foundIndex = state.findIndex(a => a._id === action.payload._id);
      if (foundIndex > -1) {
        state.splice(
          foundIndex,
          1,
          createModel<Event>({
            ...state[foundIndex],
            ...action.payload,
          }),
        );
      }
    },
    // deleteEvent
    deletedEvent(state, action: PayloadAction<string>) {
      const foundIndex = state.findIndex(a => a._id === action.payload);
      if (foundIndex > -1) {
        state.splice(foundIndex, 1);
      }
    },
    // addTask
    addTask(
      state,
      action: PayloadAction<{eventId: string; task: TaskInterface}>,
    ) {
      const event = state.find(a => a._id === action.payload.eventId);
      if (event) {
        event.tasks = [
          ...event.tasks,
          {
            ...action.payload.task,
            createdAt: new Date().toISOString(),
          },
        ];
      }

      return state;
    },
    // updateTask
    updateTask(
      state,
      action: PayloadAction<{eventId: string; task: Partial<TaskInterface>}>,
    ) {
      const event = state.find(a => a._id === action.payload.eventId);
      if (event) {
        const foundIndex = event.tasks.findIndex(
          a => a._id === action.payload.task._id,
        );
        event.tasks.splice(
          foundIndex,
          1,
          createModel<TaskInterface>({
            ...event.tasks[foundIndex],
            ...action.payload.task,
          }),
        );
      }

      return state;
    },
    // updateTask
    updateTaskStatus(
      state,
      action: PayloadAction<{eventId: string; id: string; status: TaskStatus}>,
    ) {
      const event = state.find(a => a._id === action.payload.eventId);
      if (event) {
        const task = event.tasks.find(a => a._id === action.payload.id);
        task && (task.status = action.payload.status);
      }

      return state;
    },
    // updateTask
    addTaskSpending(
      state,
      action: PayloadAction<{eventId: string; id: string; spending: number}>,
    ) {
      const event = state.find(a => a._id === action.payload.eventId);
      if (event) {
        const task = event.tasks.find(a => a._id === action.payload.id);
        task &&
          (task.spendings = [
            ...task.spendings,
            {
              amount: action.payload.spending,
              createdAt: new Date().toISOString(),
            },
          ]);
      }

      return state;
    },
    // removeTask
    removeTask(state, action: PayloadAction<{eventId: string; id: string}>) {
      const event = state.find(a => a._id === action.payload.eventId);
      if (event) {
        const foundIndex = event.tasks.findIndex(
          a => a._id === action.payload.id,
        );
        event.tasks.splice(foundIndex, 1);
      }

      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const {createdEvent, deletedEvent, updatedEvent} = eventSlice.actions;

export default eventSlice.reducer;
