import React, { useEffect } from 'react'
import "./ProjectModel.scss"
import Model from "../../Model/Model"
import hp from "../../Home/about.png"
import { Link } from "react-router-dom"

import { GitHub, Paperclip } from 'react-feather'

const ProjectModel = (props) => {
  const details = props.details;

  return (
    <Model onClose={() => (props.onClose ? props.onClose() : "")}>

      <div className='card'> <h2>Project details</h2>
        <div className='card_container'>
          <div className='card_left'>
            <img src={details.thumbnail} alt='Thumnail' />
            <div className='card_links'>
              <Link to={`${details.github_link}`} target="_blank">
                <GitHub />
              </Link>
              {
                details.deployed_link ? (
                  <Link to={`${details.deployed_link}`} target="_blank">
                    <Paperclip />
                  </Link>
                ) : ""
              }
            </div>
          </div>
          <div className='card_right'>
            <p>{details.project_title}</p>
            <span>{details.project_overview}</span>
            <ul>
            {
              details.points.map((item)=>(
              <li key={item}>{item}</li>

              ))
            }
            
            </ul>
          </div>

        </div>
      </div>
    </Model>
  )
}

export default ProjectModel
