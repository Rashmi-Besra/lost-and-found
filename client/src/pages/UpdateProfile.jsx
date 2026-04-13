import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-hot-toast';

export default function UpdateProfile() {

const [userId,setUserId]=useState(null);
const [initialData,setInitialData]=useState(null);

const [formData,setFormData]=useState({
name:"",
email:"",
phone:"",
profileImage:""
});

const [imageFile,setImageFile]=useState(null);
const [loading,setLoading]=useState(false);
const [error,setError]=useState(null);
const [success,setSuccess]=useState(null);

const [isDarkMode]=useState(()=>{
return localStorage.getItem("darkMode")==="true";
});

const navigate=useNavigate();

useEffect(()=>{

const auth=getAuth();

const unsubscribe=onAuthStateChanged(auth,async(currentUser)=>{

if(currentUser){
setUserId(currentUser.uid);
fetchUserProfile(currentUser.uid);
}

});

return()=>unsubscribe();

},[]);


const fetchUserProfile=async(id)=>{

try{

const response=await axios.get(`https://los-n-found.onrender.com/api/profile/${id}`);

setInitialData(response.data);

setFormData({
name:response.data.name || "",
email:response.data.email || "",
phone:response.data.phone || "",
profileImage:response.data.profileImage || ""
});

}
catch(error){

setError("Failed to load profile data");

}

};


const handleChange=(e)=>{

setFormData({...formData,[e.target.name]:e.target.value});

};


const handleImageChange=(e)=>{

if(e.target.files && e.target.files[0]){

const file=e.target.files[0];

if(file.size>5*1024*1024){

setError("Image must be under 5MB");
return;

}

setImageFile(file);

const reader=new FileReader();

reader.onload=(event)=>{

setFormData(prev=>({...prev,profileImage:event.target.result}));

};

reader.readAsDataURL(file);

}

};


const handleSubmit=async(e)=>{

e.preventDefault();

setLoading(true);
setError(null);
setSuccess(null);

if(!formData.name.trim()){
setError("Name required");
setLoading(false);
return;
}

let imageUrl=formData.profileImage;

if(imageFile){

const formDataImage=new FormData();
formDataImage.append("image",imageFile);

try{

const uploadResponse=await fetch("https://los-n-found.onrender.com/api/cloudinary/upload",{
method:"POST",
body:formDataImage
});

const uploadData=await uploadResponse.json();

if(uploadResponse.ok){
imageUrl=uploadData.imageUrl;
}

}catch{

setError("Image upload failed");
setLoading(false);
return;

}

}

try{

await axios.put(

`https://los-n-found.onrender.com/api/update/${userId}`,

{
name:formData.name,
phone:formData.phone,
profileImage:imageUrl
}

);

toast.success("Profile updated successfully");

setTimeout(()=>navigate(`/profile/${userId}`),1500);

}
catch(error){

setError("Failed to update profile");
toast.error("Update failed");

}
finally{

setLoading(false);

}

};


return(

<div className={`${isDarkMode?"bg-emerald-950 text-white":"bg-gradient-to-b from-emerald-50 to-white"} min-h-screen p-6`}>

<div className="max-w-4xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center mb-8">

<button
onClick={()=>navigate(-1)}
className="flex items-center text-emerald-600 hover:text-emerald-700"
>

<FaArrowLeft className="mr-2"/>

Back

</button>

<h1 className="text-2xl font-bold text-emerald-600">

Reclaim

</h1>

</div>


{/* CARD */}

<div className={`${isDarkMode?"bg-slate-800":"bg-white"} rounded-xl shadow-lg`}>

<div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-32 rounded-t-xl"></div>

<div className="px-6 pb-6">

{/* PROFILE IMAGE */}

<div className="flex flex-col items-center -mt-16">

<div className="bg-white p-1 rounded-full shadow-md">

{formData.profileImage ?

<img
src={formData.profileImage}
className="w-32 h-32 rounded-full object-cover"
/>

:

<AccountCircleIcon style={{fontSize:120,color:"#10b981"}}/>

}

</div>

<h2 className="text-2xl font-bold mt-6">

Update Profile

</h2>

</div>


<form onSubmit={handleSubmit} className="space-y-6 mt-6">

{/* IMAGE */}

<div>

<label className="block text-sm font-medium text-emerald-600 mb-1">

Change Profile Picture

</label>

<input
type="file"
accept="image/*"
onChange={handleImageChange}
/>

</div>


{error &&

<div className="bg-red-100 text-red-700 p-3 rounded-lg">

{error}

</div>

}


{success &&

<div className="bg-green-100 text-green-700 p-3 rounded-lg">

{success}

</div>

}


<div className="grid md:grid-cols-2 gap-6">

{/* NAME */}

<div>

<label className="text-sm font-medium text-emerald-600">

Full Name

</label>

<input
name="name"
type="text"
value={formData.name}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
/>

</div>


{/* EMAIL */}

<div>

<label className="text-sm font-medium text-emerald-600">

Email

</label>

<input
name="email"
type="email"
value={formData.email}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
/>

</div>


{/* PHONE */}

<div>

<label className="text-sm font-medium text-emerald-600">

Phone

</label>

<input
name="phone"
type="tel"
value={formData.phone}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
/>

</div>

</div>


{/* BUTTON */}

<button
type="submit"
className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg"
disabled={loading}
>

{loading?"Saving...":"Save Changes"}

</button>

</form>

</div>

</div>

</div>

</div>

)

}