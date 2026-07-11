"use client"

export const getTokenFromLocalStorage = () => {
    return localStorage.getItem("CurrentToken");
}