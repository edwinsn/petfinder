import './assets/uploadPhotos.css'
import closeIcon from './assets/images/closeIcon.svg'
import { useState } from 'react'


export let UploadPhoto = (props) => {

    const { file, closeWindow, show, setMiniature,saveFile } = props
    const style = { display: show ? "flex" : "none" }
    const [newFile, setNewFile] = useState()
    let fileURL =file? URL.createObjectURL(newFile? newFile:file):undefined

    return (
        <div
            
            style={style}
            className="uploadPhototsContainer">
            <form className="uploadPhotos"
                onSubmit={(e) => {
                    handleSubmmit(e, newFile?newFile:file, saveFile)
                    closeWindow()
                    setMiniature(fileURL)
                }}>
                <h2>Sube una imagen del animal</h2>

                <label alt="animals photo" >
                    <img src={fileURL} alt={file?file.name:undefined} title={file?file.name:undefined} />
                    <input type="file" name="img" accept="image/*" onChange={(ev) => {
                         saveFile(ev.target.files[0])
                         setNewFile(ev.target.files[0])
                     }} />
                </label>
                <img src={closeIcon} onClick={() => {
                    closeWindow()
                    setNewFile(undefined)
                }} className="close" />
                <input type="submit" value="" />
            </form>
        </div>)
}

const handleSubmmit = (e, file, saveFile) => {
    e.preventDefault()
    saveFile(file)
    
}