import React, {useState} from 'react';

function App() {

    let [userData, setUserData] = useState({
        userEmail: "",
        firstName: "",
        lastName: "",
    })
    let [shareLink, setShareLink] = useState(null)

    function handleChange(event){
        const name = event.target.name; 
        let value = event.target.value;

        setUserData({
            ...userData,
            [name]: value,
        })
    }

    function handleSubmitEmail() {

        let data = {
            'email': userData.userEmail
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
            "email": userData.userEmail,
            "first_name": userData.firstName,
            "last_name": userData.lastName,

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
                console.log('Success set profile', data);
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
           setUserData({
                userEmail: "",
                firstName: "",
                lastName: "",
            })
        })
    }

  return (
    <>

        <label> First Name </label>
        <input
           name = "firstName" 
           value={userData.firstName} 
           onChange={handleChange}
        >
        </input>

        <label> Last Name: </label>
        <input
           name = "lastName" 
           value={userData.lastName} 
           onChange={handleChange}
        ></input>

       <br/>
       <br/>
       <label>Enter Email: </label>
        <input 
            name = "userEmail"
            value={userData.userEmail} 
            onChange={handleChange}>
        </input>
        <button onClick={() => handleSubmitEmail()}>Execute</button>
        <br></br>
        {shareLink ? <p>Share Link: {shareLink}</p>
        : <p> Enter Email</p>}

    </>
  );
}

export default App;
