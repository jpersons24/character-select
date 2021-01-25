const login = document.querySelector('#login-form')
const navBar = document.querySelector('#nav-bar')
let allUsers
let loginName

//fetch
function getUsers(){
    fetch(`http://localhost:3000/users`)
    .then(res => res.json())
    .then(data => {
        // data.forEach(checkUser)
        allUsers = data
    })
}

function createUser(data){
    fetch(`http://localhost:3000/users`, {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(data)
    })
}



// event listeners
login.addEventListener('submit', handleLogin)


//Event Handlers 
function handleLogin(event){
    event.preventDefault()
    loginName = event.target.name.value
    checkUser(allUsers)
    event.target.reset()
}

//helper functions
function checkUser(allUsers){
    size = allUsers.length
    

    allUsers.forEach(user => {
        if(user.name === loginName){
            renderUserName(user)
            console.log(user.name)
        } else {
            size -= 1
        }
    })
    if (size === 0) {
        data = {
            name: loginName
        }
        createUser(data)
    }
}

//Render function 
function renderUserName(user){
    let namePTag = document.createElement('p')
    namePTag.innerText = `User: ${user.name}`
    navBar.append(namePTag)
    login.style.display = "none";
}

//calling Fetch 
getUsers()