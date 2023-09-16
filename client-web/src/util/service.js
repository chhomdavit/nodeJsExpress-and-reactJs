import dayjs from "dayjs"

export const Config = {
    pagination : 5,
    imagePath : "http://localhost/image_path/"
}

export const isEmptyOrNull = (value) => {
    if(value === "" || value == null || value === 'null' || value === undefined){
        return true;
    }
    return false;
}

export const formatDateForClient = (date) => {
    if(!isEmptyOrNull(date)){
        return dayjs(date).format("DD-MM-YYYY")
    }
    return null
}

export const getUser = () => {
    var user = localStorage.getItem("user")
    if(!isEmptyOrNull(user)){
        user = JSON.parse(user)
        return user
    }else{
        return null
    }
}

export const getPermission = () => {
    var permission = localStorage.getItem("permission")
    if(!isEmptyOrNull(permission)){
        permission = JSON.parse(permission)
        return permission
    }else{
        return null
    }
}

export const isPermission = (code_promission) => {
    const arrPremission = getPermission();
    if(arrPremission){
        if(arrPremission.includes(code_promission)){
            return true //allow permission
        }
        return false //on permission
    }else{
        return false //on permission
    }
}

export const getAccessToken = () => {
    var access_token = localStorage.getItem("access_token")
    if(!isEmptyOrNull(access_token)){
        return access_token;
    }else{
        return null
    }
}

export const getRefreshToken = () => {
    var refresh_token = localStorage.getItem("refresh_token")
    if(!isEmptyOrNull(refresh_token)){
        refresh_token = JSON.parse(refresh_token)
        return refresh_token
    }else{
        return null
    }
} 