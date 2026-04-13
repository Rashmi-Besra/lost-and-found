import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaArrowLeft, FaSearch, FaEnvelope, FaMap, FaSatellite, FaLocationArrow } from "react-icons/fa";

const DefaultIcon = L.icon({
iconUrl: icon,
shadowUrl: iconShadow,
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {

const [position,setPosition]=useState(null);
const [userLocation,setUserLocation]=useState(null);
const [selectedLocation,setSelectedLocation]=useState(null);
const [reports,setReports]=useState([]);
const [senderEmail,setSenderEmail]=useState("");
const [loading,setLoading]=useState(false);
const [emailLoading,setEmailLoading]=useState(false);
const [error,setError]=useState(null);
const [mapView,setMapView]=useState("normal");
const [mapInstance,setMapInstance]=useState(null);

const [isDarkMode,setIsDarkMode]=useState(()=>{
const storedTheme=localStorage.getItem("darkMode");
return storedTheme ? storedTheme==="true" : false;
});

const auth=getAuth(app);
const navigate=useNavigate();


useEffect(()=>{

onAuthStateChanged(auth,(user)=>{

if(user){

setSenderEmail(user.email);

}

});

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

(pos)=>{

const {latitude,longitude}=pos.coords;

setUserLocation([latitude,longitude]);
setPosition([latitude,longitude]);

},

()=>{

setUserLocation([51.505,-0.09]);
setPosition([51.505,-0.09]);

},

{enableHighAccuracy:true}

);

}

},[]);


const fetchItems=async()=>{

if(!selectedLocation){

alert("Select a location on the map first!");

return;

}

setLoading(true);

try{

const response=await axios.get(

"https://los-n-found.onrender.com/api/items",

{

params:{

latitude:selectedLocation[0],
longitude:selectedLocation[1],
radius:20

}

}

);

if(response.data?.items){

setReports(response.data.items);

}else{

setReports([]);

}

}catch{

setError("Failed to fetch items");

}finally{

setLoading(false);

}

};


const handleSendEmail=async(ownerUid,itemDetails,title)=>{

setEmailLoading(true);

try{

await axios.post(

"https://los-n-found.onrender.com/api/send-email",

{

ownerUid,
senderEmail:auth.currentUser.email,
itemDetails,
title

}

);

alert("Email sent");

}catch{

alert("Failed to send email");

}finally{

setEmailLoading(false);

}

};


const LocationMarker=()=>{

const map=useMapEvents({

click(e){

setSelectedLocation([e.latlng.lat,e.latlng.lng]);

}

});

useEffect(()=>{

if(map) setMapInstance(map);

},[map]);

return selectedLocation ? (

<Marker position={selectedLocation} icon={DefaultIcon}>

<Popup>

Selected Location

</Popup>

</Marker>

):null;

};


const toggleMapView=()=>{

setMapView(prev=>prev==="normal"?"satellite":"normal");

};


const centerToUserLocation=()=>{

if(mapInstance && userLocation){

mapInstance.flyTo(userLocation,15);

}

};


return(

<div className={`${isDarkMode?"bg-gray-900 text-white":"bg-gradient-to-b from-emerald-50 to-white"} min-h-screen flex flex-col`}>

{/* HEADER */}

<div className={`${isDarkMode?"bg-gray-800":"bg-white"} shadow-sm p-4 flex justify-between`}>

<h1 className="text-xl font-bold flex items-center">

<FaSearch className="mr-2 text-emerald-600"/>

Map Search

</h1>

<button

onClick={()=>navigate("/Home")}

className="text-emerald-600 hover:text-emerald-700 flex items-center"

>

<FaArrowLeft className="mr-1"/>

Back

</button>

</div>


{/* MAP */}

<div className="flex-grow relative" style={{height:"60vh"}}>

{position ? (

<MapContainer

center={position}

zoom={13}

className="h-full w-full"

whenCreated={map=>setMapInstance(map)}

>

{mapView==="normal" ? (

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

):(

<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>

)}


{userLocation && (

<Marker position={userLocation} icon={DefaultIcon}>

<Popup>You are here</Popup>

</Marker>

)}


<LocationMarker/>


{reports.map((report,index)=>(

<Marker key={index} position={[report.location.lat,report.location.lng]}>

<Popup>

<h3 className="font-bold text-gray-800">

{report.description}

</h3>

<p className="text-gray-600">

Type: {report.type}

</p>

<button

onClick={()=>handleSendEmail(report.userId,report.description,report.type)}

className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1 rounded-md flex items-center justify-center"

>

{emailLoading ?

<CircularProgress size={16} color="inherit"/>

:

<>

<FaEnvelope className="mr-1"/>

Contact Owner

</>

}

</button>

</Popup>

</Marker>

))}

</MapContainer>

):( 

<div className="h-full flex items-center justify-center">

<CircularProgress className="text-emerald-600"/>

</div>

)}

</div>


{/* SEARCH PANEL */}

<div className={`${isDarkMode?"bg-gray-800":"bg-white"} p-4 border-t`}>

{selectedLocation && (

<p className="text-sm">

Selected: {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}

</p>

)}

<button

onClick={fetchItems}

className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg flex justify-center items-center"

disabled={loading}

>

{loading ?

<>

<CircularProgress size={20} color="inherit" className="mr-2"/>

Searching...

</>

:

<>

<FaSearch className="mr-2"/>

Search This Area

</>

}

</button>


{error && (

<p className="text-red-500 text-center mt-2">

{error}

</p>

)}

</div>

</div>

);

};

export default MapComponent;