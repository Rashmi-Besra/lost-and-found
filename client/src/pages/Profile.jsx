import { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Spinner from "../components/spin";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function ProfilePage() {

const [user,setUser]=useState(null);
const [loading,setLoading]=useState(true);
const [hovered,setHovered]=useState(null);
const [reportedItems,setReportedItems]=useState([]);
const [foundItems,setFoundItems]=useState([]);

const [isDarkMode,setIsDarkMode]=useState(
localStorage.getItem("darkMode")==="true"
);

const navigate=useNavigate();
const auth=getAuth(app);
const db=getFirestore(app);

useEffect(()=>{
localStorage.setItem("darkMode",isDarkMode);
},[isDarkMode]);

useEffect(()=>{

const unsubscribe=onAuthStateChanged(auth,async(currentUser)=>{

if(currentUser){

fetchUserProfile(currentUser);
fetchReports(currentUser.uid);

}else{

navigate("/login");

}

});

return ()=>unsubscribe();

},[]);


const fetchUserProfile=async(user)=>{

try{

const token=await user.getIdToken();

const response=await axios.get(
"https://los-n-found.onrender.com/api/profile",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setUser(response.data);

}catch(error){

console.log("Profile load error",error);

}finally{

setLoading(false);

}

};


const fetchReports=async(userId)=>{

try{

const lostQuery=query(collection(db,"reportedItems"),where("userId","==",userId));
const lostSnap=await getDocs(lostQuery);

setReportedItems(lostSnap.docs.map(doc=>({id:doc.id,...doc.data()})));

const foundQuery=query(collection(db,"foundItems"),where("userId","==",userId));
const foundSnap=await getDocs(foundQuery);

setFoundItems(foundSnap.docs.map(doc=>({id:doc.id,...doc.data()})));

}catch(err){

console.log(err);

}

};


const logout=()=>{
auth.signOut();
navigate("/login");
};


if(loading){

return(

<div className={`flex justify-center items-center min-h-screen ${isDarkMode?"bg-gray-900":"bg-emerald-50"}`}>

<Spinner size="lg"/>

</div>

);

}


return(

<div className={`${isDarkMode?"bg-gray-900 text-white":"bg-gradient-to-b from-emerald-50 to-white text-gray-900"} min-h-screen p-4`}>

{/* NAVBAR */}

<nav className={`hidden md:flex justify-between items-center ${isDarkMode?"bg-gray-800":"bg-white"} shadow-sm p-4 rounded-lg`}>

<Link to="/home" className={`text-2xl font-bold ${isDarkMode?"text-emerald-400":"text-emerald-600"}`}>
Reclaim
</Link>

<div className="flex gap-10">

{[
{ name:"Report Lost",path:"/report"},
{ name:"Report Found",path:"/found"},
{ name:"Forum",path:"/forum"},
{ name:"Recent Posts",path:"/recent"},
{ name:"Map",path:"/map"},
{ name:"Profile",path:"/profile"}
].map((item,index)=>(

<Link
key={index}
to={item.path}
className={`text-lg transition ${
hovered===index
? "text-emerald-500"
: isDarkMode
? "text-gray-300"
: "text-gray-700"
}`}
onMouseEnter={()=>setHovered(index)}
onMouseLeave={()=>setHovered(null)}
>

{item.name}

</Link>

))}

</div>

<div className="flex gap-4 items-center">

<button
onClick={()=>setIsDarkMode(!isDarkMode)}
className={`p-2 rounded-full ${isDarkMode?"bg-gray-700":"bg-gray-200"}`}
>
{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
</button>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
>
Logout
</button>

</div>

</nav>


{/* PROFILE CARD */}

<div className="max-w-4xl mx-auto mt-12">

<div className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow-lg overflow-hidden`}>

<div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-32"></div>

<div className="px-6 pb-6">

<div className="flex items-center -mt-16">

<div className={`${isDarkMode?"bg-gray-700":"bg-white"} p-1 rounded-full shadow`}>

{user?.profileImage ?

<img src={user.profileImage} className="w-24 h-24 rounded-full object-cover"/>

:

<AccountCircleIcon style={{fontSize:96,color:"#10b981"}}/>

}

</div>

<div className="ml-6">

<h2 className="text-2xl font-bold">
{user?.fullName || "No Name"}
</h2>

<span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
{user?.email}
</span>

</div>

</div>


<div className="grid md:grid-cols-2 gap-6 mt-8">

<div className={`${isDarkMode?"bg-gray-700":"bg-emerald-50"} p-4 rounded-lg`}>
<h3 className="text-sm font-medium text-emerald-600">Roll Number</h3>
<p className="text-lg font-semibold">{user?.rollNumber || "Not provided"}</p>
</div>

<div className={`${isDarkMode?"bg-gray-700":"bg-emerald-50"} p-4 rounded-lg`}>
<h3 className="text-sm font-medium text-emerald-600">Branch</h3>
<p className="text-lg font-semibold">{user?.branch || "Not provided"}</p>
</div>

<div className={`${isDarkMode?"bg-gray-700":"bg-emerald-50"} p-4 rounded-lg`}>
<h3 className="text-sm font-medium text-emerald-600">Year</h3>
<p className="text-lg font-semibold">{user?.year || "Not provided"}</p>
</div>

<div className={`${isDarkMode?"bg-gray-700":"bg-emerald-50"} p-4 rounded-lg`}>
<h3 className="text-sm font-medium text-emerald-600">Hostel</h3>
<p className="text-lg font-semibold">{user?.hostelName || "Not provided"}</p>
</div>

<div className={`${isDarkMode?"bg-gray-700":"bg-emerald-50"} p-4 rounded-lg`}>
<h3 className="text-sm font-medium text-emerald-600">Lost Reports</h3>
<p className="text-lg font-semibold">{reportedItems.length}</p>
</div>

<div className={`${isDarkMode?"bg-gray-700":"bg-emerald-50"} p-4 rounded-lg`}>
<h3 className="text-sm font-medium text-emerald-600">Items Found</h3>
<p className="text-lg font-semibold">{foundItems.length}</p>
</div>

</div>

<Link to="/update" className="block mt-8">

<button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-3 rounded-lg flex items-center justify-center gap-2">

<FaUserEdit/>
Edit Profile

</button>

</Link>

</div>

</div>

</div>

</div>

);

}