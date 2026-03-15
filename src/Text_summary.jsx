/* eslint-disable react-hooks/set-state-in-effect */
import { useState } from "react";
import axios from "axios"; 
import { useEffect } from "react";
import "./Text_summary.css"; 

function Text_summary(){
    const [text, settext] =  useState("");
    const [summary, setsummary] = useState(null);
    const [error, seterror] = useState("");
    const [limit, setlimit] =  useState(0);
    const limit_count = 5;

    const api_key = import.meta.env.VITE_API_KEY;

    //OpenAI
    //const api_url = "https://api.openai.com/v1/chat/completions";

    //OpenRouter
    //const api_url="https://openrouter.ai/api/v1/chat/completions";

    //Apyhub API
    const api_url = "https://api.apyhub.com/ai/summarize-text";

    useEffect(()=>{
        const saved_limit = localStorage.getItem("summarylimit");
        if(saved_limit){
            setlimit(Number(saved_limit));
        }
    },[])

    async function fetchSummary(e){
        e.preventDefault();

        if(limit >= limit_count){
            seterror("Daily summary limit reached. Please try again tomorrow.");
            console.log("Daily summary limit reached. Please try again tomorrow.");
            return;
        }

        if(text.trim() === ""){
            console.log("Enter or paste a text to summarize");
            seterror("Enter or paste a text to summarize");
            return;
        }

        try{
            const response = await axios.post(api_url,
                { text : text },
                {
                    headers : {
                        "apy-token" : api_key,
                        "Content-Type" : "application/json" 
                    }
                }
            );
            const result = response.data.data.summary;
            setsummary(result);
            setlimit(limit+1);
            const newlimit =  limit+1;
            setlimit(newlimit);
            localStorage.setItem("summarylimit",newlimit);
            console.log("Summary generated successfully");
            console.log("Limit : ",limit);
        }catch(err){
            console.log("Error : " , err);
            seterror("Failed to generate summary");
            setsummary(null);
            settext("");
        }
    }

    return(
        <>

            {error && (
                <div className="error">
                    <p className="err">{error}</p>
                </div>
            )}

            <div className="main">
                <div className="title">
                    <h1>SnapSummary</h1>
                    <p>“Your shortcut to smarter reading”</p>
                </div>
                <div>
                    <form onSubmit={fetchSummary}>
                        <textarea placeholder="Paste or enter the text you want to summarize....." 
                        onChange={(e) => {
                            settext(e.target.value);
                            seterror("");
                        }}></textarea>
                        <p className="limit">Limit : {limit}/{limit_count}</p>
                        <button type="submit">GENERATE SUMMARY</button>
                    </form>
                </div>

                {!error && summary && (
                    <div className="summary">
                        <h3>Summary : </h3>
                        <p className="summ">{summary}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Text_summary;