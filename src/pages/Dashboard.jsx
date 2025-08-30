import axios from 'axios'
import { useEffect } from 'react'


const Dashboard = () => {
    useEffect(() => {
      axios.get(url, {
        headers : {
              'Authourization':'Beares:${token}',
              "Content-Type" : "application/json",
              "Accept" :   "application/json"
        }
      })
    }, [])
    
  return (
    <div>
        <h1>Hi {} welcome to dashboard</h1>
    </div>
  )
}

export default Dashboard