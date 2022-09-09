import React, {useState} from "react";
import styled from "styled-components";
import moment from "moment";

const DivWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  background-color: #1E1F21;
  color: #DCDDDD;
  padding: 16px;
  position: relative;
`;

const TextWrapper = styled('span')`
  font-size: 17px;
  
`;

const TitleWrapper = styled(TextWrapper)`
  font-weight: bold;
  margin-right: 8px;
  margin-left: 8px;
`;

const ButtonsWrapper = styled('div')`
  display: flex;
  align-items: center;
`;



const ButtonWrapper = styled('button')`
  border: unset;
  background-color: ${props => props.unPressed ? '#27282A' : '#565759'};
  border: 1px solid #565759;
  height: 20px;
  border-radius: 4px;
  color: ${props => props.unPressed ? '#a4a6a9' : '#E6E6E6'};
  outline: unset;
  cursor:pointer;
  &:not(:last-child){
    margin-right: 2px;
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TodayButton = styled(ButtonWrapper)`
	font-weight: bold;
`;

const OpenModal = styled('div')`
  height: 30px;
  width: 30px;
  background: #106cf6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
`;

export const Monitor = ({ today, prevHandler, todayHandler, nextHandler, openFormHandler, dayItem = moment(), changeMonth }) => {
    
    const [choosed, setChoosed ] = useState( {})

    const choosedDate = () => {

        const newDate = {
            ...choosed,
        }
        changeMonth(newDate)
    }

    return (
    <DivWrapper>
                <OpenModal 
                            onClick={() => openFormHandler('Create', null, dayItem)}
                        >
                    +
                </OpenModal>
                <div style={{display: 'flex', textAlign: 'center'}}>
                    <div style={{display: 'flex'}}>
                        <TitleWrapper>{today.format('MMMM')} </TitleWrapper>
                        <TextWrapper>{today.format('YYYY')}</TextWrapper>
                    </div>
                </div>
                <ButtonsWrapper>
                <ButtonWrapper onClick={prevHandler}> &lt; </ButtonWrapper>
                <TodayButton onClick={todayHandler}>Today</TodayButton>
                <ButtonWrapper onClick={nextHandler}> &gt; </ButtonWrapper>
                <input 
                    type="date" 
                    value={choosed}
                    onChange={(e) => choosedDate(setChoosed({...choosed, date: e.target.value})) }
                    >
                </input>
                </ButtonsWrapper>
            </DivWrapper>
    
    )
};

