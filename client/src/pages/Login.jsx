import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast, Toaster } from "react-hot-toast";

export default function LoginPage() {

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [passwordVisible,setPasswordVisible]=useState(false)

const navigate=useNavigate()

useEffect(()=>{

const unsubscribe=onAuthStateChanged(auth,(user)=>{

if(user){
navigate(user.email.toLowerCase()==="admin@campusfind.com"?"/admin":"/Home")
}

})

return()=>unsubscribe()

},[navigate])


const handleLogin=async(e)=>{

e.preventDefault()

try{

const userCredential=await signInWithEmailAndPassword(auth,email,password)

const token=await userCredential.user.getIdToken()

localStorage.setItem("token",token)

toast.success("Login successful!")

navigate(userCredential.user.email.toLowerCase()==="admin@campusfind.com"?"/admin":"/Home")

}
catch{

toast.error("Invalid email or password")

}

}


const handleGoogleLogin=async()=>{

try{

const userCredential=await signInWithPopup(auth,googleProvider)

const token=await userCredential.user.getIdToken()

localStorage.setItem("token",token)

toast.success("Logged in with Google!")

navigate("/Home")

}
catch{

toast.error("Google login failed")

}

}


return(

<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-6">

<Toaster position="top-center"/>

<div className="grid md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full bg-white">

{/* LEFT PANEL */}

<div className="hidden md:flex flex-col justify-center items-center text-center p-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">

<h2 className="text-3xl font-bold mb-4">

Reclaim

</h2>

<p className="opacity-90">

A smart lost & found platform designed for college campuses.

Log in to report lost items or help return found ones.

</p>

</div>


{/* RIGHT PANEL */}

<div className="p-10">

<h3 className="text-2xl font-semibold text-emerald-600 mb-6">

Student Login

</h3>

<form onSubmit={handleLogin}>

<div className="mb-4">

<label className="text-sm text-gray-600">

College Email

</label>

<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
placeholder="Enter your college email"
required
/>

</div>


<div className="mb-5 relative">

<label className="text-sm text-gray-600">

Password

</label>

<input
type={passwordVisible?"text":"password"}
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
placeholder="Enter your password"
required
/>

<button
type="button"
className="absolute right-3 top-9 text-gray-500"
onClick={()=>setPasswordVisible(!passwordVisible)}
>

{passwordVisible?<VisibilityOff/>:<Visibility/>}

</button>

</div>


<button
type="submit"
className="w-full py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
>

Login

</button>

</form>


<div className="flex items-center my-6">

<div className="flex-grow border-t"></div>

<span className="mx-4 text-sm text-gray-500">

or

</span>

<div className="flex-grow border-t"></div>

</div>


<button
onClick={handleGoogleLogin}
className="w-full flex items-center justify-center py-2 rounded-lg border hover:bg-emerald-50 transition font-medium"
>

<FaGoogle className="text-red-500 mr-2"/>

Continue with Google

</button>


<p className="text-center mt-6 text-sm text-gray-600">

Don't have an account?

<a href="/signup" className="text-emerald-600 font-medium ml-1">

Sign up

</a>

</p>

</div>

</div>

</div>

)

}