import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import LinearProgress from "@mui/material/LinearProgress";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function ReportPage() {

const [category,setCategory]=useState("");
const [description,setDescription]=useState("");
const [location,setLocation]=useState({lat:null,lng:null});
const [imageFile,setImageFile]=useState(null);
const [error,setError]=useState(null);
const [loading,setLoading]=useState(false);
const [success,setSuccess]=useState(false);

const [isDarkMode]=useState(()=>{
const storedTheme=localStorage.getItem("darkMode");
return storedTheme?storedTheme==="true":false;
});

const navigate=useNavigate();
const auth=getAuth(app);

const categories=[
"Electronics",
"Clothing",
"Books",
"Wallet",
"Keys",
"Accessories"
];

useEffect(()=>{

navigator.geolocation.getCurrentPosition(

(pos)=>{
setLocation({
lat:pos.coords.latitude,
lng:pos.coords.longitude
});
},

(err)=>console.log(err),

{enableHighAccuracy:true}

);

},[]);


useEffect(()=>{

if(success){

setTimeout(()=>{

navigate("/Home");

},1500);

}

},[success,navigate]);


function LocationMarker(){

useMapEvents({

click(e){

setLocation({

lat:e.latlng.lat,
lng:e.latlng.lng

});

}

});

return location.lat && location.lng ? (

<Marker position={[location.lat,location.lng]} icon={DefaultIcon}/>

):null;

}


const handleSubmit=async(e)=>{

e.preventDefault();

setLoading(true);
setError(null);

const user=auth.currentUser;

if(!user){

setError("Please login first");
setLoading(false);
return;

}

if(!location.lat){

setError("Select location on map");
setLoading(false);
return;

}

let imageUrl="";

if(imageFile){

try{

const formData=new FormData();
formData.append("image",imageFile);

const uploadResponse=await fetch("https://los-n-found.onrender.com/api/cloudinary/upload",{
method:"POST",
body:formData
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

const reportData={

category,
description,
location,
imageUrl,
userId:user.uid

};

try{

const response=await fetch("https://los-n-found.onrender.com/api/report",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${await user.getIdToken()}`
},

body:JSON.stringify(reportData)

});

if(response.ok){

setSuccess(true);

setCategory("");
setDescription("");
setImageFile(null);

}else{

setError("Something went wrong");

}

}catch{

setError("Server error");

}

setLoading(false);

};


return(

<div className={`min-h-screen ${isDarkMode?"bg-emerald-950 text-white":"bg-gradient-to-b from-emerald-50 to-white"} p-4`}>

<div className="max-w-4xl mx-auto">

<div className={`${isDarkMode?"bg-slate-800":"bg-white"} rounded-xl shadow-md`}>

<div className="p-8">

<div className="flex justify-between items-center mb-6">

<h2 className="text-2xl font-bold text-emerald-600">

Report Lost Item

</h2>

<button

onClick={()=>navigate("/Home")}

className="text-emerald-600 hover:text-emerald-700 font-medium"

>

← Back

</button>

</div>


{loading && <LinearProgress color="success" className="mb-4"/>}

{error && <p className="text-red-500 mb-4 text-center">{error}</p>}

{success && (

<div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 text-center">

Item reported successfully!

</div>

)}


<form onSubmit={handleSubmit} className="space-y-6">

<div>

<label className="block text-sm font-medium mb-2">

Category

</label>

<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"

required

>

<option value="">Select category</option>

{categories.map(cat=>(

<option key={cat} value={cat}>

{cat}

</option>

))}

</select>

</div>


<div>

<label className="block text-sm font-medium mb-2">

Description

</label>

<textarea

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"

rows="4"

placeholder="Describe the lost item"

required

/>

</div>


<div>

<label className="block text-sm font-medium mb-2">

Location

</label>

<div className="h-64 rounded-lg overflow-hidden border">

{location.lat && location.lng ? (

<MapContainer

center={[location.lat,location.lng]}

zoom={15}

style={{height:"100%",width:"100%"}}

>

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

<LocationMarker/>

</MapContainer>

):(

<div className="h-full flex items-center justify-center text-gray-500">

Loading map...

</div>

)}

</div>

<p className="text-sm text-gray-500 mt-2">

Click map to mark location

</p>

</div>


<div>

<label className="block text-sm font-medium mb-2">

Upload Image (Optional)

</label>

<input

type="file"

accept="image/*"

onChange={(e)=>setImageFile(e.target.files[0])}

/>

</div>


<button

type="submit"

className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium"

disabled={loading}

>

{loading?"Submitting...":"Report Item"}

</button>

</form>

</div>

</div>

</div>

</div>

)

}