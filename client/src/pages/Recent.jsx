import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import {
  ArrowBack,
  Search,
  ShoppingCart,
  Check,
  SentimentDissatisfied,
  Email
} from "@mui/icons-material";

const RecentUpdates = () => {

const [matches,setMatches]=useState([]);
const [loading,setLoading]=useState(true);
const [loadingText,setLoadingText]=useState("Searching for matches...");
const [progress,setProgress]=useState(0);
const [emailStatus,setEmailStatus]=useState(null);

const user=auth.currentUser;
const navigate=useNavigate();

const [isDarkMode]=useState(()=>{
const storedTheme=localStorage.getItem("darkMode");
return storedTheme ? storedTheme==="true" : false;
});


useEffect(()=>{

if(!user){
navigate("/login");
return;
}

setLoading(true);
setProgress(0);

axios.get(`https://los-n-found.onrender.com/api/matches/${user.uid}`,{

onDownloadProgress:(progressEvent)=>{

const percentCompleted=Math.round(
(progressEvent.loaded*100)/(progressEvent.total || 100)
);

setProgress(percentCompleted);

}

})
.then((response)=>{

if(response.data && Array.isArray(response.data)){
setMatches(response.data);
}else{
setMatches([]);
}

})
.catch((error)=>{
console.error("Error fetching matches:",error);
setMatches([]);
})
.finally(()=>{
setLoading(false);
setProgress(100);
});

},[user,navigate]);


useEffect(()=>{

if(!loading) return;

const messages=[

"Searching database for potential matches...",
"Analyzing item descriptions...",
"Comparing with recently found items...",
"Calculating match probabilities...",
"Verifying results..."

];

let i=0;

const interval=setInterval(()=>{

i=(i+1)%messages.length;
setLoadingText(messages[i]);

},2000);

return ()=>clearInterval(interval);

},[loading]);


const handleSendEmail=async(ownerUid,itemDetails,title)=>{

setEmailStatus("sending");

try{

await axios.post("https://los-n-found.onrender.com/api/send-email",{

ownerUid,
senderEmail:user.email,
itemDetails,
title:`Potential Match: ${title}`,
message:`I believe this might be my lost item. Details: ${itemDetails}`

});

setEmailStatus("success");
setTimeout(()=>setEmailStatus(null),3000);

}
catch(error){

console.error("Error sending email:",error);
setEmailStatus("error");
setTimeout(()=>setEmailStatus(null),3000);

}

};


const darkClass=isDarkMode ? "dark" : "";


return(

<div className={`${darkClass} min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-emerald-50 to-white text-gray-900"} p-4`}>

<div className="max-w-4xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center mb-6">

<h1 className={`text-2xl font-bold flex items-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>

<Search className="mr-2 text-emerald-600"/>

Potential Matches

</h1>

<button
onClick={()=>navigate("/Home")}
className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
>

<ArrowBack className="mr-1"/>

Back to Home

</button>

</div>


{/* EMAIL STATUS */}

{emailStatus==="sending" && (

<div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-4 flex items-center">

<CircularProgress size={20} className="mr-2"/>

Sending email...

</div>

)}

{emailStatus==="success" && (

<div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center">

<Check className="mr-2"/>

Email sent successfully!

</div>

)}

{emailStatus==="error" && (

<div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center">

<SentimentDissatisfied className="mr-2"/>

Failed to send email

</div>

)}


{/* LOADING */}

{loading && (

<div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-md p-8`}>

<div className="text-center">

<CircularProgress
size={50}
className="text-emerald-600 mb-4"
thickness={4}
/>

<p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} animate-pulse`}>

{loadingText}

</p>

</div>

</div>

)}


{/* NO MATCHES */}

{!loading && matches.length===0 && (

<div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-md p-8 text-center`}>

<SentimentDissatisfied style={{fontSize:64}} className="mx-auto text-gray-400"/>

<h3 className="text-xl font-medium mt-4 mb-2">

No matches found

</h3>

<p className="text-gray-500">

We'll notify you when we find potential matches.

</p>

</div>

)}


{/* MATCH LIST */}

{!loading && matches.length>0 && (

<div className="space-y-6">

{matches.map(({lostItem,topMatches})=>(

<div
key={lostItem.id}
className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-md overflow-hidden`}
>

{/* LOST ITEM */}

<div className={`${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-emerald-50 border-emerald-100 text-gray-700"} p-4 border-b`}>

<h3 className="text-lg font-semibold flex items-center text-emerald-700">

<ShoppingCart className="mr-2"/>

Your Lost Item

</h3>

<p className="mt-1">

{lostItem.description}

</p>

{lostItem.imageUrl && (

<div className="mt-4 flex justify-center">

<img
src={lostItem.imageUrl}
alt="Lost item"
className="max-h-96 rounded-md border"
/>

</div>

)}

</div>


{/* MATCHES */}

<div className="p-4">

<h4 className="text-md font-medium mb-3 flex items-center">

<Check className="mr-2 text-green-600"/>

Potential Matches ({topMatches.length})

</h4>


{topMatches.map((match)=>(

<div
key={match.foundItem.id}
className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} p-3 border rounded-lg hover:border-emerald-300 transition mb-3`}
>

<p className="font-medium">

{match.foundItem.description}

</p>

{match.foundItem.imageUrl && (

<img
src={match.foundItem.imageUrl}
alt="Found item"
className="mt-2 rounded-md border"
/>

)}

<button
onClick={()=>handleSendEmail(
match.foundItem.userId,
lostItem.description,
lostItem.type
)}

className={`mt-3 w-full ${isDarkMode ? "bg-emerald-700 hover:bg-emerald-600" : "bg-emerald-600 hover:bg-emerald-700"} text-white py-2 rounded-md flex items-center justify-center`}
>

<Email className="mr-1"/>

Send Email

</button>

</div>

))}

</div>

</div>

))}

</div>

)}

</div>

</div>

)

};

export default RecentUpdates;