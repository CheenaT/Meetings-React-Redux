import React, { Component } from "react";
import GPIcon from "./images/gp-icon.svg";
import RightArrow from "./images/next.svg";
import LeftArrow from "./images/back.svg";
import CloseButton from "./images/close.svg";
import { CSSTransitionGroup } from "react-transition-group";
import CreateNewMeetField from "./Components/Create-New-Meet-Field";
import { connect } from 'react-redux';
import { setSelectedTimeBlock, newMeetWindowShow, setMeetingRoom } from './redux/actions';
import { bindActionCreators } from 'redux';
import { meetingRooms, floorsWithMeetingRooms } from './constants.js';

let q = document.querySelector.bind(document);

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

class Meetings extends Component {
  state = {
    isClicked: false,
    timeNow: new Date(),
    isHiddenPopup: false,
    moreInfoPopup: false
  };
  componentDidMount() {
    document.addEventListener("mouseup", () => {
      this.setState({ isClicked: false });
    });
    let offsetForVerticalTimeLine =
      (new Date().getHours() - 8) * 76 +
      (75 / 60) * new Date().getMinutes();
      console.log(' debug main__vertical-line : ', offsetForVerticalTimeLine, new Date().getHours() - 7 );
    q(".main__vertical-line").style.left =
      offsetForVerticalTimeLine + "px";
    q(".main__time-now").style.left =
      offsetForVerticalTimeLine - 22 + "px";

    this.timerId = setInterval(() => this.tick(), 60 * 1000);

    for ( let i = 0; i < 136; i++ ) {
      if ( this.props.timeBlocksR.timeBlocks[i] ) {
        q(`.plus${i}`).style.backgroundColor = 'rgb(6, 68, 124)';
        q(`.plus${i}`).style.display = 'block';
        q(`.horizontal${i}`).style.display = 'none';
        q(`.vertical${i}`).style.display = 'none';
        let first;
        for (first in this.props.timeBlocksR.timeBlocks[i]) break;
        let img = document.createElement("img");
        console.log(' debug images src : ', this.props.timeBlocksR.timeBlocks[i][first].image );
        img.src = images[this.props.timeBlocksR.timeBlocks[i][first].image];
        img.setAttribute('class', 'plus-box__image');
        // q(`.plus${i}`).innerHTML = first.split(' ')[1] ? first.split(' ')[1] : first.split(' ')[0];
        let name = document.createElement("div");
        name.style.position = "relative";
        name.style.left = "6.5px";
        name.style.fontFamily = "Poppins";
        name.style.fontSize = "13px";
        name.style.width = "59px";
        name.innerText = first.split(' ')[1] ? first.split(' ')[1] : first.split(' ')[0];
        q(`.plus${i}`).appendChild(name);
        q(`.plus${i}`).appendChild(img);
      }
    }
  }
  componentDidUpdate() {
    let offsetForVerticalTimeLine =
      (new Date().getHours() - 8) * 76 +
      (75 / 60) * new Date().getMinutes();
      console.log(' debug main__vertical-line : ', offsetForVerticalTimeLine, new Date().getHours() - 7 );
    q(".main__vertical-line").style.left =
      offsetForVerticalTimeLine + "px";
    q(".main__time-now").style.left =
      offsetForVerticalTimeLine - 22 + "px";
  }
  componentWillUnmount() {
    // document.removeEventListener('click', this.handleClickOutside); // I think its not need
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      timeNow: new Date()
    });
  }
  newMeetCreate = () => {
    this.setState({ isHiddenPopup: false });
    this.props.setMeetingRoom('');
  }
  mouseMoveHandler(e, i) {
    console.log(' move : ', this.state.isClicked);
    if (this.state.isClicked) {
      this.props.setSelectedTimeBlock(i);
      this.setState({ isHiddenPopup: false });
      let rect = e.target.getBoundingClientRect();
      let el = q(".number" + i);
      el.value = Math.round((e.clientX - rect.left) / 0.75) >= 95 ? 100 : Math.round((e.clientX - rect.left) / 0.75) ;
      if ( q(".horizontal" + i).style.display !== "none" || q(".vertical" + i).style.display !== "none" ) {
        q(".horizontal" + i).style.display = "none";
        q(".vertical" + i).style.display = "none";
      }
    }
  }
  showMoreInfoPopup = (e, i) => {
    this.setState({ isClicked: true });
    console.log(' showMoreInfoPopup ', this.props.timeBlocksR.timeBlocks[i], this.state.isClicked, this.state.moreInfoPopup);
    if( this.props.timeBlocksR.timeBlocks[i] ) {
      this.setState({moreInfoPopup: true});
      // let offsetLeft =
      //     Math.ceil((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) * 75 +
      //     Math.ceil((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) +
      //     5,
      let offsetLeft = ((this.props.timeBlocksR.selectedTimeBlock % 17) + 1) * 75 + ((this.props.timeBlocksR.selectedTimeBlock % 17) + 1) + 5,
      offsetTop =
          47 + Math.floor(i / 17) * 51.6 + (Math.floor(i / 17) > 3 ? 30.4 : 0) - 12;
      // offsetLeft = offsetLeft + 360 + q(".main__meeting-rooms").offsetWidth > window.innerWidth
      //     ? Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) * 75 - 360 +
      //       (Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) - 1) - 5
      //     : offsetLeft;
      console.log(' debug offsetLeft : ', offsetLeft);
      setTimeout(() => {
        q(".meeting-schedule__more-info-popup").style.left = offsetLeft + "px";
        q(".meeting-schedule__more-info-popup").style.top = offsetTop + "px";
      }, 0);
    }
  }
  onMouseDown(e, i) {
    const { timeBlocksR: { selectedTimeBlock, timeBlocks }, setSelectedTimeBlock, setMeetingRoom } = this.props;
    let meetingRoom = Math.floor(this.props.timeBlocksR.selectedTimeBlock/17);
    this.setState({ isClicked: true, moreInfoPopup: false }); // find meeting room by clicking on time block
    setMeetingRoom(meetingRooms[Math.floor(i/17)]);
    console.log(' lastSelected : ', selectedTimeBlock, i, timeBlocks[i]);
    if ( selectedTimeBlock !== -1 && selectedTimeBlock !== i && !timeBlocks[selectedTimeBlock] ) { // remove plus icon and backgroundColor from last clicked time block and add it to current clicked time block
      q(".plus" + selectedTimeBlock).style.display = "none";
      q(".number" + selectedTimeBlock).value = 0;
      q(`.meeting-room-${meetingRoom}`).style.color = '#fff';
      q(`.hour${selectedTimeBlock % 17}`).style.color = '#fff';
      q(`.hour${selectedTimeBlock % 17}`).style.removeProperty('font-weight');
    }
    if ( !this.props.timeBlocksR.timeBlocks[i] ) {
      q(".plus" + i).style.display = "block";
      q(".horizontal" + i).style.display = "block";
      q(".vertical" + i).style.display = "block";
      meetingRoom = Math.floor(i/17);
      q(`.meeting-room-${meetingRoom}`).style.color = '#022647';
      q(`.hour${i % 17}`).style.color = '#022647';
      q(`.hour${i % 17}`).style.fontWeight = 'bold';
    }
    setSelectedTimeBlock(i);
  }
  isClickedFalse(e, i) {
    console.log(" onMouseUp : ", !!this.props.timeBlocksR.timeBlocks[i], i);
    if ( !this.props.timeBlocksR.timeBlocks[i] ) {
      q(".number" + i).value = 100;
      q(".plus" + i).style.display = "block";
      q(".horizontal" + i).style.display = "block";
      q(".vertical" + i).style.display = "block";
      let offsetLeft =
          Math.ceil((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) * 75 +
          Math.ceil((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) +
          5,
      offsetTop =
          47 + Math.floor(i / 17) * 51.6 + (Math.floor(i / 17) > 3 ? 30.4 : 0) - 12;
      offsetLeft = offsetLeft + 360 + q(".main__meeting-rooms").offsetWidth > window.innerWidth
          ? Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) * 75 - 360 +
            (Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) - 1) - 5
          : offsetLeft;
      if ( !this.state.moreInfoPopup ) {
        setTimeout( () => {
          this.setState({ isClicked: false, isHiddenPopup: true });
          q(".meeting-schedule__popup").style.left = offsetLeft + "px";
          q(".meeting-schedule__popup").style.top = offsetTop + "px";
        }, 0);
      }
    }
  }
  preventDefault(e) {
    e.preventDefault();
  }
  render() {
    const { timeBlocksR: { newMeetWindowShown, timeBlocks, selectedTimeBlock }, newMeetWindowShow } = this.props,
          { timeNow, moreInfoPopup, isHiddenPopup } = this.state;
    let i = 0;
    return (
      <div className="basicLayout">
        <header className="header">
          <img
            className="header__gp-icon"
            src={GPIcon}
            width="50"
            height="50"
            alt=""
          />
          <div className="header__text">Meetings</div>
          {/*<input className="header__order-pass-if-forgot-someone"></input>*/}
          <button className="header__button-create-meeting" onClick={() => { this.newMeetCreate(); newMeetWindowShow() }}>
            { newMeetWindowShown ? 'cancel meet' : 'new meet' } {/* or mb 'new meeting'*/}
          </button>
        </header>
        <div className="main">
          {newMeetWindowShown && <CreateNewMeetField/>}
          <div className="main__date-picker">
              <div className="date-picker__date-today">
                <img className="date-picker__arrows" src={LeftArrow} alt="" />
                <span>
                  {timeNow.getDate() +
                    " " +
                    timeNow
                      .toDateString()
                      .split(" ")[1]
                      .toLowerCase()}{" "}
                  • Today
                </span>
                <img className="date-picker__arrows" src={RightArrow} alt="" />
              </div>
            <div className="date-picker__hours">
              {Array.apply(null, { length: 16 }).map((el, i) => (
                <span key={i + 8} className={`date-picker__hour hour${i}`}>{i + 8}</span>
              ))}
            </div>
          </div>
          <div className="main__meeting-rooms">
          {
            floorsWithMeetingRooms.map(el => (
              <React.Fragment key={el.floor}>
                <p className="meeting-rooms__floor">{el.floor + " floor"}</p>
                <ul>
                  {el.meetingRooms.map(el => (
                    <li key={el.room} className={`meeting-room-${i++}`}>
                      <p>{el.room}</p>
                      {el.capacityMax ? (
                        <p>{`from ${el.capacity} to ${el.capacityMax} people`}</p>
                      ) : (
                        <p>{`up to ${el.capacity} people`}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ))
          }
          </div>
          <div className="meeting-schedule">
            <div className="main__time-now">
              {timeNow.toTimeString().slice(0, 5)}
            </div>
            <div className="main__vertical-line" />
            <CSSTransitionGroup
              style={{ position: "absolute" }}
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={1}
            >
              {
                moreInfoPopup && (
                  <div className="meeting-schedule__more-info-popup" >
                    <img
                      src={CloseButton}
                      className="popup__close-button"
                      alt=""
                      onClick={() => this.setState({ moreInfoPopup: false }) }
                      onBlur={() => this.setState({moreInfoPopup: false})}
                    />
                    <div>request to swap</div> {console.log( ' debug participants : ', Object.keys(timeBlocks[selectedTimeBlock]).map( el => (timeBlocks[selectedTimeBlock][el].name ) ) )}
                    <div>show participants</div>
                    <div>
                      {Object.keys(timeBlocks[selectedTimeBlock]).map( (el, i) => (
                        <div key={i} >{timeBlocks[selectedTimeBlock][el].name}</div>
                      ))}
                    </div>
                    <img src="" alt=""/>
                  </div>
                )
              }
              { isHiddenPopup && (
                <div className="meeting-schedule__popup">
                  <img
                    src={CloseButton}
                    className="popup__close-button"
                    alt=""
                    onClick={() => {
                      console.log(' debug : ', selectedTimeBlock);
                      q(`.plus${selectedTimeBlock}`).style.display = 'none';
                      q(`.horizontal${selectedTimeBlock}`).style.display = 'none';
                      q(`.vertical${selectedTimeBlock}`).style.display = 'none';
                      q(`.number${selectedTimeBlock}`).value = 0;
                      this.setState({ isHiddenPopup: false }) } }
                  />
                  <input className="poput__input-meet-name" type="text" placeholder="Meet name"/>
                  <input className="poput__input-meet-name" type="text" placeholder="date"/>
                  <input className="poput__input-meet-name" type="text" placeholder="Guests"/>
                  <span
                    className="popup__advanced-settings"
                    onClick={ () => { this.setState({ isHiddenPopup: false }); newMeetWindowShow() } }
                  >
                    advanced settings
                  </span>
                  <button className="popup__advanced-confirm">confirm</button>
                </div>
              )}
            </CSSTransitionGroup>
            {Array.apply(null, { length: 136 }).map((el, i) => (
              <div key={i}>
                <progress
                  value="0"
                  max="100"
                  className={"box number" + i}
                  onMouseMove={ e => this.mouseMoveHandler(e, i) }
                  onMouseDown={ e => this.onMouseDown(e, i) }
                  onMouseUp={ e => this.isClickedFalse(e, i) }
                  onDragStart={ e => this.preventDefault(e) }
                />
                <div
                  className={"plus-box plus" + i}
                  tabIndex="0"
                  onMouseMove={e => this.mouseMoveHandler(e, i)}
                  onMouseDown={e => { this.onMouseDown(e, i); } }
                  onMouseUp={ e => { this.isClickedFalse(e, i); this.showMoreInfoPopup(e, i) } }
                  onDragStart={ e => this.preventDefault(e) }
                  // onBlur={() => this.setState({moreInfoPopup: false})}
                > {/* tabIndex need for working onBlur https://webaim.org/techniques/keyboard/tabindex */}
                  <div className={"box__plus-h horizontal" + i}></div>
                  <div className={"box__plus-v vertical" + i}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { timeBlocksR: state.timeBlocksR }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setSelectedTimeBlock: setSelectedTimeBlock,
      newMeetWindowShow: newMeetWindowShow,
      setMeetingRoom: setMeetingRoom
    },
    dispatch
  );
};


export default connect(mapStateToProps, mapDispatchToProps)(Meetings)
