import axios from "axios"
import { message } from "antd"
import { getAccessToken} from "./service";
// const baseUrl = "http://localhost:8080/api/"


export const config = {
    base_server : "http://localhost:8080/api/",
    image_path:"",
    version:1
}
export const request = (method="",url="",param={}) => {
    const access_token = getAccessToken();
    return axios({
        url:config.base_server + url,
        method : method,
        data : param,
        headers: {
            Authorization: `Bearer ${access_token}`,
          }
    }).then(res=>{
        return res
    }).catch(err=>{
        var status = err.response?.status
        if(status === 404){
            message.error("Route Not Found")
        }
        else if(status === 401){
            message.error("You don't has permission access this method!")
        }
        else if(status === 500){
            message.error("Internal error server")
        }else{
            message.error("Can not connect to server. Plase contact administration!")
        }
        return false
    })
}

// =======================================================

