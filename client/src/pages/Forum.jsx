import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaReply, FaThumbsUp, FaRegComment, FaUserCircle } from "react-icons/fa";

const ForumPage = () => {

const navigate = useNavigate();

const [searchQuery,setSearchQuery]=useState("");
const [activePost,setActivePost]=useState(null);
const [newComment,setNewComment]=useState("");
const [isDarkMode,setIsDarkMode]=useState(false);

const [discussions,setDiscussions]=useState([
{
id:1,
title:"How to find a lost item?",
author:"Kevin",
date:"2 hours ago",
content:"I recently lost my wallet on campus. What are the best steps to take?",
replies:5,
likes:12,
comments:[
{ id:1, author:"Sarah", content:"Check campus security!", date:"1 hour ago", likes:3 },
{ id:2, author:"Mike", content:"Post on college groups too.", date:"45 mins ago", likes:5 }
]
},
{
id:2,
title:"Best ways to secure your valuables",
author:"Gopika",
date:"1 day ago",
content:"What are good methods to secure belongings?",
replies:3,
likes:8,
comments:[
{ id:1, author:"Alex", content:"Use trackers for keys!", date:"22 hours ago", likes:2 }
]
}
]);

useEffect(()=>{

const storedTheme=localStorage.getItem("darkMode");

setIsDarkMode(storedTheme==="true");

},[]);

const filteredDiscussions = discussions.filter(d =>
d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
d.content.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleAddComment=()=>{

if(!newComment.trim()) return;

const updated=discussions.map(d=>{

if(d.id===activePost){

return{

...d,
comments:[...d.comments,{
id:d.comments.length+1,
author:"You",
content:newComment,
date:"Just now",
likes:0
}],
replies:d.replies+1

};

}

return d;

});

setDiscussions(updated);

setNewComment("");

};

const handleLike=(postId,commentId=null)=>{

const updated=discussions.map(d=>{

if(d.id===postId){

if(commentId===null){

return {...d,likes:d.likes+1};

}

return{

...d,
comments:d.comments.map(c=>{

if(c.id===commentId){

return {...c,likes:c.likes+1};

}

return c;

})

};

}

return d;

});

setDiscussions(updated);

};

return(

<div className={`min-h-screen ${isDarkMode?"bg-gray-900 text-white":"bg-gradient-to-b from-emerald-50 to-white"} p-4`}>

<div className="max-w-4xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">

Community Forum

</h1>

<button

onClick={()=>navigate("/Home")}

className="text-emerald-600 hover:text-emerald-700 font-medium"

>

← Back to Home

</button>

</div>

{/* SEARCH */}

<div className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow p-6 mb-6`}>

<div className="flex gap-4">

<div className="relative flex-grow">

<FaSearch className="absolute left-3 top-3 text-gray-400"/>

<input

type="text"

placeholder="Search discussions..."

className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
isDarkMode?"bg-gray-700 border-gray-600":"border-gray-300"
}`}

value={searchQuery}

onChange={(e)=>setSearchQuery(e.target.value)}

/>

</div>

<button

className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"

onClick={()=>setActivePost("new")}

>

Create Post

</button>

</div>

</div>

{/* DISCUSSIONS LIST */}

{!activePost && (

<div className="space-y-4">

{filteredDiscussions.map(d=>(

<div

key={d.id}

onClick={()=>setActivePost(d.id)}

className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition`}

>

<h2 className="text-xl font-semibold">

{d.title}

</h2>

<p className="mt-2 text-gray-500">

{d.content}

</p>

<div className="flex justify-between mt-4 text-sm">

<div className="flex items-center">

<FaUserCircle className="mr-1"/>

{d.author}

</div>

<div className="flex space-x-4">

<span className="flex items-center">

<FaThumbsUp className="mr-1 text-emerald-600"/>

{d.likes}

</span>

<span className="flex items-center">

<FaRegComment className="mr-1 text-emerald-600"/>

{d.replies}

</span>

</div>

</div>

</div>

))}

</div>

)}

{/* POST VIEW */}

{activePost && activePost!=="new" && (

<div className={`${isDarkMode?"bg-gray-800":"bg-white"} rounded-xl shadow p-6`}>

<button

onClick={()=>setActivePost(null)}

className="text-emerald-600 hover:text-emerald-700 mb-4"

>

← Back

</button>

{discussions.filter(d=>d.id===activePost).map(d=>(

<div key={d.id}>

<h2 className="text-2xl font-bold mb-2">

{d.title}

</h2>

<p className="mb-6">

{d.content}

</p>

<button

onClick={()=>handleLike(d.id)}

className="flex items-center text-emerald-600"

>

<FaThumbsUp className="mr-1"/>

Like ({d.likes})

</button>

{/* COMMENTS */}

<div className="mt-6 space-y-4">

{d.comments.map(c=>(

<div key={c.id} className="border-l-4 border-emerald-400 pl-4">

<p className="font-medium">

{c.author}

</p>

<p>{c.content}</p>

<button

onClick={()=>handleLike(d.id,c.id)}

className="text-sm text-emerald-600"

>

Like ({c.likes})

</button>

</div>

))}

</div>

{/* ADD COMMENT */}

<div className="mt-6">

<textarea

rows="3"

className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
isDarkMode?"bg-gray-700 border-gray-600":"border-gray-300"
}`}

placeholder="Write your reply..."

value={newComment}

onChange={(e)=>setNewComment(e.target.value)}

/>

<button

onClick={handleAddComment}

className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"

>

<FaReply className="inline mr-1"/>

Post Comment

</button>

</div>

</div>

))}

</div>

)}

</div>

</div>

);

};

export default ForumPage;