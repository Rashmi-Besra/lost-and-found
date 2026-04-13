import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Trash2, MoreVertical, Edit } from "lucide-react";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

export default function AdminPage() {

const navigate = useNavigate();
const auth = getAuth(app);

const [isSidebarOpen,setIsSidebarOpen] = useState(false);
const [hovered,setHovered] = useState(null);
const [activeMenu,setActiveMenu] = useState(null);

const [isDarkMode,setIsDarkMode] = useState(()=>{
const storedTheme = localStorage.getItem("darkMode");
return storedTheme ? storedTheme==="true" : false;
});

useEffect(()=>{
localStorage.setItem("darkMode",isDarkMode);
},[isDarkMode]);

const handleLogout=()=>{
auth.signOut();
navigate("/login");
};

const toggleMenu=(id)=>{
setActiveMenu(activeMenu===id ? null : id);
};

return (

<div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-emerald-50 to-white"} min-h-screen p-4`}>

{/* NAVBAR */}

<nav className={`hidden md:flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm p-4 rounded-lg`}>

<div className="flex gap-10">

{[
{ name:"Admin Dashboard", path:"/admin"},
{ name:"Lost Items", path:"#lost"},
{ name:"Found Items", path:"#found"},
{ name:"Users", path:"#users"}
].map((item,index)=>(
<a
key={index}
href={item.path}
className={`text-lg transition ${
hovered===index
? "text-emerald-500 scale-105"
: isDarkMode ? "text-gray-300" : "text-gray-700"
}`}
onMouseEnter={()=>setHovered(index)}
onMouseLeave={()=>setHovered(null)}
>
{item.name}
</a>
))}

</div>

<div className="flex gap-4 items-center">

<button
onClick={()=>setIsDarkMode(!isDarkMode)}
className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700":"bg-gray-200"}`}
>

{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}

</button>

<button
onClick={handleLogout}
className="bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 text-white"
>

Logout

</button>

</div>

</nav>

{/* MOBILE MENU BUTTON */}

<button
className="md:hidden fixed top-4 left-4 bg-white shadow-md p-2 rounded-md z-50"
onClick={()=>setIsSidebarOpen(true)}
>

<Menu size={24} className="text-emerald-600"/>

</button>

{/* SIDEBAR */}

<div className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? "bg-gray-800":"bg-white"} shadow-xl p-6 transition-transform ${isSidebarOpen ? "translate-x-0":"-translate-x-full"} md:hidden`}>

<button
className="absolute top-4 right-4"
onClick={()=>setIsSidebarOpen(false)}
>

<X size={24}/>

</button>

<h1 className="text-3xl font-bold text-emerald-600 mt-8">

Admin Panel

</h1>

<div className="h-1 w-40 bg-emerald-500 mt-4"></div>

<div className="mt-10 flex flex-col gap-4">

{[
{ name:"Lost Items", path:"#lost"},
{ name:"Found Items", path:"#found"},
{ name:"Users", path:"#users"}
].map((item,index)=>(
<a
key={index}
href={item.path}
onClick={()=>setIsSidebarOpen(false)}
className="text-lg hover:text-emerald-500"
>
{item.name}
</a>
))}

</div>

</div>

{/* MAIN CONTENT */}

<div className="max-w-7xl mx-auto mt-16">

<h1 className="text-3xl font-bold mb-10">

Admin Dashboard

</h1>

{/* LOST ITEMS */}

<section id="lost" className="mb-12">

<h2 className="text-2xl font-bold mb-6">

Lost Items

</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

{reportedItems.map(item=>(

<div
key={item.id}
className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow hover:shadow-lg`}
>

<img
src={item.imageUrl}
className="h-48 w-full object-cover"
/>

<div className="p-4">

<div className="flex justify-between">

<h3 className="font-semibold">

{item.category}

</h3>

<span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">

Lost

</span>

</div>

<p className="text-sm mt-2">

{item.description}

</p>

<p className="text-xs text-gray-500 mt-2">

{item.location}

</p>

<button
className="mt-3 text-red-600 flex items-center gap-1"
>

<Trash2 size={16}/>

Delete

</button>

</div>

</div>

))}

</div>

</section>

{/* FOUND ITEMS */}

<section id="found" className="mb-12">

<h2 className="text-2xl font-bold mb-6">

Found Items

</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

{foundItems.map(item=>(

<div
key={item.id}
className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow`}
>

<img
src={item.imageUrl}
className="h-48 w-full object-cover"
/>

<div className="p-4">

<div className="flex justify-between">

<h3 className="font-semibold">

{item.category}

</h3>

<span className="bg-emerald-100 text-emerald-700 px-2 py-1 text-xs rounded-full">

Found

</span>

</div>

<p className="text-sm mt-2">

{item.description}

</p>

<p className="text-xs text-gray-500 mt-2">

{item.location}

</p>

<button
className="mt-3 text-red-600 flex items-center gap-1"
>

<Trash2 size={16}/>

Delete

</button>

</div>

</div>

))}

</div>

</section>

{/* USERS */}

<section id="users">

<h2 className="text-2xl font-bold mb-6">

Users

</h2>

<div className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow`}>

<table className="min-w-full">

<thead className="border-b">

<tr>

<th className="px-6 py-3 text-left text-xs uppercase">

Username

</th>

<th className="px-6 py-3 text-left text-xs uppercase">

Email

</th>

<th className="px-6 py-3 text-right text-xs uppercase">

Actions

</th>

</tr>

</thead>

<tbody>

{users.map(user=>(

<tr key={user.id} className="border-b">

<td className="px-6 py-4">

{user.username}

</td>

<td className="px-6 py-4">

{user.email}

</td>

<td className="px-6 py-4 text-right">

<button
onClick={()=>toggleMenu(user.id)}
>

<MoreVertical size={18}/>

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</section>

</div>

</div>

);

}