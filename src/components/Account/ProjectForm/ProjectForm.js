import React, { useRef, useState } from 'react'
import Inputs from '../../Inputs/Inputs'
import Model from '../../Model/Model'
import "./ProjectForm.scss"
import project_icon from "../ProjectForm/gallary.jpeg"
import { X } from 'react-feather'
import { AddUserProject, updateDbInProjects, uploadeAccountimgs } from "../../../firebase"
const ProjectForm = (props) => {
    const imagePicker = useRef();
    const isEdit = props.isEdit ? true : false;
    const defaults = props.default;
    const [showProgress, setShowProgress] = useState(0);
    const [showErr, setShowErr] = useState("");

    const [ProjectFormValues, setProjectFormValues] = useState({
        thumbnail: defaults?.thumbnail || "",
        project_title: defaults?.project_title || "",
        project_overview: defaults?.project_overview || "",
        github_link: defaults?.github_link || "",
        deployed_link: defaults?.deployed_link || "",
        points: defaults?.points || ["", ""],
    })
    const imagePickerhandler = () => {
        imagePicker.current.click();
    }
    const handlePointChange = (value, index) => {
        const tempPoints = [...ProjectFormValues.points];
        tempPoints[index] = value
        setProjectFormValues((prev) => ({ ...prev, points: tempPoints }))
    }
    const handleAddPoints = () => {
        if (ProjectFormValues.points.length > 4) return;
        setProjectFormValues((prev) => ({ ...prev, points: [...ProjectFormValues.points, ""] }))
    }
    const handleRemovePoints = (index) => {
        const delPoints = [...ProjectFormValues.points];
        delPoints.splice(index, 1)
        setProjectFormValues((prev) => ({ ...prev, points: delPoints }))
    }
    const handleImg = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        uploadeAccountimgs(file,
            (progress) => { setShowProgress(progress) },
            (url) => {
                setProjectFormValues((prev) => ({ ...prev, thumbnail: url }))
                setShowProgress(0)
            },
            (err) => setShowErr(err),
        )
    }
    const validateForm = () => {
        let isValid = true;
        if (!ProjectFormValues.thumbnail) { isValid = false; setShowErr("Thumnail Required..") }
        else if (!ProjectFormValues.github_link) { isValid = false; setShowErr("Repo link Required..") }
        else if (!ProjectFormValues.project_title) { isValid = false; setShowErr("Project title Required..") }
        else if (!ProjectFormValues.project_overview) { isValid = false; setShowErr("Project OverView Required..") }
        else { setShowErr("") }
        return isValid;
    }
    const handelSubmission = async () => {
        if (!validateForm()) return;
        if(isEdit)await updateDbInProjects({ ...ProjectFormValues,refUser: props.uid },defaults.pid);
        else await  AddUserProject({ ...ProjectFormValues, refUser: props.uid })
        if (props.onSubmission) props.onSubmission(); // ye onSubmission function page ko refresh kr dega ki jab project add krenge
        if (props.onClose) props.onClose();
    }
    return (
        <Model onClose={() => (props.onClose ? props.onClose() : "")}>
            <div className='container'>
                <div className='inner'>
                    <div className='left'>
                        <div className='image'>
                            <input ref={imagePicker} type="file" style={{ display: "none" }} onChange={handleImg} />
                            <img src={ProjectFormValues.thumbnail || project_icon} onClick={imagePickerhandler} alt="Thumbnail" />
                            {showProgress === 100 && <p><span>{showProgress}%</span> upload</p>}

                        </div>
                        <Inputs islabel="Github" placeholder={`Github link `} value={ProjectFormValues.github_link} onChange={(e) => setProjectFormValues((prev) => ({ ...prev, github_link: e.target.value }))} />
                        <Inputs islabel="Deployed link" placeholder={`Deplyed link..`} value={ProjectFormValues.deployed_link} onChange={(e) => setProjectFormValues((prev) => ({ ...prev, deployed_link: e.target.value }))} />
                    </div>
                    <div className='right'>
                        <Inputs islabel="Project title" placeholder="Enter your Project title" value={ProjectFormValues.project_title} onChange={(e) => setProjectFormValues((prev) => ({ ...prev, project_title: e.target.value }))} />
                        <Inputs islabel="Project Overview" placeholder="Enter your Project Overview" value={ProjectFormValues.project_overview} onChange={(e) => setProjectFormValues((prev) => ({ ...prev, project_overview: e.target.value }))} />
                        <div className='description'>
                            <div className='top'>
                                <p className='title'>Project Description</p>
                                <p className='link' onClick={handleAddPoints}>Add point+</p>
                            </div>
                            <div className='project_inputs'>
                                {
                                    ProjectFormValues.points.map((item, index) => (
                                        <div className='ip' key={index}>
                                            <Inputs key={index} placeholder="Description..." value={item} onChange={(e) => handlePointChange(e.target.value, index)} />
                                            {index > 1 && <X onClick={() => handleRemovePoints(index)} />}
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <h3>{showErr}</h3>
                <div className='footer'>
                    <p className='cancel' onClick={() => (props.onClose() ? props.onClose() : "")}>Cancel</p>
                    <button className='button' onClick={handelSubmission}>Submit</button>
                </div>

            </div>
        </Model>
    )
}

export default ProjectForm
