const initialState = {};

export function rootReducer(state = initialState, action: any) {
  console.log('action in root reducer: ' + action.type);

  switch (action.type) {
  }
  return {};
}
