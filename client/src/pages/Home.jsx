import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function HomePage() {

const navigate = useNavigate();
const auth = getAuth(app);
const db = getFirestore(app);

const [reportedItems,setReportedItems]=useState([]);
const [foundItems,setFoundItems]=useState([]);

const [isDarkMode,setIsDarkMode]=useState(
localStorage.getItem("darkMode")==="true"
);

useEffect(()=>{
localStorage.setItem("darkMode",isDarkMode);
},[isDarkMode]);

useEffect(()=>{

const fetchItems=async()=>{

const user=auth.currentUser;

if(!user){
navigate("/login");
return;
}

const lostQuery=query(collection(db,"reportedItems"),where("userId","==",user.uid));
const lostSnap=await getDocs(lostQuery);
setReportedItems(lostSnap.docs.map(doc=>({id:doc.id,...doc.data()})));

const foundQuery=query(collection(db,"foundItems"),where("userId","==",user.uid));
const foundSnap=await getDocs(foundQuery);
setFoundItems(foundSnap.docs.map(doc=>({id:doc.id,...doc.data()})));

};

fetchItems();

},[]);

const logout=()=>{
auth.signOut();
navigate("/login");
};

return(

<div className={`${isDarkMode?"bg-emerald-950 text-white":"bg-emerald-50"} min-h-screen`}>

{/* NAVBAR */}

<nav className={`flex justify-between items-center px-10 py-4 shadow-md ${isDarkMode?"bg-slate-800":"bg-white"}`}>

<h1 className="text-2xl font-bold text-emerald-600">
Reclaim
</h1>

<div className="flex gap-8 font-medium">

<Link to="/report" className="hover:text-emerald-600 transition">
Report Lost
</Link>

<Link to="/found" className="hover:text-emerald-600 transition">
Report Found
</Link>

<Link to="/forum" className="hover:text-emerald-600 transition">
Forum
</Link>

<Link to="/recent" className="hover:text-emerald-600 transition">
Recent
</Link>

<Link to="/map" className="hover:text-emerald-600 transition">
Campus Map
</Link>

<Link to="/profile" className="hover:text-emerald-600 transition">
Profile
</Link>

</div>

<div className="flex gap-4 items-center">

<button
onClick={()=>setIsDarkMode(!isDarkMode)}
className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700"
>
{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
</button>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>
Logout
</button>

</div>

</nav>

{/* HERO */}

<section className="max-w-7xl mx-auto px-8 py-12">

<div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-10 shadow-xl">

<h2 className="text-3xl font-bold mb-2">
Welcome back 👋
</h2>

<p className="opacity-90">
Manage your campus lost & found posts easily.
</p>

</div>

</section>

{/* STATS */}

<section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">

<h3 className="text-lg font-semibold">Lost Items</h3>

<p className="text-3xl font-bold text-emerald-600">
{reportedItems.length}
</p>

</div>

<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">

<h3 className="text-lg font-semibold">Found Items</h3>

<p className="text-3xl font-bold text-teal-600">
{foundItems.length}
</p>

</div>

<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">

<h3 className="text-lg font-semibold">Total Posts</h3>

<p className="text-3xl font-bold text-green-600">
{reportedItems.length + foundItems.length}
</p>

</div>

</section>

{/* LOST ITEMS */}

<section className="max-w-7xl mx-auto px-8 mt-12">

<div className="flex justify-between items-center mb-6">

<h2 className="text-2xl font-bold">
Your Lost Items
</h2>

<Link
to="/report"
className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
>
Report Lost Item
</Link>

</div>

<div className="grid md:grid-cols-3 gap-6">

{reportedItems.map(item=>(

<div
key={item.id}
className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl transition"
>

<img
src={item.imageUrl}
className="h-48 w-full object-cover rounded-t-xl"
/>

<div className="p-4">

<h3 className="font-semibold">
{item.category}
</h3>

<p className="text-sm opacity-70">
{item.description}
</p>

</div>

</div>

))}

</div>

</section>

{/* FOUND ITEMS */}

<section className="max-w-7xl mx-auto px-8 mt-12 pb-12">

<h2 className="text-2xl font-bold mb-6">
Your Found Items
</h2>

<div className="grid md:grid-cols-3 gap-6">

{foundItems.map(item=>(

<div
key={item.id}
className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl transition"
>

<img
src={item.imageUrl}
className="h-48 w-full object-cover rounded-t-xl"
/>

<div className="p-4">

<h3 className="font-semibold">
{item.category}
</h3>

<p className="text-sm opacity-70">
{item.description}
</p>

</div>

</div>

))}

</div>

</section>

</div>
);
}