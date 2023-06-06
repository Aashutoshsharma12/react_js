import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from 'aws-sdk';

// import { NextRequest,NextResponse } from "next/server";
// import Cookies from 'cookies'
// import cookieCutter from 'cookie-cutter'
// import { getCookie } from 'cookies-next'
import { toast, ToastContainer } from 'react-toastify';
import { Not_allowedSpace } from "../../helper/validation";
import { editProfile } from "../../graphql/Mutation";
import { useMutation, useQuery } from "@apollo/client";
import { upload } from "@testing-library/user-event/dist/upload";

const Image = () => {
    const navigate = useNavigate();

    const [time, setTime] = useState();
    const [imageData, setImageData] = useState(null);
    const [file1, setFile] = useState();
    const [ImageKey, setImageKey] = useState('');
    const [pre_signedUrl, setPre_signedUrl] = useState('')
    const [url,setData] = useState(true)
    var formData = new FormData()
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageData(file)
        formData.append('files', file)
        axios
            .post('https://uploadimage-on-s3-node.onrender.com/uploadImage', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                setImageKey(res.data.imageUrl.Key)
                setData(false)
            })
            .catch((err) => {
                alert(err)
                console.log(err);
            });
    }
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "time") {
            setTime(value);
        }
    }
    const getpre_signedUrl = async (e) => {
        e.preventDefault();
        try {
            const data = await toast.promise(axios({
                method: 'post',
                url: 'https://uploadimage-on-s3-node.onrender.com/pre_signedUrl',
                data: {
                    Key: ImageKey, //Image Name
                    expiredTime: Number(time) ? Number(time) :15 // Expiration time in seconds (e.g., 1 hour)
                }
            }), {
                pending: "Promise is pending",
                success: "Image uploades successfully",
                error: "error"
            });
            if(data.data.data){
                setPre_signedUrl(data.data.data)
                setData(true)
            } else {
                alert(`${data.data.message.code}:Please select Image`)
            }
        } catch (err) {
            alert(err.message)
        }

    }

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    return (
        <>
            <div class="row">
                <div class="d-flex justify-content-between align-items-center pageheading">
                    <div class="mr-4 mt-3">
                        <h2><strong>Get Pre_signed Image URl </strong></h2>
                    </div>
                    <div class="mt-3">

                        <button type="button" style={{ height: "36px", width: "170px", backgroundColor: "red", boxShadow: "0px 5px 4px 0px #ccc" }} class="btn btn-primary btn-success"
                            onClick={() => logout()}><i aria-hidden="true"></i><span
                                style={{ fontWeight: "700", paddingLeft: "10px" }}
                                data-toggle="modal">Logout</span></button>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="loginscreen animated fadeInDown loginPage">
                        <div class="form-group position-relative">
                            <input type="file" onChange={handleFileChange} />
                            {imageData && <img src={URL.createObjectURL(imageData)} alt="Selected" style={{height:"200px",width
                        :"200px",marginTop:"-49px"}}/>}
                        </div>
                        <div class="form-group position-relative">
                            <label for="exampleInputPassword1"><h6>Expires Time(Default expire time 15 minutes)</h6></label>
                            <input  style={{marginTop:"3px"}} type="name" class="form-control" placeholder="Enter expired time in second" id="time" name="time" value={time} onChange={(e) => handleInputChange(e)} required />
                        </div>
                        <div class="form-group position-relative">
                            <label for="exampleInputPassword1"><h6>Pre_signed Url</h6></label>
                            <input  style={{marginTop:"3px"}} type="url" class="form-control" id="pre_signedUrl" name="pre_signedUrl" value={pre_signedUrl} readOnly />
                            {pre_signedUrl && <img src={pre_signedUrl} alt="Selected" style={{height:"200px",width:"200px",marginTop:"-30px"}} />}

                        </div>
                        <button disabled={url} class="btn block full-width m-b" id="btnId" onClick={(e) => getpre_signedUrl(e)} >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default Image
