import React, { Component } from "react";
import GPIcon from "./images/gp-icon.svg";
import RightArrow from "./images/arrow.svg";
import LeftArrow from "./images/arrow2.svg";
import CloseButton from "./images/close.svg";
import { CSSTransitionGroup } from "react-transition-group";
import CreateNewMeetField from "./Components/Create-New-Meet-Field"
import { connect } from 'react-redux';
import { selectedTimeBlock } from './redux/actions';
import {bindActionCreators} from 'redux';

let q = document.querySelector.bind(document);



class Meetings extends Component {
  state = {
    isClicked: false,
    isOver: false,
    timeNow: new Date(),
    isHiddenPopup: false,
    newMeetWindowShown: false, // change to false
    lastClickedTimeBlock: 'none',
    meetingRoom: '',
    meetingRooms: {
      0: 'Lomonosov',
      1: 'Pavlov',
      2: 'Kapitza',
      3: 'Tamm',
      4: 'Mendeleev',
      5: 'Perelman',
      6: 'Lobachevsky',
      7: 'Landau'
    },
    timeBlocks: new Array(137),
    moreInfoPopup: false
  };
  componentDidMount() {
    document.addEventListener("mouseup", () => {
      this.setState({ isClicked: false });
    });
    // new Date().toLocaleTimeString();
    let offsetForVerticalTimeLine =
      289 +
      (new Date().getHours() - 7) * 76 +
      (75 / 60) * new Date().getMinutes();
    document.querySelector(".main__vertical-line").style.left =
      offsetForVerticalTimeLine + "px";
    document.querySelector(".main__time-now").style.left =
      offsetForVerticalTimeLine - 22 + "px";

    this.timerId = setInterval(() => this.tick(), 60 * 1000);
  }
  componentWillUnmount() {
    // document.removeEventListener('click', this.handleClickOutside);
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      timeNow: new Date()
    });
  }
  newMeetCreate = () => {
    this.setState({newMeetWindowShown: !this.state.newMeetWindowShown, meetingRoom: '' });
  }
  advancedSettingsOnClick() {
    this.setState({newMeetWindowShown: !this.state.newMeetWindowShown, isHiddenPopup: false});
  }
  mouseDownHandler(e, i) {
    console.log(' move : ', this.state.isClicked);
    if (this.state.isClicked) {
      let rect = e.target.getBoundingClientRect();
      // console.log(' progrss click : ', (e.clientX - rect.left)/0.75, i , '.number' + `${i}` );
      let el = document.querySelector(".number" + i);
      el.value = Math.round((e.clientX - rect.left) / 0.75) >= 95 ? 100 : Math.round((e.clientX - rect.left) / 0.75) ;
      q(".horizontal" + i).style.display = "none";
      q(".vertical" + i).style.display = "none";
      // console.log(' handler event pageX :', e.pageX, e.pageY, e.clientX);
      // document.querySelector('.number' + `${i}`).style.backgroundColor = 'black';
    }
    {
      /*this.setState({isClicked: false});*/
    }
  }
  showMoreInfoPopup = (e, i) => {

    if( this.state.timeBlocks[i] ) {
      if (this.state.moreInfoPopup) {
        this.setState({ moreInfoPopup: false });
        let offsetLeft = e.clientX - q(".main__meeting-rooms").offsetWidth,
            offsetTop = e.clientY - q(".header").offsetHeight - q(".main__date-picker").offsetHeight;
        console.log(' offsets : ', offsetLeft, offsetTop);
        setTimeout(() => {
          q(".number" + i).value = 100;
          this.setState({moreInfoPopup: true});
          // let rect = e.target.getBoundingClientRect();
          q(".meeting-schedule__more-info-popup").style.left = offsetLeft + "px";
          q(".meeting-schedule__more-info-popup").style.top = offsetTop + "px";
        }, 10);
      } else {
        q(".number" + i).value = 100;
          this.setState({moreInfoPopup: true});
        // let rect = e.target.getBoundingClientRect();
        let offsetLeft = e.clientX - q(".main__meeting-rooms").offsetWidth,
            offsetTop = e.clientY - q(".header").offsetHeight - q(".main__date-picker").offsetHeight;
        console.log(' offsets : ', offsetLeft, offsetTop);
        setTimeout(() => {
          q(".meeting-schedule__more-info-popup").style.left = offsetLeft + "px";
          q(".meeting-schedule__more-info-popup").style.top = offsetTop + "px";
        }, 0);
      }
    }
  }
  hideMoreInfoPopup = () => {
    console.log('debug');
    this.setState({moreInfoPopup: false});
  }
  onClick(e, i) {
    // if (this.state.isOver)
    // let rect = e.target.getBoundingClientRect();
    // console.log(' progrss click : ', (e.clientX - rect.left)/0.75, i , '.number' + `${i}` );
    // let el = document.querySelector('.number' + `${i}`);
    // el.value = Math.round( (e.clientX - rect.left)/0.75 ); // 0.75 width of progress element

    this.setState({meetingRoom: this.state.meetingRooms[Math.floor(i/17)]}); // find meeting room by clicking on time block
    if (this.state.lastClickedTimeBlock !== 'none') { // remove plus icon and backgroundColor from last clicked time block and add it to current clicked time block
      q(".plus" + this.state.lastClickedTimeBlock).style.display = "none";
      q(".number" + this.state.lastClickedTimeBlock).value = 0;
    }
    q(".plus" + i).style.display = "block";
    this.setState({lastClickedTimeBlock: i});

    if (this.state.isHiddenPopup) {
      this.setState({ isHiddenPopup: false });
      let offsetLeft = Math.ceil((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75)*75,
        offsetTop =
          e.clientY -
          q(".header").offsetHeight -
          q(".main__date-picker").offsetHeight;
      offsetLeft = (offsetLeft + 360 + q(".main__meeting-rooms").offsetWidth) > window.innerWidth ? (Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75)*75 - 360 + ( (Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75) ) - 1 ) ) : offsetLeft;
          console.log(" clientX ", e.clientY, e.clientX);
          console.log(' offsets : ', offsetLeft, offsetTop, q(".main__meeting-rooms").offsetWidth, (Math.floor((e.clientX - q(".main__meeting-rooms").offsetWidth) / 75)*75 ));
      setTimeout(() => {
        q(".number" + i).value = 100;
        this.setState({ isClicked: true, isHiddenPopup: true });
        // let rect = e.target.getBoundingClientRect();
        q(".meeting-schedule__popup").style.left = offsetLeft + "px";
        q(".meeting-schedule__popup").style.top = offsetTop + "px";
      }, 10);
    } else {
      q(".number" + i).value = 100;
      this.setState({ isClicked: true, isHiddenPopup: true });
      // let rect = e.target.getBoundingClientRect();
      let offsetLeft = e.clientX - q(".main__meeting-rooms").offsetWidth,
        offsetTop =
          e.clientY -
          q(".header").offsetHeight -
          q(".main__date-picker").offsetHeight;
      console.log(" clientX ", e.clientY, offsetTop);
      console.log(' offsets : ', offsetLeft, offsetTop);
      setTimeout(() => {
        q(".meeting-schedule__popup").style.left = offsetLeft + "px";
        q(".meeting-schedule__popup").style.top = offsetTop + "px";
      }, 0);
    }
  }
  closePopupHandler() {
    this.setState({isHiddenPopup: false});
  }
  isClickedFalse() {
    console.log(" onMouseUp : ", this.state.isClicked);
    this.setState({ isClicked: false });
  }
  preventDefault(e) {
    e.preventDefault();
  }
  mouseOver() {
    // this.setState({isClicked: false});
  }
  render() {
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
          <button className="header__button-create-meeting" onClick={() => this.newMeetCreate()}>
            { this.state.newMeetWindowShown && 'cancel meet' }
            { !this.state.newMeetWindowShown && 'new meet' } {/*meeting*/}
          </button>
        </header>
        <div className="main">
          {this.state.newMeetWindowShown &&
          <CreateNewMeetField
            timeBlocks={this.state.timeBlocks}
            meetingRooms={this.state.meetingRooms}
            newMeetCreate={this.newMeetCreate}
            meetingRoom={this.state.meetingRoom}
          />}
          <div className="main__time-now">
            {this.state.timeNow.toTimeString().slice(0, 5)}
          </div>
          <div className="main__vertical-line" />
          <div className="main__date-picker">
            <img className="date-picker__right-arrow" src={RightArrow} alt="" />
            <img className="date-picker__left-arrow" src={LeftArrow} alt="" />
            <span className="date-picker__date">
              <button className="date-picker__button" />
              <div className="date-picker__date-today">
                {this.state.timeNow.getDate()} · Today
              </div>
              <button className="date-picker__button" />
            </span>
            <div className="date-picker__hours">
              {Array.apply(null, { length: 16 }).map((el, i) => (
                <span key={i + 8} className="date-picker__hour">{i + 8}</span>
              ))}
            </div>
          </div>
          <div className="main__meeting-rooms">
            <p className="meeting-rooms__floor">2 floor</p>
            <ul>
              <li>
                <p>Lomonosov</p>
                <p>up to 30 people</p> {/* up to 30 mb */}
              </li>
              <li>
                <p>Pavlov</p>
                <p>up to 20 people</p>
              </li>
              <li>
                <p>Kapitza</p>
                <p>up to 20 people</p>
              </li>
              <li>
                <p>Tamm 👉</p>
                <p>up to 10 people</p>
              </li>
            </ul>
            <p className="meeting-rooms__floor">4 floor</p>
            <ul>
              <li>
                <p>Mendeleev</p>
                <p>from 4 to 8</p> {/* up to 30 mb */}
              </li>
              <li>
                <p>Perelman</p>
                <p>from 4 to 8</p>
              </li>
              <li>
                <p>Lobachevsky</p>
                <p>from 3 to 6</p>
              </li>
              <li>
                <p>Landau</p>
                <p>from 3 to 6</p>
              </li>
            </ul>
          </div>
          <div className="meeting-schedule">
            <CSSTransitionGroup
              style={{ position: "absolute" }}
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={1}
            >
              {
                this.state.moreInfoPopup && (
                  <div className="meeting-schedule__more-info-popup" >
                    <div>request to swap</div>
                    <img src="" alt=""/>
                  </div>
                )
              }
              {this.state.isHiddenPopup && (
                <div className="meeting-schedule__popup">
                  <img src={CloseButton} className="popup__close-button" alt="" onClick={() => this.closePopupHandler()} />
                  <input className="poput__input-meet-name" type="text" placeholder="Meet name"/>
                  <input className="poput__input-meet-name" type="text" placeholder="date"/>
                  <input className="poput__input-meet-name" type="text" placeholder="Guests"/>
                  <span
                    className="popup__advanced-settings"
                    onClick={() => this.advancedSettingsOnClick()}
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
                  onMouseMove={e => this.mouseDownHandler(e, i)}
                  onMouseDown={e => { this.onClick(e, i); this.props.selectedTimeBlock(i); } }
                  onMouseUp={() => this.isClickedFalse()}
                  onDragStart={e => this.preventDefault(e)}
                  onMouseOver={() => this.mouseOver()}
                />
                <div
                  className={"plus-box plus" + i}
                  tabIndex="0"
                  onClick={e => this.showMoreInfoPopup(e, i)}
                  onMouseMove={e => this.mouseDownHandler(e, i)}
                  onBlur={() => this.hideMoreInfoPopup()}
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
  return bindActionCreators({ selectedTimeBlock: selectedTimeBlock }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Meetings)
