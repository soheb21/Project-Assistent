import React from 'react'
import "./Model.scss"
const Model = (props) => {
  return (
    <div className='model_container'
    onClick={()=>(props.onClose()?props.onClose():'')}
    >
      <div className='inner'
      onClick={(e)=>e.stopPropagation()} //bcoz JS m bubling hota hai isliye ye stop.. wali fun likha hai
      >
        {props.children}
      </div>
    </div>
  )
}

export default Model
