import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'

import api from '../api/api'
import { useParams, useNavigate } from 'react-router-dom'

import styles from "./styles/dash.module.css"
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { url } from "../api/api"

function DashBoard() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/users/${username}/`)
      if (response.status === 200){
        setProfile(response.data)
      } else {
        alert("Something went wrong")
      }
    }

    if(!loading){
      fetchData();
    }

  }, [username, loading])
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <FaArrowAltCircleLeft 
          className={styles.backIcon}
          onClick={()=> navigate(-1)}
        />

        <div className={styles.userPhoto}>
          <img src={profile?.photo} alt='user photo'/>
        </div>
        <span className={styles.username}>
            <span>{"@ "+profile?.username}</span>
        </span>
        {/* <span className={styles.bio}>
          {" " + profile?.bio}
        </span> */}
      </div>
      <div className={styles.results}>
        <span className={styles.name}>
          {profile?.first_name + " " + profile?.last_name}
        </span>

        <div>
          Avarage quiz percantage: {profile?.average_quiz_percentage}
        </div>
      </div>
      <div className={styles.follow}>

      </div>
    </div>
  )
}

export default DashBoard