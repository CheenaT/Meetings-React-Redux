import React, { Component } from "react";
import GPIcon from "./images/gp-icon.svg";
import RightArrow from "./images/arrow.svg";
import LeftArrow from "./images/arrow2.svg";
import CloseButton from "./images/close.svg";
import { CSSTransitionGroup } from "react-transition-group";
import CreateNewMeetField from "./Components/Create-New-Meet-Field"

class Meetings extends Component {
  state = {
    isClicked: false,
    isOver: false,
    timeNow: new Date(),
    isHiddenPopup: false,
    newMeetWindowShown: false // change to false
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
  newMeetCreate() {
    this.setState({newMeetWindowShown: !this.state.newMeetWindowShown});
  }
  mouseDownHandler(e, i) {
    console.log(this.state.isClicked);
    if (this.state.isClicked) {
      let rect = e.target.getBoundingClientRect();
      // console.log(' progrss click : ', (e.clientX - rect.left)/0.75, i , '.number' + `${i}` );
      let el = document.querySelector(".number" + `${i}`);
      el.style.backgroundColor = "cyan";
      el.value = Math.round((e.clientX - rect.left) / 0.75);
      // console.log(' handler event pageX :', e.pageX, e.pageY, e.clientX);
      // document.querySelector('.number' + `${i}`).style.backgroundColor = 'black';
    }
    {
      /*this.setState({isClicked: false});*/
    }
  }
  onClick(e, i) {
    // if (this.state.isOver)
    // let rect = e.target.getBoundingClientRect();
    // console.log(' progrss click : ', (e.clientX - rect.left)/0.75, i , '.number' + `${i}` );
    // let el = document.querySelector('.number' + `${i}`);
    // el.value = Math.round( (e.clientX - rect.left)/0.75 ); // 0.75 width of progress element
    let q = document.querySelector.bind(document);

    q(".plus" + `${i}`).style.display = "block";
    if (this.state.isHiddenPopup) {
      this.setState({ isHiddenPopup: false });
      let offsetLeft = e.clientX - q(".main__meeting-rooms").offsetWidth,
        offsetTop =
          e.clientY -
          q(".header").offsetHeight -
          q(".main__date-picker").offsetHeight;
      setTimeout(() => {
        q(".number" + `${i}`).value = 100;
        this.setState({ isClicked: true, isHiddenPopup: true });
        // let rect = e.target.getBoundingClientRect();
        q(".meeting-schedule__popup").style.left = offsetLeft + "px";
        q(".meeting-schedule__popup").style.top = offsetTop + "px";
      }, 7);
    } else {
      q(".number" + `${i}`).value = 100;
      this.setState({ isClicked: true, isHiddenPopup: true });
      // let rect = e.target.getBoundingClientRect();
      let offsetLeft = e.clientX - q(".main__meeting-rooms").offsetWidth,
        offsetTop =
          e.clientY -
          q(".header").offsetHeight -
          q(".main__date-picker").offsetHeight;
      console.log(" clientX ", e.clientY, offsetTop);
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
          <button className="header__button-create-meeting" onClick={() => this.newMeetCreate()}>
            { this.state.newMeetWindowShown && 'cancel meet' }
            { !this.state.newMeetWindowShown && 'new meet' } {/*meeting*/}
          </button>
        </header>
        <div className="main">
          {this.state.newMeetWindowShown &&
          <CreateNewMeetField />}
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
                <p>up to 30 people</p>
              </li>
              <li>
                <p>Kapitza</p>
                <p>up to 30 people</p>
              </li>
              <li>
                <p>Tamm 👉</p>
                <p>up to 30 people</p>
              </li>
            </ul>
            <p className="meeting-rooms__floor">4 floor</p>
            <ul>
              <li>
                <p>Mendeleev</p>
                <p>up to 30 people</p> {/* up to 30 mb */}
              </li>
              <li>
                <p>Perelman</p>
                <p>up to 30 people</p>
              </li>
              <li>
                <p>Lobachevsky</p>
                <p>up to 30 people</p>
              </li>
              <li>
                <p>Landau</p>
                <p>up to 30 people</p>
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
              {this.state.isHiddenPopup && (
                <div className="meeting-schedule__popup">
                  <img src={CloseButton} className="popup__close-button" alt="" onClick={() => this.closePopupHandler()} />
                  <input className="poput__input-meet-name" type="text" placeholder="Meet name"/>
                  <input className="poput__input-meet-name" type="text" placeholder="date"/>
                  <input className="poput__input-meet-name" type="text" placeholder="Guests"/>
                </div>
              )}
            </CSSTransitionGroup>

            {Array.apply(null, { length: 136 }).map((el, i) => (
              <div key={i}>
                <progress
                  value="0"
                  max="100"
                  className={"box " + "number" + `${i}`}
                  onMouseMove={e => this.mouseDownHandler(e, i)}
                  onMouseDown={e => this.onClick(e, i)}
                  onMouseUp={() => this.isClickedFalse()}
                  onDragStart={e => this.preventDefault(e)}
                  onMouseOver={() => this.mouseOver()}
                />
                <div className={"plus" + `${i}`} style={{display: 'none'}} >
                  <div className="box__plus-h"></div>
                  <div className="box__plus-v"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Meetings;
