import axios from "axios";
import moment from "moment";
import ReactDOM from 'react-dom';
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import Pagination from "next-pagination";
import ReactPaginate from "react-paginate";
// import { getCookie, deleteCookie } from 'cookies-next'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from "react-router-dom";

const UserList = () => {
    const navigate = useNavigate();
    function button(data) {
        localStorage.setItem('name', (data.name));
        localStorage.setItem('phoneNumber', (data.phoneNumber));
        localStorage.setItem('vendorId', (data._id));

        navigate('/Profile');
    }
    const [data1, setData1] = useState([])
    const options = {
        method: 'POST',
        url: 'https://node-graphql-five.vercel.app/graphql',
        headers: {
            'content-type': 'application/json'
        },
        data: {
            query: `{
                vendor(page:${1},perPage:${20}) {
                  vendorList {
                    updatedAt
                    phoneNumber
                    name
                    image
                    createdAt
                    _id
                  }
                  message
                  code
                }
              }`
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }
    const fetchUser = async () => {
        try {
            const data = await axios.request(options);
            if (data.data.data.vendor.code == 200) {
                setData1(data.data.data.vendor.vendorList)
            }
        } catch (err) {
            alert(err)
        }
    }
    const addUser = () => {
        navigate('/addUser')
    }
    const Image = () => {
        navigate('/image')
    }

    useEffect(() => {
        fetchUser();
    }, [])


    return (
        <>
            <section>
                <div class="d-flex justify-content-between align-items-center pageheading">
                    <div class="mr-4 mt-3">
                        <h2><strong>User List</strong></h2>
                    </div>
                    {/* <div>
                        <button type="button" style={{ height: "36px", width: "170px", backgroundColor: "blue", boxShadow: "0px 5px 4px 0px #ccc" }} class="btn btn-primary btn-success"
                            onClick={() => Image()}><i aria-hidden="true"></i><span
                                style={{ fontWeight: "700", paddingLeft: "10px" }}
                                data-toggle="modal">Add Image</span></button>
                    </div> */}
                    <div class="mt-3">
                        <button onClick={() => Image()} type="button" style={{ height: "36px", width: "170px", backgroundColor: "#1AB394", boxShadow: "0px 5px 4px 0px #ccc" }} class="btn btn-primary btn-success"><i
                            aria-hidden="true"></i><span style={{ fontWeight: "700", paddingLeft: "10px" }}
                                data-toggle="modal" data-target="#myModal5">Add Image</span></button>
                        <button type="button" style={{ height: "36px", width: "170px", backgroundColor: "red", boxShadow: "0px 5px 4px 0px #ccc" }} class="btn btn-primary btn-success"
                            onClick={() => logout()}><i aria-hidden="true"></i><span
                                style={{ fontWeight: "700", paddingLeft: "10px" }}
                                data-toggle="modal">Logout</span></button>
                    </div>
                </div>
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">phone Number</th>
                            <th scope="col">CreatedAt</th>
                            <th scope="col">UpdatedAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data1.map((data, index) => {
                            return (
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td onClick={() => button(data)}><h3 style={{ color: 'blue' }}>{data.name}</h3></td>
                                    <td>{data.phoneNumber ? data.phoneNumber : "phoneNumber"}</td>
                                    <td>20 Jan</td>
                                    <td>20 Jan</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <ToastContainer />

            </section >
        </>
    )
}
export default UserList
