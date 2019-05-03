export const addMeet = id => ({
  type: 'ADD_MEET',
  payload: {
    id
  }
});

export const setSelectedTimeBlock = id => ({
  type: 'SET_TIME_BLOCK',
  id
});

export const newMeetWindowShow = () => ({
  type: 'TOGGLE_WINDOW_SHOW'
});

export const setMeetingRoom = selectedMeetingRoom => ({
  type: 'SET_MEETING_ROOM',
  selectedMeetingRoom
});

export const findingParticipantChange = value => ({
  type: 'FIND_PARTICIPANT_CHANGE',
  value
})
