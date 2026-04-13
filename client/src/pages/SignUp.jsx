import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from "../firebaseConfig";
import { CircularProgress } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { toast } from "react-hot-toast";

const SignUp = () => {

const [name,setName]=useState("");
const [roll,setRoll]=useState("");
const [branch,setBranch]=useState("");
const [year,setYear]=useState("");
const [hostel,setHostel]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");
const [loading,setLoading]=useState(false);

const navigate = useNavigate();


const handleSignUp = async (e) => {

e.preventDefault();

if(!name) return toast.error("Full name required");
if(!roll) return toast.error("Roll number required");
if(!branch) return toast.error("Branch required");
if(!year) return toast.error("Year required");
if(!email) return toast.error("Email required");

if(password !== confirmPassword)
return toast.error("Passwords do not match");

setLoading(true);

try{

const userCredential = await createUserWithEmailAndPassword(
auth,
email,
password
);

const user = userCredential.user;

await updateProfile(user,{displayName:name});

const idToken = await user.getIdToken();

const response = await fetch(
"https://los-n-found.onrender.com/api/auth/signup",
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${idToken}`
},
body:JSON.stringify({
uid:user.uid,
fullName:name,
rollNumber:roll,
branch,
year,
hostelName:hostel,
email
})
}
);

if(!response.ok){
throw new Error("Backend signup failed");
}

toast.success("Account created successfully");

navigate("/home");

}

catch(err){

if(err.code==="auth/email-already-in-use"){
toast.error("Email already registered. Please login.");
}
else{
toast.error(err.message || "Signup failed");
}

}

finally{
setLoading(false);
}

};


const handleGoogleSignIn = async () => {

try{

const userCredential = await signInWithPopup(auth,googleProvider);

const user = userCredential.user;

await fetch(
"https://los-n-found.onrender.com/api/auth/signup",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
uid:user.uid,
fullName:user.displayName,
email:user.email
})
}
);

toast.success("Signed in with Google");

navigate("/home");

}

catch(err){
toast.error("Google sign in failed");
}

};


return(

<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-6">

<div className="grid md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden max-w-5xl w-full bg-white">

{/* LEFT PANEL */}

<div className="hidden md:flex flex-col justify-center items-center text-center p-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">

<h2 className="text-3xl font-bold mb-4">
Reclaim
</h2>

<p className="opacity-90">
Helping students recover lost items across campus.
Join the community and help return lost belongings.
</p>

</div>


{/* RIGHT PANEL */}

<div className="p-10">

<h3 className="text-2xl font-semibold text-emerald-600 mb-6">
Create Student Account
</h3>


<form onSubmit={handleSignUp} className="space-y-4">

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
/>

<input
type="text"
placeholder="Roll Number"
value={roll}
onChange={(e)=>setRoll(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
/>

<select
value={branch}
onChange={(e)=>setBranch(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
>

<option value="">Select Branch</option>
<option>CSE</option>
<option>ECE</option>
<option>ME</option>
<option>CE</option>
<option>EE</option>

</select>


<select
value={year}
onChange={(e)=>setYear(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
>

<option value="">Select Year</option>
<option>1st Year</option>
<option>2nd Year</option>
<option>3rd Year</option>
<option>4th Year</option>

</select>


<input
type="text"
placeholder="Hostel Name"
value={hostel}
onChange={(e)=>setHostel(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
/>


<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
/>


<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
/>


<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
/>


<button
type="submit"
className="w-full py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex justify-center items-center"
disabled={loading}
>

{loading ? (
<CircularProgress size={22} color="inherit"/>
) : (
"Create Account"
)}

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
onClick={handleGoogleSignIn}
className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border hover:bg-emerald-50"
>

<FaGoogle className="text-red-500"/>

Continue with Google

</button>


<p className="text-center mt-6 text-sm text-gray-600">

Already have an account?

<a href="/login" className="text-emerald-600 ml-1 font-medium">

Login

</a>

</p>

</div>

</div>

</div>

)

}

export default SignUp;