import React from 'react'
import Navigation from './navigation'
import rent from '../css/rentList.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import Footer from './footer'

const SaleList = () => {
    const navigate = useNavigate()
    const [rentData, setData] = useState([])
    const [error, setError] = useState("")
    const { isAuthenticated, user, getAccessTokenSilently,isLoading } = useAuth0()

    useEffect(() => {
        setError('')
        const getSaleData = async () => {
            const token = isAuthenticated ? await getAccessTokenSilently() : localStorage.getItem('token')
            // console.log("ls", token);
            if (token) {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/sale/data`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                })
                setData(res.data)
            } else {
                setError("Please Login First")
            }
        }
        getSaleData()
    }, [isAuthenticated])

    if(isLoading){
        return <div className={rent.loading}>Loading...</div>
    }
    // console.log(isAuthenticated)
    // console.log(user)

    return (
        <div className={rent.main}>
            {error ? <div className={rent.error}>
            <h1 ><lord-icon
                src="https://cdn.lordicon.com/usownftb.json"
                trigger="hover"
                colors="primary:#03254c,secondary:#66eece"
                style={{ width: "200px", height: "200px" }}>
            </lord-icon></h1>
            <h1>{error}</h1>
            </div> :
                <div>
                    <Navigation />
                    <div className={rent.body}>
                        {/* {user.name && 
                    <div className={rent.userName}>
                        <span >Welcome... </span> 
                        <span className={rent.usname}> {user.nickname}</span>
                    </div>} */}
                        <h1 className={rent.heading}>Choose a vehicle for buy</h1>
                        <div className={rent.container}>
                            {rentData.map((data) => {
                                return (
                                    <div key={data._id} className={rent.box}>
                                        <div>
                                            {data.vehicleImg.length > 0 && (
                                                <img src={`${import.meta.env.VITE_SERVER_LINK}/${data.vehicleImg[0].replace(/\\/g, '/')}`} alt="Vehicle Image" className={rent.vehicleImg} />
                                            )}
                                        </div>
                                        <div className={rent.info}>
                                            <h3 className={rent.key}>Vehicle no. : <span className={rent.value}>{data.registration}</span></h3>
                                            <h1 className={rent.key}>Price/hr : Rs <span className={rent.value}>{data.price}</span></h1>
                                            <h3 className={rent.key}>Vehicle company : <span className={rent.value}>{data.vehicle}</span></h3>
                                            <h3 className={rent.key}>Model : <span className={rent.value}>{data.model}</span></h3>
                                            <h3 className={rent.key}>Available at: <span className={rent.value}>{data.address}</span></h3>
                                            <h3 className={rent.key}>Contact no. : <span className={rent.value}>{data.contact}</span></h3>
                                            <button className={rent.bookbtn} onClick={() => navigate(`/bookForSale/${data._id}`)}>Book now</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Footer />
                </div>
            }
        </div>
    )
}

export default SaleList
