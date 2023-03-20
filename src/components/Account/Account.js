import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom';

import { Camera, Edit2, GitHub, LogOut, Trash, Linkedin, Paperclip } from 'react-feather'
import "./Account.scss"
import user_img from "../Account/user.jpeg"
import Inputs from '../Inputs/Inputs'
import { signOut } from 'firebase/auth'
import { auth, deleteProject, getAllProjects, getUserProject, updateUserDB, uploadeAccountimgs } from '../../firebase'
import Model from '../Model/Model';
import ProjectForm from './ProjectForm/ProjectForm';
const Account = (props) => {
    const userDetail = props.userDe;
    // console.log(userDetail);
    const isAuthenticate = props.auth;
    const navigate = useNavigate();
    const imagePicker = useRef();
    const [uploadImg, setUploadImg] = useState();
    const [showProgress, setShowProgress] = useState(0);
    const [showErr, setShowErr] = useState("");
    const [showProjectForm, setProjectForm] = useState(false);
    const [projectLoader, setProjectLoader] = useState(false);
    const [projectsA, setProjectsA] = useState([]);
    const [isEditProject, setIsEditProject] = useState({});
    const [openIsEdit, setOpenISEdit] = useState(false);

    const [userProfileValues, setUserProfileValues] = useState({
        name: userDetail.name || "",
        project_title: userDetail.project_title || "",
        github_link: userDetail.github_link || "",
        linkdin_link: userDetail.linkdin_link || "",
    })

    const imagePickerhandler = () => {
        imagePicker.current.click();
    }
    const imageChangeHandler = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        uploadeAccountimgs(file,
            (progress) => { setShowProgress(progress) },
            (url) => {
                setUploadImg(url);
                updateProfileImageToDatabase(url)
                setShowProgress(0)
            },
            (err) => setShowErr(err),
        )
    }
    
  const updateProfileImageToDatabase = (url) => {
    updateUserDB(
      { ...userProfileValues, profileImage: url },
      userDetail.uid
    );
  };

    const logoutHandler = async () => {
        await signOut(auth);
    }
    const saveDetailsintoDB = async () => {
        if (!userProfileValues.name || !userProfileValues.project_title) {
            setShowErr("Name and Title field requird");
            return;
        }
        await updateUserDB({ ...userProfileValues }, userDetail.uid);
        alert("Your Details Save Successfully");
    }
    const fetchAllProjects = async () => {
        const result = await getUserProject(userDetail.uid)
        if (!result) {
            setProjectLoader(true);
            return;
        }
        setProjectLoader(true);
        let tempProjects = []
        result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }))
        setProjectsA(tempProjects);
        console.log("=>:", projectsA)
    }


    const handelEditClick = (project) => {
        setOpenISEdit(true);
        setIsEditProject(project);
        setProjectForm(true)
    }

    const handleDeletion = async (pid) => {
        await deleteProject(pid);
        fetchAllProjects();
    };
    useEffect(() => {
        fetchAllProjects();
    }, [])

    return isAuthenticate ? (
        <div className='account_container'>
            {showProjectForm && <ProjectForm isEdit={openIsEdit} default={isEditProject} onSubmission={fetchAllProjects} onClose={() => setProjectForm(false)} uid={userDetail.uid} />}
            <div className='acc_header'>
                <h1 onClick={() => navigate("/")}>Welcome <span>{userDetail.name}</span></h1>
                <div className='logout_con' onClick={logoutHandler}><LogOut /> Logout</div>
            </div>
            <div className='acc_info'>
                <div className='acc_left'>
                    <h2>Your Profile</h2>
                    <div className='user_img'>
                        <input ref={imagePicker} type="file" style={{ display: "none" }} onChange={imageChangeHandler} />
                        <img onClick={imagePickerhandler} src={uploadImg||user_img}  alt='Profile' />
                        <span onClick={imagePickerhandler}><Camera /></span>
                        {showProgress === 100 &&
                            (<h3>{showProgress}% uploaded</h3>)
                        }

                    </div>

                </div>
                <div className='acc_right'>
                    <Inputs islabel={"Name"} placeholder="Enter Your Name"
                        value={userDetail.name}
                        onChange={(e) => setUserProfileValues((prev) => ({ ...prev,name: e.target.value }))} 
                    />
                    <Inputs islabel={"Title"} placeholder="Enter Your Title"
                        value={userDetail.project_title}
                        onChange={(e) => setUserProfileValues((prev) => ({ ...prev, project_title: e.target.value }))} />

                    <Inputs islabel={"Github"} placeholder="Enter Your Github"
                        value={userDetail.github_link}
                        onChange={(e) => setUserProfileValues((prev) => ({ ...prev, github_link: e.target.value }))} />
                    <Inputs islabel={"Linkdin"} placeholder="Enter Your Linkdin"
                        value={userDetail.linkdin_link}
                        onChange={(e) => setUserProfileValues((prev) => ({ ...prev, linkdin_link: e.target.value }))} />
                    <span> <button onClick={saveDetailsintoDB}>Save Details</button>
                        {showErr && (<h3 style={{ color: "red", margin: "1rem" }}>{showErr}</h3>)}</span>
                </div>

            </div>


            <hr />
            <div className='project_container'>
                <div className='project_header'>
                    <h1>Your Projects</h1>
                    <button onClick={() => setProjectForm(true)}>Add Projects</button>
                </div>
                <div className='project_info'>
                    {projectLoader ?
                        (
                            projectsA.length > 0 ? (
                                projectsA.map((item, index) => (
                                    <div className='project_box' key={index}>
                                        <h3>{item.project_title}</h3>
                                        <span>
                                            <Edit2 onClick={() => handelEditClick(item)} />
                                            <Trash onClick={() => handleDeletion(item.pid)} />
                                            <Link to={`${item.github_link}`} target="_blank">
                                                <GitHub />
                                            </Link>
                                            {item.deployed_link ?
                                                (
                                                    <Link to={`${item.deployed_link}`} target="_blank">
                                                        <Paperclip />
                                                    </Link>) : (
                                                    ""
                                                )}


                                        </span>

                                    </div>
                                ))
                            ) : (<p>No Projects found</p>)
                        ) : (
                            <h1>Wait...</h1>
                        )}

                </div>

            </div>
        </div>
    ) : (
        <Navigate to="/" />
    )
}

export default Account
