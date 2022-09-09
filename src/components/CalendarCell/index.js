import React from "react";
import styled from "styled-components";
import { CellWrapper, RowInCell } from "../../containers/StyledComponents";
import { isCurrentDay, isSelectedMonth } from "../../helpers";

const DayWrapper = styled.div`
	height: 31px;
	width: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
	cursor: pointer;
;`

const CurrentDay = styled('div')`
  height: 100%;
  width: 100%;
  background: #106cf6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShowDayWrapper = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

const EventListWrapper = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const EventListItemWrapper = styled('li')`
	padding-left: 2px;
	padding-right: 2px;
	margin-bottom: 2px;
	display: flex;
`;

const EventItemWrapper = styled('button')`
	position: relative;
	flex-grow: 1;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 114px;
	border: unset;
	color: #DDDDDD;
	cursor: pointer;
	margin: 0;
	padding: 0;
	text-align: left;
	background-color: #5d5f63;
	border: 1px solid #5d5f63;
	border-radius: 2px;
`;

export const CalendarCell = ({dayItem, today, openFormHandler, events}) => {

  return (
    <CellWrapper
      isWeekday={dayItem.day() === 6 || dayItem.day() === 0}
      key={dayItem.unix()}
      isSelectedMonth={isSelectedMonth(dayItem,today)}
    >
      <RowInCell justifyContent={'flex-end'}>
        <ShowDayWrapper>
          <DayWrapper onClick={() => openFormHandler('Create', null, dayItem)}>
            {
              isCurrentDay(dayItem) ? (
                <CurrentDay>{dayItem.format('D')}</CurrentDay>
              ) : (
                dayItem.format('D')
              )
            }
          </DayWrapper>
        </ShowDayWrapper>
        <EventListWrapper>
          {
            events
              .slice(0,2)
              .map(event => (
                <EventListItemWrapper key={event.id}>
                  <EventItemWrapper onClick={() => openFormHandler('Update', event)} >
                    {event.title}
                  </EventItemWrapper>
                </EventListItemWrapper>
              ))
          }
        </EventListWrapper>
      </RowInCell>
    </CellWrapper>
  )
}