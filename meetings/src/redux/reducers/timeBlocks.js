const initialState = {
  timeBlocks: [],
  selectedTimeBlock: -1
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
      return copyTimeBlocks;
    }
    // case 'DELETE_MEET':
    case 'SET_TIME_BLOCK': {
      const { id } = action.payload;
      return {...state, selectedTimeBlock: id }
    }
    default:
      return state
  }
}

export default timeBlocksR
