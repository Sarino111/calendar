import React from 'react'


function CalendarDays(props) {


  const {date, holidays, tableData, onCurrentDay}  = props

  let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  let weekdayOfFirstDay = firstDayOfMonth.getDay();
  let currentDate = [];

  // Create calendar
  for (let day = 0; day < 42; day++) {
      if (day === 0 && weekdayOfFirstDay === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
      } else if (day === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
      } else {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
      }
  
      let calendarDate = {
        currentMonth: (firstDayOfMonth.getMonth() === date.getMonth()),
        date: (new Date(firstDayOfMonth)),
        month: firstDayOfMonth.getMonth().toString().padStart(2, '0'),
        number: firstDayOfMonth.getDate().toString().padStart(2, '0'),
        selected: (firstDayOfMonth.toDateString() === date.toDateString()),                      
        year: firstDayOfMonth.getFullYear(),
        format: `${firstDayOfMonth.getFullYear()}-${(firstDayOfMonth.getMonth() +1).toString().padStart(2, '0') }-${(firstDayOfMonth).getDate().toString().padStart(2, '0')}`
      }
      currentDate.push(calendarDate);
  }

  // set holidays to calendar
  const compare = (day) => {
    const holy = holidays.map( h => (h.date === day) ? <span className='dot'><p className='text'>{h.text}</p></span> : '')

    return holy
  }

  // set task to calendar
  const task = (day) => {      
    const markStart = tableData.map( d => (d.start === day) ? <span className='mark-dot'></span> : [])
    const markEnd = tableData.map( d => (d.start <= day && d.end >= day) ? <span className='mark'></span> : [])
    const task = tableData.map( d => d.start === day ? <p className='task'>{d.name}</p> : [])

    return [task, markStart, markEnd]
  }

  // template
  return (
    <div className="table-content">
      {currentDate.map((day, index) => {                       
      return (
        <div key={day.format} 
              className={"calendar-day" + (day.currentMonth ? " current " : " ") + 
              (day.selected ? "selected " : " ") + (day.intervalOne ? " intOne " : " ") +
              (day.interval ? " int " : " ") + (day.format)} 
              onClick={(e) => onCurrentDay(day, e)}               
        > 
          <p>{day.number}</p>          
          {compare(day.format)}
          {task(day.format)}
        </div>   
      )
    })
  }

  </div>
  )    
}
  
export default CalendarDays;