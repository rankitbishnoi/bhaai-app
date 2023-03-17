export type Model<T extends {_id: string}> = T & {
  notSynced: boolean;
  syncing: boolean;
};

export function createModel<T extends {_id: string}>(
  data: T,
  notSynced = true,
  syncing = true,
): Model<T> {
  return {
    ...data,
    notSynced,
    syncing,
  };
}

export function mergeModel<T extends {_id: string}>(
  localState: Model<T>[],
  foreignState: T[],
): Model<T>[] {
  const local = [...localState];
  const mergedState: Model<T>[] = [];

  foreignState.forEach((item: T) => {
    const indexInLocal = local.findIndex(a => a._id === item._id);
    if (indexInLocal > -1) {
      local.splice(indexInLocal, 1);
    }

    mergedState.push(createModel<T>(item, false, false));
  });

  mergedState.push(...local.map(a => createModel<T>(a, true, false)));

  return mergedState;
}
