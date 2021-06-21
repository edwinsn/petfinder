import './assets/uploadPhotos.css'
import S3 from 'react-aws-s3'
import closeIcon from './assets/images/closeIcon.svg'
import { useState } from 'react'

const url = "https://0bgpfisqlk.execute-api.us-east-1.amazonaws.com/default/petfinderPhotosFunction"

const config = {
    bucketName: '',
    dirName: 'photos',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: ''
}

export let UploadPhoto = (props) => {

    const { file, closeWindow, show, setMiniature } = props
    const [newFile, setNewFile] = useState(undefined)
    const style = { display: show ? "flex" : "none" }

    let fileURL = file || newFile ? URL.createObjectURL(newFile ? newFile : file) : undefined

    return (
        <div
            style={style}
            className="uploadPhototsContainer">
            <form className="uploadPhotos"
                onSubmit={(e) => {
                    handleSubmmit(e, file)
                    setNewFile(undefined)
                    closeWindow()
                    setMiniature(fileURL)
                }}>
                <h2>Sube una imagen del animal</h2>
                <label alt="animals photo" >
                    <img src={fileURL} />
                    <input type="file" onChange={(ev) => { setNewFile(ev.target.files[0]) }} />
                </label>
                <img src={closeIcon} onClick={()=>{
                    closeWindow()
                    setNewFile(undefined)
                    }} className="close" />
                <input type="submit" value="" />
            </form>
        </div>)
}

const handleSubmmit = (e, file) => {
    e.preventDefault()
    fetch(url, {
        method:"POST",
        mode:"cors",
        body: JSON.stringify({key:"testing"})
    }).
    then((res)=> res.json()).
    then(res=>{

        let URL=JSON.parse(res.body).URL
        console.log(URL)
        console.log(res)
        fetch(URL,{
            method:"PUT",
            mode:"cors",
            body:file
        }).then(res=>console.log(res)).
        catch(err=>console.log(err))
    }).catch(err=>console.log(err))

    //const reactS3Client = new S3(config)
    /*reactS3Client.uploadFile(file, "test1").
        then((data) => { console.log(data) }).
        catch((err) => { console.log(err) })*/
}