import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GavelIcon from "@mui/icons-material/Gavel";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";
import LoadingScreen from "../components/loading";

export default function LandingPage() {

const navigate = useNavigate()

const [showLoading,setShowLoading]=useState(false)

const [isDarkMode,setIsDarkMode]=useState(()=>{
const storedTheme=localStorage.getItem("darkMode")
return storedTheme?storedTheme==="true":false
})

const handleRedirect=(path)=>{
setShowLoading(true)

setTimeout(()=>{
navigate(path)
},1500)
}

if(showLoading) return <LoadingScreen isDarkMode={isDarkMode}/>

return(

<div className={`${isDarkMode?"bg-emerald-950 text-white":"bg-emerald-50"} min-h-screen flex flex-col`}>

{/* NAVBAR */}

<nav className={`flex justify-between items-center px-10 py-5 shadow-md ${isDarkMode?"bg-slate-800":"bg-white"}`}>

<h1 className="text-3xl font-bold text-emerald-600">
Reclaim
</h1>

<div className="flex gap-4">

<button
onClick={()=>handleRedirect("/login")}
className="px-5 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
>
Login
</button>

<button
onClick={()=>handleRedirect("/signup")}
className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
>
Sign Up
</button>

</div>

</nav>


{/* HERO SECTION */}

<section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">

<h2 className="text-5xl font-bold mb-6">
Lost Something on Campus?
</h2>

<p className="max-w-2xl text-lg opacity-90 mb-8">
Reclaim helps students report lost items and return found belongings across campus quickly and securely.
</p>

<button
onClick={()=>handleRedirect("/signup")}
className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
>
Get Started
</button>

</section>


{/* FEATURES */}

<section className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-8">

<div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow hover:shadow-xl transition">

<h3 className="text-xl font-semibold mb-2 text-emerald-600">
Report Lost Items
</h3>

<p className="text-sm opacity-70">
Lost something in the library, hostel, or lecture hall? Post it here so others can help find it.
</p>

</div>

<div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow hover:shadow-xl transition">

<h3 className="text-xl font-semibold mb-2 text-emerald-600">
Report Found Items
</h3>

<p className="text-sm opacity-70">
Found a wallet, phone, or charger on campus? Upload it so the rightful owner can reclaim it.
</p>

</div>

<div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow hover:shadow-xl transition">

<h3 className="text-xl font-semibold mb-2 text-emerald-600">
Campus Community
</h3>

<p className="text-sm opacity-70">
Students help students. Our community-driven platform helps reunite lost items with their owners.
</p>

</div>

</section>


{/* HOW IT WORKS */}

<section className="bg-emerald-100 dark:bg-slate-800 py-16">

<div className="max-w-5xl mx-auto text-center">

<h2 className="text-3xl font-bold mb-10 text-emerald-700">
How It Works
</h2>

<div className="grid md:grid-cols-4 gap-6">

<div>
<h3 className="text-xl font-semibold mb-2">1</h3>
<p>Create Account</p>
</div>

<div>
<h3 className="text-xl font-semibold mb-2">2</h3>
<p>Report Lost Item</p>
</div>

<div>
<h3 className="text-xl font-semibold mb-2">3</h3>
<p>Report Found Item</p>
</div>

<div>
<h3 className="text-xl font-semibold mb-2">4</h3>
<p>Reconnect & Recover</p>
</div>

</div>

</div>

</section>


{/* FOOTER */}

<footer className={`mt-auto py-10 border-t ${isDarkMode?"bg-slate-900 border-slate-700":"bg-white"}`}>

<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

<div>

<p className="font-semibold text-emerald-600 mb-2">
Reclaim
</p>

<p className="text-sm opacity-70">
A smart lost and found platform built for college campuses.
</p>

</div>

<div>

<div className="flex items-center font-semibold mb-2">
<SupportAgentIcon className="mr-2"/>
Contact
</div>

<div className="flex items-center text-sm">

<EmailIcon className="mr-2"/>

support@reclaim.com

</div>

</div>

<div>

<div className="font-semibold mb-2">
Policies
</div>

<div className="flex items-center text-sm mb-1">
<GavelIcon className="mr-2"/>
Terms of Service
</div>

<div className="flex items-center text-sm mb-1">
<PrivacyTipIcon className="mr-2"/>
Privacy Policy
</div>

<div className="flex items-center text-sm">
<HelpOutlineIcon className="mr-2"/>
FAQ
</div>

</div>

</div>

</footer>

</div>

)
}