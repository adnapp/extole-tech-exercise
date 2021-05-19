import React, {useState} from 'react';

function App() {

    let [userEmail, setUserEmail] = useState("")

    function handleSubmitEmail() {

        let data = {
            'email': userEmail
        }
        
        fetch('https://extole-api.extole.io/api/v5/token', {
            method: 'POST', // or 'PUT'
            headers: {
                "Accept": "Application/json",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('success got access token', data.access_token)
            handleSetProfile(data.access_token)
        })
    }

    function handleSetProfile(accessToken){

        let data = {
            "access_token": accessToken,
            "email": "user@extole.com",
        }

        fetch('https://extole-api.extole.io/api/v4/me', {
            method: 'POST', // or 'PUT'
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
        console.log(accessToken)
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
        })
    }

  return (
    <>

        <input 
            value={userEmail} 
            onChange={(e)=> setUserEmail(e.target.value)}>

        </input>
        <button onClick={() => handleSubmitEmail()}>Execute</button>


    </>
  );
}

export default App;
