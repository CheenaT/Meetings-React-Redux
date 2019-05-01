export const addMeet = id => ({
  type: 'ADD_MEET',
  payload: {
    id
  }
});

export const selectedTimeBlock = id => ({
  type: 'SET_TIME_BLOCK',
  payload: {
    id
  }
});
