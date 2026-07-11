"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { getUser } from "../features/Auth/authSlice";
import { getUserByToken } from "../services/auth";

const GetUserComponent = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem("CurrentToken");

    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await getUserByToken(token);
        
        if (response) {
          dispatch(getUser(response));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [dispatch]);

  return null;
};

export default GetUserComponent;