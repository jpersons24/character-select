// variables
const characterDiv = document.querySelector('#character-container')
const login = document.querySelector('#login-form')
const navBar = document.querySelector('#nav-bar')
const characterDisplay = document.querySelector('#character-display')
let charId 
let allUsers
let loginName
let currentUser

// fetch
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

function getCharacters() {
    fetch("http://localhost:3000/characters")
    .then(res => res.json())
    .then(allChars => {
        renderCharacters(allChars)
    })
}

function getCharacter(id){
    fetch(`http://localhost:3000/characters/${id}`)
    .then(res => res.json())
    .then(char => {
        renderCharacter(char)
    })
}



// event listeners
login.addEventListener('submit', handleLogin)
characterDiv.addEventListener('click', handleCharacterSelect)

//Event Handlers 
function handleLogin(event){
    event.preventDefault()
    loginName = event.target.name.value
    checkUser(allUsers)
    event.target.reset()
}

function handleCharacterSelect(event){
    if (event.target.matches('p')) {
        charId = event.target.dataset.id 
        getCharacter(charId)
    }  
}

//helper functions
function checkUser(allUsers){
    size = allUsers.length

    allUsers.forEach(user => {
        if(user.name === loginName){
            renderUserName(user)
        } else { size -= 1 }
    })

    if (size === 0) {
        data = { name: loginName }
        createUser(data)
    }
}

//Render function 
function renderUserName(user){
    let namePTag = document.createElement('p')
    namePTag.innerText = `User: ${user.name}`
    navBar.append(namePTag)
    currentUser = user
    login.style.display = "none";
    getCharacters()
}

function renderCharacters(allChars) {
    allChars.forEach(char => {
        if (currentUser.id === char.user_id) {
            characterDiv.innerHTML += `<p data-id="${char.id}">${char.name}</p>`
            
        }
    })
}

function renderCharacter(char) {
    console.log(characterDisplay)
    console.log(char)
    characterDisplay.innerHTML = 
        `
        <h3>${char.name}</h3>
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${char.image_url}" alt="${char.name}" style="width:300px;height:300px;">
                </div>
                <div class="flip-card-back">
                    <p>Health: ${char.hp}</p>
                    <p>Attack: ${char.ap}</p>
                    <p>Defense: ${char.dp}</p>
                </div>
            </div>
        </div>    
        `

}

//calling Fetch 
getUsers()