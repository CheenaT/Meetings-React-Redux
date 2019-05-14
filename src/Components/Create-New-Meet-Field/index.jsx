import React from "react";
import ButtomArrowIcon from './../../images/buttom-arrow.png';
import CircleIconWithClose from './../../images/error.svg';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { participants, floorsWithMeetingRooms } from '../../constants.js';
import { connect } from 'react-redux';
import { addMeet, newMeetWindowShow, setMeetingRoom, findingParticipantChange } from '../../redux/actions';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

let qa =document.querySelectorAll.bind(document);

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('./../../images', false, /\.(png|jpe?g|svg)$/));
console.log(' images : ', images);

class CreateNewMeetField extends React.Component {
    state = {
      beginTimeValue: new Date(Math.ceil(new Date().getTime() / (60*1000*5) ) * 60*1000*5),
      endTimeValue: new Date(Math.ceil(new Date(new Date().setMinutes(new Date().getMinutes() + 30)).getTime() / (60*1000*5) ) * 60*1000*5),
      participantsListIsShown: false,
      possibleTimeShown: false,
      possibleEndTimeShown: false,
      startDate: new Date(),
      recommendedMeetingRoom: [], //'Unexplored territory, up to 30 people'
      people: {},
      meetingRoomIsHover: false
    };
  componentDidMount() {
    const { beginTimeValue, endTimeValue } = this.state,
            mins = beginTimeValue.getHours() * 60 + beginTimeValue.getMinutes(),
            endTimeMins = endTimeValue.getHours() * 60 + +endTimeValue.getMinutes();
    this.timerID = setInterval( () => this.tick(), 5 * 60 * 1000 );
    console.log(' didMount : ', beginTimeValue.getHours() * 60 + beginTimeValue.getMinutes(), endTimeMins );
    if ( 30 < mins && mins < 480 ) {
      this.setState({ beginTimeValue: new Date(new Date(Math.ceil(new Date().getTime() / (60*1000*5) ) * 60*1000*5).setHours(8,0)) });
    }
    if ( 60 < endTimeMins && endTimeMins < 480 ) {
      this.setState({ endTimeValue: new Date(new Date().setHours(8,30)) });
    }
    const { timeBlocksR: { selectedMeetingRoom } } = this.props;
    if ( !selectedMeetingRoom ) {
      this.hoverMeetingRoom();
    }
  }
  componentDidUpdate() {
    const { beginTimeValue, endTimeValue } = this.state,
            mins = beginTimeValue.getHours() * 60 + beginTimeValue.getMinutes(),
            endTimeMins = endTimeValue.getHours() * 60 + +endTimeValue.getMinutes();
    if ( 30 < mins && mins < 480 ) {
      this.setState({ beginTimeValue: new Date(new Date(Math.ceil(new Date().getTime() / (60*1000*5) ) * 60*1000*5).setHours(8,0)) });
    }
    if ( 60 < endTimeMins && endTimeMins < 480 ) {
      this.setState({ endTimeValue: new Date(new Date().setHours(8,30)) });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick = () => {
    this.setState({
      beginTimeValue: new Date(Math.ceil(new Date().getTime() / (60*1000*5) ) * 60*1000*5),
      endTimeValue: new Date(Math.ceil(new Date(new Date().setMinutes(new Date().getMinutes() + 30)).getTime() / (60*1000*5) ) * 60*1000*5)
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
      if ( hours === 0 ) {
        hours = 24;
      }
        floorsWithMeetingRooms.forEach( floor => {
          floor.meetingRooms.forEach( el => {
            console.log(' debug free meetingRooms : ', timeBlocks[hours - 8 + 17 * j], hours - 8 + 17 * j, hours, j );
            if ( !timeBlocks[hours - 8 + 17 * j++] ) {
              copyRecommendedMeetingRoom.push({ room: el.room, floor: floor.floor })
            }
          })
        })
      console.log(' debug "free" copyRecommendedMeetingRoom ', copyRecommendedMeetingRoom);
      this.setState({ recommendedMeetingRoom: copyRecommendedMeetingRoom });
      // rmrs.filter( (el, i) => !tbs[ hours - 8 + 17 * i ] )
  }
  addParticipant = (e, name, i) => {
    let newPeople = {...this.state.people, [name]: { name, image: i, isHover: false } }; // change 1 to id
    this.setState({people: newPeople });
    console.log(' addParticipant : ', e, name.split(' ').join('_'), newPeople, this.state.people);
  }
  render() {
    const { timeBlocksR: { findingParticipant, selectedMeetingRoom, selectedTimeBlock }, newMeetWindowShow, findingParticipantChange, setMeetingRoom, addMeet } = this.props,
          { beginTimeValue, endTimeValue, meetingRoomIsHover, participantsListIsShown, people, possibleEndTimeShown, possibleTimeShown, recommendedMeetingRoom, startDate } = this.state;
    return (
        <div className="main__new-meet-create">
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
            selected={startDate}
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
            possibleTimeShown &&
            <ul
              onMouseOver={ () => this.setState({ possibleTimeShown: 1 }) }
              onMouseLeave={ () => this.setState({ possibleTimeShown: false }) }
              onClick={ (e) => {
                 const hours = +e.target.innerText.slice(0,2),
                        mins = +e.target.innerText.slice(3,5);
                 console.log(' debug innerText : ', e.target.innerText, new Date().setHours(e.target.innerText.slice(0,2),
                 e.target.innerText.slice(3,5) ), hours, mins, new Date(new Date().setHours(hours, mins + 30)) );
                 this.setState({ beginTimeValue: new Date(new Date().setHours(hours, mins)), endTimeValue: new Date(new Date().setHours(hours, mins + 30)), possibleTimeShown: false });
                 // setTimeout( () => this.hoverMeetingRoom(), 0)
               } }
              className="new-meet-create__possible-time" >
              {Array.apply(null, { length: 5 }).map((el, i) => {
                const possibleTime = new Date(
                  new Date(beginTimeValue).setMinutes(
                    Math.ceil( (new Date(beginTimeValue).getMinutes() + 1) / 30) * 30 + (5 - i) * 30
                  )
                );
                const mins = possibleTime.getHours() * 60 + possibleTime.getMinutes();
                const diff = 60 < mins && mins < 480 ? 420 : 0;
                console.log( ' debug possibleTime : ', possibleTime, mins, diff, possibleTime.getHours(), possibleTime.getMinutes() );
                return (
                  <li
                    onPointerEnter={ () => ( qa('li')[i].style.background = '#E9ECEF' ) }
                    onPointerLeave={ () => ( qa('li')[i].style.background = '#FFF' ) }
                    key={i}
                  > { console.log(' debug possible time : ', new Date(new Date(beginTimeValue).setMinutes(Math.ceil(new Date(beginTimeValue).getMinutes()/30) * 30 + (4 - i)*30)).toString().slice(16, 21) )}
                    {
                          new Date(
                            new Date(beginTimeValue).setMinutes(
                              Math.ceil( (new Date(beginTimeValue).getMinutes() + 1) / 30) *
                                30 +
                                (4 - i) * 30 +
                                diff
                            )
                          )
                            .toString()
                            .slice(16, 21)
                    }
                  </li>
                )
              })}
            </ul>
          }
          <input
            className="new-meet-create__time"
            type="time"
            onChange={(e) => this.beginTimeChange(e)}
            value = { beginTimeValue.toTimeString().slice(0,5) }
            onMouseOver={ () => this.setState({ possibleTimeShown: true }) }
            onMouseOut={ () => { setTimeout( () => { if (this.state.possibleTimeShown !== 1) { this.setState({ possibleTimeShown: false }) } }, 200) } }
          /> {console.log(' debug typeof beginTimeValue : ', beginTimeValue, typeof beginTimeValue.toString(), typeof beginTimeValue, beginTimeValue.toString().length)}
          <div className="new-meet-create__hyphen-between-times">—</div>
          {
            possibleEndTimeShown &&
            <ul
              onClick={(e) => {
                const hours = e.target.innerText.slice(0,2),
                       mins = e.target.innerText.slice(3,5);
                // console.log(' debug innerText : ', e.target.innerText, new Date().setHours(e.target.innerText.slice(0,2), e.target.innerText.slice(3,5) ) );
                this.setState({ endTimeValue: new Date(new Date().setHours(hours, mins)), possibleEndTimeShown: false });
                setTimeout( () => this.hoverMeetingRoom(), 0)
              }}
              onMouseOver={ () => this.setState({ possibleEndTimeShown: 2 }) }
              onMouseLeave={ () => this.setState({ possibleEndTimeShown: false }) }
              className="new-meet-create__possible-end-time"
            >
            {
              Array.apply(null, { length: 5 }).map((el, i) => {
                const possibleTime = new Date(
                  new Date(endTimeValue).setMinutes(
                    Math.ceil((new Date(endTimeValue).getMinutes() + 1) / 30) * 30 +
                      (5 - i) * 30
                  )
                );
                const mins = possibleTime.getHours() * 60 + possibleTime.getMinutes();
                const diff = 60 < mins && mins < 480 ? 420 : 0;
                console.log(
                  " debug possibleTime : ",
                  possibleTime,
                  mins,
                  diff,
                  possibleTime.getHours(),
                  possibleTime.getMinutes()
                );
                return (
                  <li
                    onPointerEnter={() => (qa("li")[i].style.background = "#E9ECEF")}
                    onPointerLeave={() => (qa("li")[i].style.background = "#FFF")}
                    key={i}
                  >
                    {" "}
                    {console.log(
                      " debug possible time : ",
                      new Date(
                        new Date(endTimeValue).setMinutes(
                          Math.ceil(new Date(endTimeValue).getMinutes() / 30) * 30 +
                            (4 - i) * 30
                        )
                      )
                        .toString()
                        .slice(16, 21)
                    )}
                    {new Date(
                      new Date(endTimeValue).setMinutes(
                        Math.ceil((new Date(endTimeValue).getMinutes() + 1) / 30) * 30 +
                          (4 - i) * 30 +
                          diff
                      )
                    )
                      .toString()
                      .slice(16, 21)}
                  </li>
                )
              })
            }
            </ul>
          }
          <label htmlFor="meet-date" className="new-meet-create__label-date-end">
            End
          </label>
          <input
            className="new-meet-create__time"
            type='time'
            onChange={ e => this.setState({ endTimeValue: e.target.value }) }
            value={ endTimeValue.toTimeString().slice(0,5) }
            onMouseOver={ () => this.setState({ possibleEndTimeShown: 1 }) }
            onMouseOut={ () => { setTimeout( () => { if (this.state.possibleEndTimeShown === 1) { this.setState({ possibleEndTimeShown: false }) } }, 200) } }
          /> {console.log(" debug endTimeValue sdfsdfsd : ", endTimeValue )}
          <label htmlFor="select" className="new-meet-create__meet-people-label">People</label>
          <input
            placeholder="For example, Elon Musk"
            type="text"
            className="new-meet-create__meet-people"
            onFocus={() => this.setState({ participantsListIsShown: 3 }) }
            onBlur={() => this.setState({ participantsListIsShown: false }) }
            onMouseOver={ () => { if (participantsListIsShown !== 3) this.setState({ participantsListIsShown: 1 }) } }
            onMouseOut={ () => {
              setTimeout( () => {
                if ( this.state.participantsListIsShown !== 3 && this.state.participantsListIsShown !== 2) {
                  this.setState({ participantsListIsShown: false })
                } }, 300)
            } }
            onChange={ e => findingParticipantChange(e.target.value) }
            value={ findingParticipant }
          />
          { participantsListIsShown &&
            <div
              className="new-meet-create__participants-list"
              onMouseOver={ () => { if (participantsListIsShown !== 3) this.setState({ participantsListIsShown: 2 }) }}
            >
              <ul className='new-meet-create__meet-people-list' > {console.log(' participants : ', participants)}
                { participants.filter( ({ name }) => name.toLowerCase().indexOf(findingParticipant.toLowerCase()) !== -1 ).map( (el, i) =>
                    <li
                      key={i}
                      onMouseDown={ e => this.addParticipant(e, el.name, i)}
                      onPointerEnter={ () => ( qa('li')[i].style.background = '#E9ECEF' ) }
                      onPointerLeave={ () => ( qa('li')[i].style.background = '#FFF' ) }
                    >
                      <img src={images[i]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>
                      {el.name}<span>{el.about}{people[el.name] && <b className="meet-people-list__added" > added</b>}</span>
                    </li>
                ) } {/* change images[1] to images[i] */}
              </ul>
              <div className="new-meet-create__hint" >
                <div className="new-meet-create__hint-text" >hint</div>
                You can write the name of the guest and the pass will be ordered automatically
              </div>
            </div>
          }
          <span className="new-meet-create__recommended-meeting-rooms-text">
            {selectedMeetingRoom ? "Meeting room" : "Recommended meeting room"}
            { recommendedMeetingRoom.length > 1 ? "s" : ""}
          </span>
          {
            selectedMeetingRoom && (
              <div
                className="new-meet-create__selected-meeting-room"
                onMouseOver={ () => { this.hoverMeetingRoom(); this.setState({ meetingRoomIsHover: 1 }) } }
                onMouseOut={ () => {
                  setTimeout( () => {
                    if ( this.state.meetingRoomIsHover === 1 ) {
                      this.setState({ recommendedMeetingRoom: [], meetingRoomIsHover: false })
                    } }, 200)
                } }
              >
                <img
                  src={ButtomArrowIcon}
                  alt=""
                  className="new-meet-create__buttom-arrow"
                  onMouseOver={ () => { this.hoverMeetingRoom(); this.setState({ meetingRoomIsHover: true }) } }
                  onMouseOut={() =>
                    this.setState({
                      recommendedMeetingRoom: [],
                      meetingRoomIsHover: false
                    })
                  }
                />
              {
                meetingRoomIsHover ? "Choose another meeting room?" : selectedMeetingRoom
              }
              </div>
            )
          }
          {
            !selectedMeetingRoom && <div className="new-meet-create__selected-meeting-room" >Choose meeting room</div>
          }
            {console.log(' debug condition : ', selectedMeetingRoom, !!selectedMeetingRoom, meetingRoomIsHover, !!meetingRoomIsHover, selectedMeetingRoom && meetingRoomIsHover )}
          <ul
            className="new-meet-create__meet-rooms"
            onMouseOver={ () => { this.setState({ meetingRoomIsHover: 2 }) }}
            onMouseLeave={ () => { setTimeout( () => { if (this.state.meetingRoomIsHover === 2 && selectedMeetingRoom ) { this.setState({ recommendedMeetingRoom: [], meetingRoomIsHover: false }) } }, 200) } }
          >
          { ( meetingRoomIsHover && selectedMeetingRoom ) ?
            recommendedMeetingRoom.map( (el, i) =>
                <li
                  key={i}
                  className="new-meet-create__meet-room"
                  onClick={ () => { this.setState({ recommendedMeetingRoom: [], meetingRoomIsHover: false }); setMeetingRoom(el.room); } }
                >
                  {`${beginTimeValue.toTimeString().slice(0,5)} — ${endTimeValue.toTimeString().slice(0,5)}  `}{el.room + ' • ' + el.floor + ' floor'}
                </li>
            ) :
            recommendedMeetingRoom.map( (el, i) =>
                <li key={i} className="new-meet-create__meet-room"
                  onClick={ () => { this.setState({ recommendedMeetingRoom: [], meetingRoomIsHover: false }); setMeetingRoom(el.room); } }
                >
                  {`${beginTimeValue.toTimeString().slice(0,5)} — ${endTimeValue.toTimeString().slice(0,5)}  `}{el.room + ' • ' + el.floor + ' floor'}
                </li>
            )
          }
          </ul>
          <button
            className="new-meet-create__back-button"
            onClick={() => {newMeetWindowShow(); setMeetingRoom() } }
          >
            {'Back'}
          </button>
          <button
            className="new-meet-create__create-button"
            onClick={() => {
              if ( selectedMeetingRoom ) {
                if ( isEmpty(people) ) alert(' choose participants ');
                else {
                  addMeet(selectedTimeBlock, people);
                  newMeetWindowShow();
                  setMeetingRoom("");
                }
              } else {
                alert("choose meet room")
              }
            }}
          >
            {"Create"}
          </button> {/* TODO: pass number of time block by time and meeting room */}
          <div className="invited-people">
            {/*{people.map( el => (<div className="invated-people__participant">{el.name}</div>))}*/}
            {Object.keys(people).map((keyName, i) => (
                <div
                  className="invited-people__participant"
                  key={i}
                  onMouseOver={() => this.setState({people: {...people, [keyName]: {...people[keyName], isHover: true } } }) }
                  onMouseLeave={() => this.setState({people: {...people, [keyName]: {...people[keyName], isHover: false } } }) }
                >
                    {/*<span className="input-label">key: {i} Name: {subjects[keyName]}</span>*/}
                    <img
                      src={images[people[keyName].image]} width="24px" height="24px" className="participants__avatar" alt=""/>
                    <div className="participants__name">{people[keyName].name}</div>
                    {
                      people[keyName].isHover && (
                        <img
                          src={images[37]}
                          width="24px"
                          height="24px"
                          className="participants__close-button"
                          alt=""
                          onClick={() => {
                              const newPeople = omit(people, keyName);
                              console.log(" debug delete participant : ", keyName, newPeople);
                              this.setState({ people: newPeople });
                            }
                          }
                        />
                      )
                    }
                </div>
            ))}
          </div>
          </div>
        </div>
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
