import React, {useState} from 'react';

function App() {

    let [userEmail, setUserEmail] = useState("")
    let [shareLink, setShareLink] = useState(null)

    function handleSubmitEmail() {

        let data = {
            'email': userEmail
        }
        
        fetch('https://extole-api.extole.io/api/v5/token', {
            method: 'POST', 
            headers: {
                "Accept": "Application/json",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.access_token) {
                console.log("Execution not successful: ",data.message)
            }else{
                console.log('success got access token', data.access_token)
                handleSetProfile(data.access_token)
            }
        })
    }

    function handleSetProfile(accessToken){

        let data = {
            "access_token": accessToken,
            "email": userEmail,
        }

        fetch('https://extole-api.extole.io/api/v4/me', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.status){
                console.log(data.message)
            }else{
                console.log('Success set profile');
                createShareLink(accessToken)
            }
        })
    }

    function createShareLink(accessToken){
        
        let data = {
            "label": "refer-a-friend"
        }

        fetch(`https://extole-api.extole.io/api/v6/me/shareables?access_token=${accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
           console.log("Share Link", data.link)
           setShareLink(data.link)
        })
    }

  return (
    <>

        <input 
            value={userEmail} 
            onChange={(e)=> setUserEmail(e.target.value)}>

        </input>
        <button onClick={() => handleSubmitEmail()}>Execute</button>
        <br></br>
        {shareLink ? <p>Share Link: {shareLink}</p>
        : <p> Enter Email</p>}


    </>
  );
}

export default App;
