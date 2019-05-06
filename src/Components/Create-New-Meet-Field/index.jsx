import React from "react";
import ButtomArrowIcon from './../../images/buttom-arrow.png';
import CircleIconWithClose from './../../images/icon-circle-with-close.svg';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { participants, floorsWithMeetingRooms } from '../../constants.js';
import { connect } from 'react-redux';
import { addMeet, newMeetWindowShow, setMeetingRoom, findingParticipantChange } from '../../redux/actions';
import { bindActionCreators } from 'redux';

let q = document.querySelector.bind(document),
    qa =document.querySelectorAll.bind(document);

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('./../../images', false, /\.(png|jpe?g|svg)$/));
console.log(' images : ', images);

class CreateNewMeetField extends React.Component {
    state = {
      beginTimeValue: new Date(Math.ceil(new Date().getTime() / (60*1000*5) ) * 60*1000*5).toTimeString().slice(0,5),
      endTimeValue: new Date(Math.ceil(new Date(new Date().setMinutes(new Date().getMinutes() + 30)).getTime() / (60*1000*5) ) * 60*1000*5).toTimeString().slice(0,5),
      participantsListIsShown: false,
      possibleTimeShown: false,
      possibleEndTimeShown: false,
      startDate: new Date(),
      recommendedMeetingRoom: [], //'Unexplored territory, up to 30 people'
      people: {},
      meetingRoomIsHover: false
    };
  componentDidMount() {
    this.timerID = setInterval( () => this.tick(), 5 * 60 * 1000 );
    console.log(document.getElementById('meet-date'));
    // document.getElementById('meet-date').value = new Date().toJSON().slice(0,10);
    let hours = new Date().getHours(), freeMeetRooms = [], { timeBlocksR: { selectedMeetingRoom, timeBlocks } } = this.props, i = 0;
    if ( !selectedMeetingRoom ) {
      floorsWithMeetingRooms.forEach( floor => {
        floor.meetingRooms.forEach( el => {
          if ( !timeBlocks[hours - 8 + 17 * i++] ) {
            freeMeetRooms.push({ room: el.room, floor: floor.floor })
          }
        })
      })
      this.setState({ recommendedMeetingRoom: freeMeetRooms });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick = () => {
    this.setState({
      beginTimeValue: new Date(Math.ceil(new Date().getTime() / (60*1000*5) ) * 60*1000*5).toTimeString().slice(0,5),
      endTimeValue: new Date(Math.ceil(new Date(new Date().setMinutes(new Date().getMinutes() + 30)).getTime() / (60*1000*5) ) * 60*1000*5).toTimeString().slice(0,5)
    })
  }
  beginTimeChange(e) {
    let regexTimeFormat =/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
    console.log(' number debug : ', regexTimeFormat.test(e.target.value), e.target.value, typeof e.target.value );
    if ( regexTimeFormat.test(e.target.value) ) {
      this.setState({ beginTimeValue: e.target.value });
    }
  }
  hoverMeetingRoom = (e, i) => {
      let copyRecommendedMeetingRoom = [], hours = new Date().getHours(), { timeBlocksR: { timeBlocks } } = this.props, j = 0;
        floorsWithMeetingRooms.forEach( floor => {
          floor.meetingRooms.forEach( el => {
            if ( !timeBlocks[hours - 8 + 17 * j++] ) {
              copyRecommendedMeetingRoom.push({ room: el.room, floor: floor.floor })
            }
          })
        })
      console.log(' debug copyRecommendedMeetingRoom ', copyRecommendedMeetingRoom);
      this.setState({ recommendedMeetingRoom: copyRecommendedMeetingRoom, meetingRoomIsHover: true });
  }
  addParticipant = (e, name, i) => {
    let newPeople = {...this.state.people, [name]: { name, image: i } }; // change 1 to id
    this.setState({people: newPeople });
    console.log(' addParticipant : ', e, name, newPeople, this.state.people);
  }
  render() {
    const { timeBlocksR: { findingParticipant, selectedMeetingRoom, selectedTimeBlock }, newMeetWindowShow, findingParticipantChange, setMeetingRoom, addMeet } = this.props;
    return (
        <form action="" className="main__new-meet-create">
          <div className="new-meet-create__form-content" >
          <img
            onClick={newMeetWindowShow}
            src={CircleIconWithClose} alt=""
            className="new-meet-create__circle-icon-with-close"
          />
          <div className="new-meet-create__text">New meet</div>
          <label htmlFor="meet-title" className="new-meet-create__label-theme">
            Theme
          </label>
          <input
            id="meet-title"
            type="text"
            className="new-meet-create__meet-title"
            placeholder="What are you going to talk about?"
          />
          <label htmlFor="meet-date" className="new-meet-create__label-date">
            Date
          </label>
          <DatePicker
            selected={this.state.startDate}
            onChange={ (date) => this.setState({ startDate: date }) }
            id="meet-date"
            className="new-meet-create__meet-date"
            dateFormat="d MMMM yyyy"
            timeCaption="time"
            popperPlacement="top-end"
            popperModifiers={{
              offset: {
                enabled: true,
                offset: '50px, 100px'
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                boundariesElement: 'viewport'
              }
            }}
          />
          <label htmlFor="meet-date" className="new-meet-create__label-date-begin">
            Begin
          </label>
          {
            this.state.possibleTimeShown &&
            <ul
              onMouseOver={ () => this.setState({ possibleTimeShown: 1 }) }
              onMouseLeave={ () => this.setState({ possibleTimeShown: false }) }
              onClick={ (e) => { console.log(' debug onClick : ', e.target.innerText ); this.setState({ beginTimeValue: e.target.innerText, possibleTimeShown: false }); } }
              className="new-meet-create__possible-time" >
              {Array.apply(null, { length: 5 }).map((el, i) => (
                <li
                  onPointerEnter={ () => ( qa('li')[i].style.background = '#E9ECEF' ) }
                  onPointerLeave={ () => ( qa('li')[i].style.background = '#FFF' ) }
                  key={i}
                > { console.log(' debug possibleTime : ', ((((5 - i) + new Date().getHours()) % 24) < 10 ? '0' : +'' ) + ((5 - i) + new Date().getHours()) % 24 + ':'
                + ( ( ( +this.state.beginTimeValue.slice(3,5) + (5 - i)*30) % 60) < 10 ? '0' : '' )
                + ( +this.state.beginTimeValue.slice(3,5) + (5 - i)*30) % 60) }
                  { ((((5 - i) + new Date().getHours()) % 24) < 10 ? '0' : +'' ) + ((5 - i) + new Date().getHours()) % 24 + ':'
                  + ( ( ( +this.state.beginTimeValue.slice(3,5) + (5 - i)*15) % 60) < 10 ? '0' : '' )
                  + ( +this.state.beginTimeValue.slice(3,5) + (5 - i)*15) % 60 }
                </li>
              ))}
            </ul>
          }
          <input
            className="new-meet-create__time"
            type="time"
            onChange={(e) => this.beginTimeChange(e)}
            value = {this.state.beginTimeValue}
            onMouseOver={ () => this.setState({ possibleTimeShown: true }) }
            onMouseOut={ () => { setTimeout( () => { if (this.state.possibleTimeShown !== 1) { this.setState({ possibleTimeShown: false }) } }, 200) } }
          />
          <div className="new-meet-create__hyphen-between-times">—</div>
          {
            this.state.possibleEndTimeShown &&
            <ul className="new-meet-create__possible-end-time" >
              {Array.apply(null, { length: 5 }).map((el, i) => (
                <li key={i} >{ (6 - i) + new Date().getHours() + ':'
                  + ( ( ( +this.state.beginTimeValue.slice(3,5) + (5 - i)*15) % 60) < 10 ? '0' : '' )
                  + ( +this.state.beginTimeValue.slice(3,5) + (5 - i)*15) % 60 }
                </li>
              ))}
            </ul>
          }
          <label htmlFor="meet-date" className="new-meet-create__label-date-end">
            End
          </label>
          <input
            className="new-meet-create__time"
            type='time'
            onChange={ e => this.setState({ endTimeValue: e.target.value }) }
            value={this.state.endTimeValue}
            onMouseOver={ () => this.setState({ possibleEndTimeShown: true }) }
            onMouseOut={ () => this.setState({ possibleEndTimeShown: false }) }
          />
          <label htmlFor="select" className="new-meet-create__meet-people-label">People</label>
          <input
            placeholder="For example, Elon Musk"
            type="text"
            className="new-meet-create__meet-people"
            onFocus={() => this.setState({ participantsListIsShown: true }) }
            onBlur={() => this.setState({ participantsListIsShown: false }) }
            onChange={ e => findingParticipantChange(e.target.value) }
            value={ findingParticipant }
          />
          { this.state.participantsListIsShown &&
            <div className="new-meet-create__participants-list" >
              <ul className='new-meet-create__meet-people-list'> {console.log(' participants : ', participants)}
                { participants.filter( ({ name }) => name.toLowerCase().indexOf(findingParticipant.toLowerCase()) !== -1 ).map( (el, i) =>
                    <li
                      key={i}
                      onMouseDown={ e => this.addParticipant(e, el.name, i)}
                      onPointerEnter={ () => ( qa('li')[i].style.background = '#E9ECEF' ) }
                      onPointerLeave={ () => ( qa('li')[i].style.background = '#FFF' ) }
                    >
                      <img src={images[i]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>
                      {el.name}<span>{el.about}</span>
                    </li>
                ) } {/* change images[1] to images[i] */}
              </ul>
              <div className="new-meet-create__hint" >
                <div className="new-meet-create__hint-text" >hint</div>
                You can write the name of the guest and the pass will be ordered automatically
              </div>
            </div>
          }
          <span className="new-meet-create__recommended-meeting-rooms-text">{selectedMeetingRoom ? 'Meeting room' : 'Recommended meeting room' }{false ? 's' : ''}</span>
          { selectedMeetingRoom &&
            <div className="new-meet-create__selected-meeting-room" onMouseOver={this.hoverMeetingRoom} onMouseOut={ () => this.setState({ recommendedMeetingRoom: [], meetingRoomIsHover: false }) } >
              <img src={ButtomArrowIcon} alt="" className="new-meet-create__buttom-arrow" onMouseOver={this.hoverMeetingRoom} onMouseOut={ () => this.setState({ recommendedMeetingRoom: [], meetingRoomIsHover: false }) } />
              { this.state.meetingRoomIsHover ? 'Choose another meeting room?' : selectedMeetingRoom}
            </div> }
            {console.log(' debug condition : ', selectedMeetingRoom, !!selectedMeetingRoom, this.state.meetingRoomIsHover, !!this.state.meetingRoomIsHover )}
          { ( selectedMeetingRoom && this.state.meetingRoomIsHover ) ?
            this.state.recommendedMeetingRoom.map( (el, i) =>
                <div key={i} className="new-meet-create__meet-room" >
                  {`${this.state.beginTimeValue} — ${this.state.endTimeValue}  `}{el.room + ' • ' + el.floor + ' floor'}
                </div>
            ) :
            this.state.recommendedMeetingRoom.map( (el, i) =>
                <div key={i} className="new-meet-create__meet-room" >
                  {`${this.state.beginTimeValue} — ${this.state.endTimeValue}  `}{el.room + ' • ' + el.floor + ' floor'}
                </div>
            )
          }
          <button
            className="new-meet-create__back-button"
            onClick={() => {newMeetWindowShow(); setMeetingRoom() } }
          >
            {'Back'}
          </button>
          <button
            className="new-meet-create__create-button"
            onClick={() => {
              setMeetingRoom("");
              addMeet(selectedTimeBlock);
              newMeetWindowShow();
            }}
          >
            {"Create"}
          </button> {/* TODO: pass number of time block by time and meeting room */}
          <div className="invited-people">
            {/*{people.map( el => (<div className="invated-people__participant">{el.name}</div>))}*/}
            {Object.keys(this.state.people).map((keyName, i) => (
                <div className="invited-people__participant" key={i}>
                    {/*<span className="input-label">key: {i} Name: {subjects[keyName]}</span>*/}
                    {this.state.people[keyName].name}
                </div>
            ))}
          </div>
          </div>
        </form>
    )
  }
}

const mapStateToProps = state => {
  return { timeBlocksR: state.timeBlocksR }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addMeet: addMeet,
      newMeetWindowShow: newMeetWindowShow,
      setMeetingRoom: setMeetingRoom,
      findingParticipantChange: findingParticipantChange
    },
    dispatch
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateNewMeetField)
