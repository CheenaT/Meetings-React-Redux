import React from "react";
import ButtomArrowIcon from './../../images/buttom-arrow.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { participants } from './data.js';
import { connect } from 'react-redux';
import { addMeet } from '../../redux/actions';
import {bindActionCreators} from 'redux';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('./../../images', false, /\.(png|jpe?g|svg)$/));
console.log(' images : ', images);

// const people = [{name: 'Lex'}, {name: 'Wayne'}];
class CreateNewMeetField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeValue: (((+new Date().toTimeString().slice(3, 5) > 54 ? 1 : 0) + +new Date().toTimeString().slice(0, 2) ) < 9 ? '0' : 0) +
        ((+new Date().toTimeString().slice(3, 5) > 54 ? 1 : 0) + +new Date().toTimeString().slice(0, 2) ) +
        ":" + (+new Date().toTimeString().slice(3, 5) < 5 || +new Date().toTimeString().slice(3, 5) > 54 ? 0 : '' ) +
        (((((+new Date().toTimeString().slice(3, 5) + 5) / 5) | 0) * 5) % 60),
      endTimeValue: ((       +new Date().toTimeString().slice(0, 2) +
      (+new Date().toTimeString().slice(3, 5) + 30 > 54 ? 1 : 0)) % 24 === 0 ? '0' : '') + (       +new Date().toTimeString().slice(0, 2) +
      (+new Date().toTimeString().slice(3, 5) + 30 > 54 ? 1 : 0)) % 24 +
      ":" +
        ( (((((+new Date().toTimeString().slice(3, 5) + 30 + 5) / 5) | 0) * 5) %
        60) < 9 ? '0' : '' ) +               (((((+new Date().toTimeString().slice(3, 5) + 30 + 5) / 5) | 0) * 5) %
        60),
      participantsListIsShown: false,
      startDate: new Date(),
      recommendedMeetingRoom: this.props.meetingRoom ? this.props.meetingRoom : [], //'Unexplored territory, up to 30 people'
      people: {}
    };
    let hours = new Date().getHours(), { meetingRooms, timeBlocksR } = this.props;
    if ( !this.props.meetingRoom ) {
      for( let i = 0; i < Object.keys(meetingRooms).length; i++ ) {
        if ( !timeBlocksR.timeBlocks[hours - 8 + 17 * i] ) {
          this.state.recommendedMeetingRoom.push(meetingRooms[i]);
        }
      }
    }
    this.handleChange = this.handleChange.bind(this);
    // this.onFirstTimeChange = this.onFirstTimeChange.bind(this);
  }
  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  componentDidMount() {
    console.log(document.getElementById('meet-date'));
    // document.getElementById('meet-date').value = new Date().toJSON().slice(0,10);
  }
  onFirstTimeChange(e) {
    this.setState({ timeValue: e.target.value });
  }
  endTimeChange(e) {
    this.setState({ endTimeValue: e.target.value });
  }
  onFocusInput() {
    this.setState({ participantsListIsShown: true })
  }
  onBlurInput() {
    this.setState({ participantsListIsShown: false })
  }
  hoverMeetingRoom = () => {
    // this.setState({recommendedMeetingRoom: 'Choose another meeting room?'});
  }
  outMeetingRoom = () => {
    // this.setState({recommendedMeetingRoom: this.props.meetingRoom ? this.props.meetingRoom : 'Unexplored territory, up to 30 people' });
  }
  addParticipant = (e, name, i) => {
    let newPeople = {...this.state.people, [name]: { name, image: i } }; // change 1 to id
    this.setState({people: newPeople });
    console.log(' addParticipant : ', e, name, newPeople, this.state.people);
  }
  render() {
    return (
      <div>
        <form action="" className="main__new-meet-create">

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
            onChange={this.handleChange}
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
          <input
            type="time"
            className="new-meet-create__time"
            onChange={(e) => this.onFirstTimeChange(e)}
            value = {this.state.timeValue}
          />
          <div className="new-meet-create__hyphen-between-times">—</div>
          <label htmlFor="meet-date" className="new-meet-create__label-date-end">
            End
          </label>
          <input
            type="time"
            className="new-meet-create__time"
            onChange={(e) => this.endTimeChange(e)}
            value={this.state.endTimeValue}
          />
          <label htmlFor="select" className="new-meet-create__meet-people-label">People</label>
          <input placeholder="For example, Elon Musk" type="text" className="new-meet-create__meet-people" onFocus={() => this.onFocusInput()} onBlur={() => this.onBlurInput()} />
          { this.state.participantsListIsShown &&
            <div style={{position: 'relative'}}>
              <ul className='new-meet-create__meet-people-list'> {console.log(' participants : ', participants)}
                { participants.map( (el, i) =>
                    <li onMouseDown={e => this.addParticipant(e, el.name, i)} ><img src={images[1]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>{el.name}<span>{el.about}</span></li>
                )} {/* change images[1] to images[i] */}
                {/*<li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[1]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Darth Vader<span> &bull; Supreme commander of the Galactic Empire &bull; last floor</span></li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[6]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Genghis Khan<span> &bull; CEO and founter of Mongol Empire &bull; 18 floor</span></li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[10]} width="24px" height="24px" className="meet-people-list__avatar" alt="terrible hitman"/>Vincent Vega<span> &bull; hitman &bull; 2 floor</span></li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Elon Musk<span> &bull; co-founder, CEO and designer at Tesla and SpaceX &bull; 28 floor</span></li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Neo<span> &bull; The One, ex-software engineer in our Matrix simulation &bull; any floor</span></li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tom Riddle<span> &bull;  &bull; last floor</span></li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>4</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Joker founder of insanity</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Vito Corleone</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>James Bond</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Batman</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tony Stark</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Aragorn</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Gautama Buddha Founder of Buddhism</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Anton Chigurh &bull; -1 floor</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Ace Ventura</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Gabe Newell</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Yagami Light &bull; God of the new world, also known as justice</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Dalai Lama</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Eru Rōraito also known as L</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Erald Coil second most famous detective in the world </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Deneuve third most famous detective in the world </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>The Shinigami King (死神大王, Shinigami Daiō), also known as the King of Death, is the ruler of all Shinigami in the Shinigami Realm </li>

                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Mark Lilly &bull; social worker </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Deneuve third most famous detective in the world </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Deneuve third most famous detective in the world </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Deneuve third most famous detective in the world </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Deneuve third most famous detective in the world </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>N'aix &bull; main damage dealer</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>X &bull; Lethal benefit dealer</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Ramzes666 &bull; </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Eyes of the Dead God &bull; </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Dan Abramov &bull; </li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tyler Durden second personality</li>
                <li onMouseDown={e => this.addParticipant(e, 'Darth Vader')} ><img src={images[5]} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Ernest Hemingway<span> &bull; last floor</span></li>*/}
              </ul>
              <div className="new-meet-create__hint" >
                <div className="new-meet-create__hint-text" >hint</div>
                You can write the name of the guest and the pass will be ordered automatically
              </div>
            </div>
          }
          {/*<select name="" id="select" className="new-meet-create__meet-people">
            <option value="Darth Vader" icon='./../../images/Anakin.jpg' style={{ backgroundImage: "url('http://www.google.com/images/srpr/logo3w.png')" }} >Darth Vader</option>
            <option value="Ernest Hemingway">Ernest Hemingway</option>
            <option value="Neo">Neo</option>
            <option value="Vincent Vega">Vincent Vega</option>
            <option value="Batman">Batman</option>
            <option value="Captain Jack Sparrow">Captain Jack Sparrow</option>
            <option value="Quasimodo">Quasimodo</option>
            <option value="Shrek">Shrek</option>
            <option value="Freddy Krueger">Freddy Krueger</option>
            <option value="Terminator">Terminator</option>
            <option value="Dr. House">Dr. House</option>
            <option value="Hawthorne">Hawthorne</option>
          </select>*/}
          {/*<div id="image-dropdown" >
            <input defaultChecked="checked" type="radio" id="line1" name="line-style" value="1"  /><label htmlFor="line1"></label>
            <input type="radio" id="line2" name="line-style" value="2"  /><label htmlFor="line2" className="label2"></label>
            <input type="radio" id="line3" name="line-style" value="3"  /><label htmlFor="line3"></label>
            <input type="radio" id="line4" name="line-style" value="4"  /><label htmlFor="line4"></label>
            <input type="radio" id="line5" name="line-style" value="5"  /><label htmlFor="line5"></label>
            <input type="radio" id="line6" name="line-style" value="6"  /><label htmlFor="line6"></label>
            <input type="radio" id="line7" name="line-style" value="7"  /><label htmlFor="line7"></label>
          </div>*/}
          <span className="new-meet-create__recommended-meeting-rooms-text">{this.props.meetingRoom ? 'Meeting room' : 'Recommended meeting room' }{false ? 's' : ''}</span>
          <img src={ButtomArrowIcon} alt="" className="new-meet-create__buttom-arrow" onMouseOver={this.hoverMeetingRoom} onMouseOut={this.outMeetingRoom} />
          { this.props.meetingRoom ?
            <div className="new-meet-create__selected-meeting-room" onMouseOver={this.hoverMeetingRoom} onMouseOut={this.outMeetingRoom} >{this.state.recommendedMeetingRoom}</div> :
            this.state.recommendedMeetingRoom.map( el =>
                <div key={el} className="new-meet-create__meet-room" onMouseOver={this.hoverMeetingRoom} onMouseOut={this.outMeetingRoom} >
                  {el}
                </div>
            )
          }
          <button
            className="new-meet-create__back-button"
            onClick={this.props.newMeetCreate}
          >
            {'Back'}
          </button>
          <button
            className="new-meet-create__create-button"
            onClick={() => { this.props.newMeetCreate(); this.props.addMeet(this.props.timeBlocksR.selectedTimeBlock) } }
          >
            {'Create'}
          </button> {/* TODO: pass number of time block by time and meeting room */}
          <div className="invated-people">
            {/*{people.map( el => (<div className="invated-people__participant">{el.name}</div>))}*/}
            {Object.keys(this.state.people).map((keyName, i) => (
                <div className="invated-people__participant" key={i}>
                    {/*<span className="input-label">key: {i} Name: {subjects[keyName]}</span>*/}
                    {this.state.people[keyName].name}
                </div>
            ))}
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { timeBlocksR: state.timeBlocksR }
}

{/*const mapDispatchToProps = dispatch => {
  return
}*/}

function mapDispatchToProps(dispatch){
   return bindActionCreators({ addMeet: addMeet}, dispatch);
 }

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewMeetField)
