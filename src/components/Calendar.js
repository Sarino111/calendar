import axios from 'axios';

import React, {useEffect, useState} from 'react'

// component
import CalendarDays from './CalendarDays'

// styles
import './calendar.scss'


const Calendar = (props) => {

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const [ holiday, setHoliday ] = useState([])
  const [ error, setError ] = useState(null)

  const [ interval, setInterval ] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [taskName, setTaskName] = useState([])
  const [taskStart, setTaskStart] = useState([])
  const [taskEnd, setTaskEnd] = useState([])  
  const [ date, setDate ] = useState( new Date() )

  // after click on date change mark of number
  const changeCurrentDay = (day, e) => {
    e.preventDefault()
    setDate( new Date(day.year, day.month, day.number) );
  }

  // after click btn forward move to next month
  const nextMonth = (e) => {
    e.preventDefault()

    setDate( new Date(date.getFullYear(), date.getMonth() +1 , date.getDate()) );
  }
  // after click btn back move to previous month
  const previousMonth = (e) => {
    e.preventDefault()

    setDate( new Date(date.getFullYear(), date.getMonth() -1 , date.getDate()) );
  }

  // handle data from Api
  const loadData = async () => {
      try {
      const response = await axios.get( `https://openholidaysapi.org/PublicHolidays?countryIsoCode=SK&languageIsoCode=SK&validFrom=2022-01-01&validTo=2023-12-31` )
      const query = response.data.map( items => extractData(items) )        
      const combinedArray = query.flatMap((element) => {
          return element.names.map((name) => {
            return { date: element.date, text: name.text };
          });
        });

      setHoliday(combinedArray)
      setError(null)
      } catch ( err ) {
      setError( 'err' )
      }
  }

  useEffect( () => {
      loadData()
  }, [])

  const extractData = ({
      startDate:  date,
      name:   names
  }) => ({ date, names })


  // After click save date
    const handleInterval = (newValue) => {
      setInterval((prevValues) => {
        if (prevValues.length === 2) {
        return setInterval([]);
      }

      return [...prevValues, newValue]
      
      });
    };

  // save after click to save btn
  const handleSave = (e) => {
    e.preventDefault()

  // Create an object to store the task data
    let taskData = {
        name: taskName,
        start: taskStart,
        end: taskEnd
    };

    setTableData([...tableData, taskData]);

  }

  const handleChangeTask = (e) => { 
    setTaskName(e.target.value)
  }  

  const handleChangeStart = (e) => {
    setTaskStart(e.target.value)
  }

  const handleChangeEnd = (e) => {
    setTaskEnd(e.target.value)
  }


  // template
  return (
    <div className='calendar'>
        <div className='calendar-header'>

            <button className="button-arrow" onClick={e => previousMonth(e)}>
              <span>
                back
                </span>
            </button>

            <h2>{months[ date.getMonth() ]} {date.getFullYear()}</h2>  

            <button className="button-arrow" onClick={e => nextMonth(e)}>
              <span >
                forward
                </span>
            </button>  

        </div>

        <div id="taskWindow" className="">
          <form onSubmit={e=>handleSave(e)} className="taskForm">
            <h2 className='post-task'>Add Task</h2>
            <input type="text" className="taskName" onChange={e=>handleChangeTask(e)} placeholder="Task Name"/>
            <div className='container-datum'>
              <input type="date" id="startDate" onChange={e => handleChangeStart(e)} placeholder="Start Date"/>
              <input type="date" id="endDate" onChange={e => handleChangeEnd(e)} placeholder="End Date"/>
            </div>
            <div className='container-btn-save'>
              <input 
                    className="button-save"
                    onClick={e=>handleSave(e)}
                    type="submit"
                    value="Save"
              />
            </div>
          </form>
        </div>

        <div className="calendar-body">
            <div className="table-header">
            {
                weekdays.map((weekday, index) => {
                return <div key={index} className="weekday"><p>{weekday}</p></div>
                })
            }
            </div>
            <CalendarDays 
                holidays= {holiday}
                intervals= {interval}
                tableData= {tableData}
                date= { date }
                onInterval= { handleInterval }
                onCurrentDay= { changeCurrentDay }
            />
        </div>
    </div>    
  )
}

export default Calendar