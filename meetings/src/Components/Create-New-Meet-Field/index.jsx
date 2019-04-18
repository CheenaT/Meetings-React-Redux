import React from "react";
import Anakin from "./../../images/Anakin.jpg"

const people = [{name: 'Lex'}, {name: 'Wayne'}];
class CreateNewMeetField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeValue: (((+new Date().toTimeString().slice(3, 5) > 54 ? 1 : 0) + +new Date().toTimeString().slice(0, 2) ) < 9 ? '0' : 0) +
        ((+new Date().toTimeString().slice(3, 5) > 54 ? 1 : 0) + +new Date().toTimeString().slice(0, 2) ) +
        ":" + (+new Date().toTimeString().slice(3, 5) < 5 || +new Date().toTimeString().slice(3, 5) > 54 ? 0 : '' ) +
        (((((+new Date().toTimeString().slice(3, 5) + 5) / 5) | 0) * 5) % 60),
      participantsListIsShown: false
    };

    // this.onFirstTimeChange = this.onFirstTimeChange.bind(this);
  }

  componentDidMount() {
    console.log(document.getElementById('meet-date'));
    document.getElementById('meet-date').value = new Date().toJSON().slice(0,10);
  }
  onFirstTimeChange(e) {
    this.setState({ timeValue: e.target.value });
  }
  onFocusInput() {
    this.setState({ participantsListIsShown: true })
  }
  onBlurInput() {
    this.setState({ participantsListIsShown: false })
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
            placeholder="What shall we talk about?"
          />
          <label htmlFor="meet-date" className="new-meet-create__label-date">
            Date
          </label>
          <input
            type="date"
            id="meet-date"
            className="new-meet-create__meet-date"
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
          <label htmlFor="meet-date" className="new-meet-create__label-date-end">
            End
          </label>
          <input
            type="time"
            className="new-meet-create__time"
            value={
              ((       +new Date().toTimeString().slice(0, 2) +
              (+new Date().toTimeString().slice(3, 5) + 30 > 54 ? 1 : 0)) % 24 === 0 ? '0' : '') + (       +new Date().toTimeString().slice(0, 2) +
              (+new Date().toTimeString().slice(3, 5) + 30 > 54 ? 1 : 0)) % 24 +
              ":" +
                ( (((((+new Date().toTimeString().slice(3, 5) + 30 + 5) / 5) | 0) * 5) %
                60) < 9 ? '0' : '' ) +               (((((+new Date().toTimeString().slice(3, 5) + 30 + 5) / 5) | 0) * 5) %
                60)
            }
          />
          <label htmlFor="select" className="new-meet-create__meet-people-label">People</label>
          <input placeholder="For example, Elon Musk" type="text" className="new-meet-create__meet-people" onFocus={() => this.onFocusInput()} onBlur={() => this.onBlurInput()} />
          { this.state.participantsListIsShown &&
            <div style={{position: 'relative'}}>
              <ul className='new-meet-create__meet-people-list'>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Darth Vader<span> &bull; Supreme commander of the Galactic Empire &bull; last floor</span></li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Genghis Khan<span> &bull; CEO and founter of Mongol Empire &bull; 18 floor</span></li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt="terrible hitman"/>Vincent Vega<span> &bull; hitman &bull; 2 floor</span></li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Elon Musk<span> &bull; co-founder, CEO and designer at Tesla and SpaceX &bull; 28 floor</span></li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Neo<span> &bull; The One, ex-software engineer in our Matrix simulation &bull; any floor</span></li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tom Riddle<span> &bull;  &bull; last floor</span></li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>4</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Joker founter of insanity</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Vito Corleone</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>James Bond</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Batman</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tony Stark</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Aragorn</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Gautama Buddha Founder of Buddhism</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Anton Chigurh &bull; -1 floor</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Ace Ventura</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Gabe Newell</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Yagami Light &bull; God of the new world, also known as justice</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tony Stark</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Tyler Durden second personality</li>
                <li><img src={Anakin} width="24px" height="24px" className="meet-people-list__avatar" alt=""/>Ernest Hemingway<span> &bull; last floor</span></li>
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
          <span className="new-meet-create__recommended-meeting-rooms-text">Recommended meeting room{true ? 's' : ''}</span>
          <div className="new-meet-create__recommended-meeting-rooms">
            <div className="new-meet-create__meet-room">Dark Tower</div>
          </div>
          <div className="invated-people">
            {people.map( el => (<div className="invated-people__participant">{el.name}</div>))}
          </div>
        </form>
      </div>
    )
  }
}

export default CreateNewMeetField;
