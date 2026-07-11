import axios from "axios";
import { FarmerProfileState,LoginForm,RegisterForm } from "../types/sidebarItems";

export const login = async (data:LoginForm) => {
  let resposne = await axios
    .post("/api/login",data)
    .then((response) => {
      console.log("Login Data:", response);
      return response.data;
    })
    .catch((error) => {
      return error.message;
    });
    return resposne
};
export const Register = async (data:RegisterForm) => {
  let resposne = await axios
    .post("/api/register",data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.message;
    });
    return resposne
};

export const getUserByToken = async(token:any) =>{
  let resposne = await axios.get("/api/user",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  ).then((resposne)=>{
    return resposne.data
  }).catch((error)=>{
    return error
  })
  return resposne
}
