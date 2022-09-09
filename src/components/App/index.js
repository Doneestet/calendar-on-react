import moment from "moment";
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { ButtonsWrapper, ButtonWrapper, EventBody, EventTitle } from "../../containers/StyledComponents";
import { DISPLAY_MODE_MONTH } from "../../helpers/constants";
import { CalendarGrid } from "../CalendarGrid";
import { Monitor } from "../Monitor";
import { Title } from "../Title";

const ShadowWrapper = styled('div')`
  min-width: 850px;
  height: 702px;
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 8px;
  overflow:hidden;
  box-shadow: 0 0 0 1px #1A1A1A, 0 8px 20px 6px #888;
  display: flex;
  flex-direction: column;
`;

const FormPositionWrapper = styled('div')`
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled(ShadowWrapper)`
  width: 340px;
  min-width: 340px;
  height: 200px;
  background-color: #1E1F21;
  color: #DDDDDD;
  box-shadow:unset;
`;

const url = "https://calendar-ios-server.herokuapp.com";
const totalDays = 42;
const defaultEvent = {
  title: '',
  description: '',
  date: moment().format('X')
}
function App() {

  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE_MONTH);
  const [today, setToday] = useState(moment())
  const startDay = today.clone().startOf('month').startOf('week');

  // window.moment = moment;

  const prevHandler = () => setToday(prev => prev.clone().subtract(1, displayMode));
  const todayHandler = () => setToday(moment())
  const nextHandler = () => setToday(prev => prev.clone().add(1, displayMode));
  const changeMonth = (newDate) => setToday(prev => moment(newDate.date));


  const [method, setMethod] = useState(null)
  const [isShowForm, setShowForm] = useState(false);
  const [event, setEvent] = useState(null);

  const [events, setEvents] = useState([]);
  const startDayQuery = startDay.clone().format('X');


  const endDayQuery = startDay.clone().add(totalDays,'days').format('X');
  useEffect(() => {
    fetch(`${url}/events?date_gte=${startDayQuery}&date_lte=${endDayQuery}`)
      .then(res => res.json())
      .then(res => setEvents(res));
  }, [today]);

  const openFormHandler = (methodName, eventForUpdate, dayItem ) => {
    setEvent(eventForUpdate || {...defaultEvent, date: dayItem.format('X'), dateOfCreating: moment().format('YYYY-MM-DD, h:mm:ss a') }); // todo
    setMethod(methodName);
  }

  const openModalFormHandler = (methodName, eventForUpdate, dayItem) => {
    console.log('onClick',methodName);
    setShowForm(true);
    openFormHandler(methodName, eventForUpdate, dayItem);
  }

  const cancelButtonHandler = () => {
    setShowForm(false);
    setEvent(null);
  }

  const changeEventHandler = (text, field) => {
    setEvent(prevState => ({
        ...prevState,
        [field]: text,
    }))
    
  }

  const eventFetchHandler = () => {
    const fetchUrl = method === 'Update' ? `${url}/events/${event.id}` : `${url}/events`;
    const httpMethod = method === 'Update' ? 'PATCH' : 'POST';
    

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if(method === 'Update') {
          setEvents(prevState => prevState.map(eventEl => eventEl.id === res.id ? {...res, dateOfUpdating: moment().format('YYYY-MM-DD, h:mm:ss a')} : eventEl))
        } else {
          setEvents(prevState => [...prevState, res]);
        }
        cancelButtonHandler()
      })
  }

  const removeEventHandler = () => {
    const fetchUrl = `${url}/events/${event.id}`;
    const httpMethod = 'DELETE';

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setEvents(prevState => prevState.filter(eventEl => eventEl.id !== event.id))
        cancelButtonHandler()
      })
  }
  return (
    <>
      {
        isShowForm ? (
          <FormPositionWrapper onClick={cancelButtonHandler}>
            <FormWrapper onClick={e => e.stopPropagation()}>
              <EventTitle
                value={event.title}
                onChange={e => changeEventHandler(e.target.value, 'title')}
                placeholder="Title"
              />
              <EventBody
                value={event.description}
                onChange={e => changeEventHandler(e.target.value, 'description')}
                placeholder="Description"
              />
              <div style={{display: 'flex' }}>
                <div style={{display: 'flex' ,padding: 5}}>
                    <input 
                        type='date' 
                        value={event.date} 
                        onChange={e => changeEventHandler(moment(e.target.value).format('X'), 'date')}>
                    </input>
                </div>
                
                <ButtonsWrapper>
                
                    <ButtonWrapper onClick={cancelButtonHandler} >Cancel</ButtonWrapper>
                    <ButtonWrapper onClick={eventFetchHandler}>{method}</ButtonWrapper>
                    {
                        method === 'Update' ? (
                            <ButtonWrapper danger onClick={removeEventHandler}>Remove</ButtonWrapper>
                            ) : null
                        }
                </ButtonsWrapper>
                </div>
                <div style={{padding: 5, marginTop: 5, fontSize: 13}}>
                    <div>Created at: {event.dateOfCreating}  </div>
                    <div>Updated at: {event.dateOfUpdating}  </div>
                </div>
                        
            </FormWrapper>
          </FormPositionWrapper>
        ) : null
      }
      <ShadowWrapper>
        <Title />
        <Monitor
          today={today}
          prevHandler={prevHandler}
          todayHandler={todayHandler}
          nextHandler={nextHandler}
          openFormHandler={openModalFormHandler} 
          setDisplayMode={setDisplayMode}
          displayMode={displayMode}
          changeMonth={changeMonth}
        //   changeMonth={ss}
        />
        <CalendarGrid 
            startDay={startDay} 
            today={today} 
            totalDays={totalDays} 
            events={events} 
            openFormHandler={openModalFormHandler}
        />

      </ShadowWrapper>
    </>
  );
}

export default App;
