import React, { useState } from 'react'
import logo from "./about.png"
import "./Home.scss"
import { ArrowRight } from "react-feather"
import { useNavigate } from "react-router-dom"
import hp from "../../components/Home/about.png"
import { useEffect } from 'react'
import { async } from '@firebase/util'
import { getAllProjects } from '../../firebase'
import ProjectModel from './ProjectModel/ProjectModel'
const Home = (props) => {
  const navigate = useNavigate();
  const isAuthenticate = props.auth ? true : false;
  const [projects,setProjects]=useState([]);
  const [showProjectModel,setProjectModel]=useState(false);
  const [porjectsDetail,setProjectDetail]=useState({});
  const handleclick = () => {
    if (isAuthenticate) navigate("/account")
    else navigate("./login")
  }
  const fetchdata=async()=>{
    const result = await getAllProjects();
    if(!result){
      return;
    }
    const tempProjects=[];
    result.forEach(val=>tempProjects.push({...val.data(),pid:val.id}))
    setProjects(tempProjects);
    
  }
  useEffect(()=>{
    fetchdata();
  },[])
  const handleClickcard=(project)=>{
    setProjectModel(true);
    setProjectDetail(project)

  }
  return (
    <div className='home'>
    {showProjectModel &&(<ProjectModel onClose={()=>setProjectModel(false)} details={porjectsDetail}/>)}
      <div className='home_container'>
        <div className='home_left'>
          <h2>Project keeper</h2>
          <p>One stop destination for all software development Projects</p>
          <button onClick={handleclick}>{isAuthenticate ? "Admin projects" : "Get Started"}{" "}<ArrowRight />{""}</button>
        </div>
        <div className='home_right'>
          <img src={logo} />
        </div>
      </div>
      <div className='project_body'>
        <h1>All Projects</h1>
        <div className='home_projects'>
        {
          projects.length>0?
           projects.map((item)=>(
            <div className='home_p' key={item.pid}>
            <div className='home_img'>
              <img src={item.thumbnail} alt="Project_thumbnail" onClick={()=>handleClickcard(item)}/>
            </div>
            <p className='home_title'>{item.project_title}</p>
          </div>
          ))
          :<h2>No Projects</h2>
        }
         

        </div>
      </div>
    </div>
  )
}

export default Home
