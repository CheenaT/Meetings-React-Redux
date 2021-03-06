const initialState = {
  timeBlocks: [],
  selectedTimeBlock: -1,
  newMeetWindowShown: false,
  selectedMeetingRoom: '',
  findingParticipant: ''
}

initialState.timeBlocks[44] = {
  "Darth Vader": {name: "Darth Vader", image: 0},
  "Genghis Khan": {name: "Genghis Khan", image: 1}
};

initialState.timeBlocks[70] = {
  "Genghis Khan": {name: "Genghis Khan", image: 1}
};

initialState.timeBlocks[90] = {
  "Neo": {name: "Neo", image: 4}
};

let q = document.querySelector.bind(document);

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('./../../images', false, /\.(png|jpe?g|svg)$/));

const timeBlocksR = ( state = initialState, action) => {
  switch(action.type) {
    case 'ADD_MEET': {
      const copyTimeBlocks = {...state}, { id, people } = action;
      copyTimeBlocks.timeBlocks[id] = people;
        if ( id !== - 1 ) {
        q(".plus" + id).style.display = "block";
        q(".plus" + id).style.backgroundColor = "#06447c";
        q(".horizontal" + id).style.display = "none";
        q(".vertical" + id).style.display = "none";
        q(".number" + id).value = 0;
        q(`.meeting-room-${Math.floor(id/17)}`).style.color = '#fff';
        let first;
        for (first in people) break;
        console.log( ' debug reducer add meet arguments : ', action.people[first].image, id )
        let name = document.createElement("div");
        name.setAttribute('class', 'plus-box__time-block-avatar');
        name.innerText = first.split(' ')[1] ? first.split(' ')[1] : first.split(' ')[0];
        q(`.plus${id}`).appendChild(name);
        let img = document.createElement("img");
        img.src = images[people[first].image];
        img.setAttribute('class', 'plus-box__image');
        q(`.plus${id}`).appendChild(img);
      }
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
