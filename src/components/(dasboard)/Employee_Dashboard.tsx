import React from 'react'
import Header from '../(dasboard_component)/Header'
import Task_Number from '../(dasboard_component)/Task_Number'
import TaskList from '../(TaskList)/TaskList'


function Employee_Dashboard() {
  return (
    <div className='bg-[#1C1C1C]'>
        <Header />
        <Task_Number />
        <TaskList />
    </div>
  )
}

export default Employee_Dashboard