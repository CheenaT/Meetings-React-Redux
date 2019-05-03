const initialState = {
  timeBlocks: [],
  selectedTimeBlock: -1,
  newMeetWindowShown: false,
  selectedMeetingRoom: '',
  findingParticipant: ''
}

let q = document.querySelector.bind(document);

const timeBlocksR = ( state = initialState, action) => {
  switch(action.type) {
    case 'ADD_MEET': {
      const copyTimeBlocks = {...state}, { id } = action.payload;
      copyTimeBlocks.timeBlocks[id] = true;
      q(".plus" + id).style.display = "block";
      q(".plus" + id).style.backgroundColor = "cyan";
      q(".horizontal" + id).style.display = "none";
      q(".vertical" + id).style.display = "none";
      q(".number" + id).value = 0;
      return { ...copyTimeBlocks, selectedTimeBlock: -1 };
    }
    // case 'DELETE_MEET':
    case 'SET_TIME_BLOCK': {
      return {...state, selectedTimeBlock: action.id }
    }
    case 'TOGGLE_WINDOW_SHOW': {
      return {...state, newMeetWindowShown: !state.newMeetWindowShown }
    }
    case 'SET_MEETING_ROOM': {
      return {...state, selectedMeetingRoom: action.selectedMeetingRoom }
    }
    case 'FIND_PARTICIPANT_CHANGE': {
      return {...state, findingParticipant: action.value }
    }
    default:
      return state
  }
}

export default timeBlocksR
