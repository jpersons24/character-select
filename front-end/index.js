// VARIABLES
const characterDiv = document.querySelector('#character-container')
const login = document.querySelector('#login-form')
const navBar = document.querySelector('#nav-bar')
const characterDisplay = document.querySelector('#character-display')
const charLi = document.querySelector('#create-character')
const itemLi = document.querySelector('#create-item')
const charForm = document.querySelector('#character-form')
const itemForm = document.querySelector('#item-form')
const availItems = document.querySelector('#available-items')
const inventoryList = document.querySelector('#inventory-list')
const charItems = document.querySelector('#current-items')
let itemId
let charId 
let allUsers
let loginName
let currentUser
let currentItem
let currentChar
let inventoryId

// FETCH REQUESTS
function deleteItemFromInven(id){
    fetch(`http://localhost:3000/inventories/${id}`,{
        method: 'DELETE'
    })
}

function inventories(){
    fetch('http://localhost:3000/inventories')
    .then(res => res.json())
    .then(data => {
        relationship(data)
    })
}

function addItemToInventory(data){
    fetch(`http://localhost:3000/inventories`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
    })
}

function deleteItem(itemId){
    fetch(`http://localhost:3000/items/${itemId}`,{
        method: 'DELETE'
    })
}

function deleteCharacter(characterId){
    console.log(characterId)
    fetch(`http://localhost:3000/characters/${characterId}`,{
        method: 'DELETE'
    })
}

function getUsers(){
    fetch(`http://localhost:3000/users`)
    .then(res => res.json())
    .then(data => {
        allUsers = data
    })
}

function createUser(data){
    fetch(`http://localhost:3000/users`, {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(user => {
        renderUserName(user)
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

function getAllItems() {
    fetch("http://localhost:3000/items")
    .then(res => res.json())
    .then(allItems => {
        renderItems(allItems)
    })
}

function getItem(itemId) {
    fetch(`http://localhost:3000/items/${itemId}`)
    .then(res => res.json())
    .then(item => {
        renderItem(item)
    })
}

// EVENT LISTENERS
login.addEventListener('submit', handleLogin)
characterDiv.addEventListener('click', handleCharacterSelect)
charLi.addEventListener('click', displayCharForm)
charForm.addEventListener('submit', createCharacter)
itemLi.addEventListener('click', displayItemForm)
itemForm.addEventListener('submit', createItem)
availItems.addEventListener('click', handleItemSelect)
charItems.addEventListener('click', handleCharItemClick)

// EVENT HANDLERS 
function handleLogin(event){
    event.preventDefault()
    displayAll()
    loginName = event.target.name.value
    checkUser(allUsers)
    event.target.reset()
}


function handleCharacterSelect(event){
    if (event.target.matches('p')) {
        charId = event.target.dataset.id 
        getCharacter(charId)
        // renderCharItems()
    }  
}

function handleItemSelect(event){
    if (event.target.matches('p')) {
        itemId = event.target.dataset.id
        currentItem = event.target.textContent
        getItem(itemId)
    }
}

function displayCharForm(event) {
    if(charForm.style.display === "none") {
        charForm.style.display = "block"
    } else {
        charForm.style.display = "none"
    }
}

function displayItemForm(event) {
    if(itemForm.style.display === "none") {
        itemForm.style.display = "block"
    } else {
        itemForm.style.display = "none"
    }
}

function createCharacter(event){
    event.preventDefault()
    data = {
        user_id: currentUser.id,
        name: event.target.name.value,
        image_url: event.target.image.value,
        hp: 100,
        ap: 50,
        dp: 50
    }

    fetch("http://localhost:3000/characters", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(char => {
        characterDiv.innerHTML += 
            `<p data-id="${char.id}">${char.name}</p>`
    })
    event.target.reset()
    charForm.style.display = "none"
}

function createItem(event) {
    event.preventDefault()
    data = {
        name: event.target.name.value,
        description: event.target.description.value,
        points: 5,
        image_url: event.target.image.value 
    }

    fetch("http://localhost:3000/items", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(item => {
        availItems.innerHTML += 
            `<p class="padding" data-id="${item.id}">${item.name}</p>`
    })
    event.target.reset()
    itemForm.style.display = "none"
}

function addItemHandler(event){
    data = {
        item_id: itemId,
        character_id: charId
    }
    addItemToInventory(data)
    renderNewItem(data)
}

function handleCharDelete(event) {
    const selectChar = document.querySelector(`#character-container p[data-id="${charId}`)
    selectChar.remove()
    characterDisplay.innerHTML = '<h3>Character Name</h3>'
    deleteCharacter(charId)
}

function handleItemDelete(event) {
    const selectItem = document.querySelector(`#available-items p[data-id="${itemId}`)
    selectItem.remove()
    characterDisplay.innerHTML = '<h3>Character Name</h3>'
    deleteItem(itemId)
}



function handleCharItemClick(event) {
    if (event.target.matches('button')) {
        itemId = event.target.closest('li').dataset.id
        item = event.target.closest('li')
        item.remove()
        inventories()
    }
}



// HELPER FUNCTIONS


function displayAll() {
    characterDiv.style.display = 'inline'
    charLi.style.display = 'inline-block'
    itemLi.style.display = 'inline-block'
    charItems.style.display = 'inline'
    availItems.style.display = 'inline'
}


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

function relationship(data){
    data.forEach(obj => {
        if(obj.character_id == charId && obj.item_id == itemId){
            deleteItemFromInven(obj.id)
        } 
    })   
}


// RENDER FUNCTIONS
function renderUserName(user){
    let namePTag = document.createElement('p')
    namePTag.innerText = `User: ${user.name}`
    namePTag.className = "padding"
    navBar.append(namePTag)
    currentUser = user
    login.style.display = "none";
    getCharacters()
    getAllItems()
}

function renderCharacters(allChars) {
    allChars.forEach(char => {
        if (currentUser.id === char.user_id) {
            characterDiv.innerHTML += `<p class='padding' data-id="${char.id}">${char.name}</p>`
        }
    })
}

function renderCharacter(char) {
    characterDisplay.innerHTML = 
        `
        <h3>${char.name}</h3>
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img class="flip-card-image" src="${char.image_url}" alt="${char.name}" style="width:350px;height:290px;">
                </div>
                <div class="flip-card-back">
                    <p>Health: ${char.hp}</p>
                    <p>Attack: ${char.ap}</p>
                    <p>Defense: ${char.dp}</p>
                    <button class="delete-char" data-id=${char.id}>Delete</button>
                </div>
            </div>
        </div>    
        `
        const delBtn = document.querySelector('.delete-char')
        delBtn.addEventListener('click', handleCharDelete)
        renderCharItems(char.items)      
}

function renderItems(allItems) {
    allItems.forEach(item => {
        availItems.innerHTML += 
            `<p class='padding' data-id="${item.id}">${item.name}</p>`
    })
}

function renderItem(item) {
    characterDisplay.innerHTML =
        `
        <h3>${item.name}</h3>
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${item.image_url}" alt="${item.name}" style="width:350px;height:290px;">
                </div>
                <div class="flip-card-back">
                    <p>Description:</p> <br>
                    <p>${item.description}</p>
                    <p>Attribute Points: ${item.points}</p>
                    <button class="add-item" data-id="${item.id}">Add</button>
                    <button class="delete-item" data-id=${item.id}>Delete</button>
                </div>
            </div>
        </div>    
        `
        const addButton = document.querySelector('.add-item')
        addButton.addEventListener('click', addItemHandler)
        const delBtn = document.querySelector('.delete-item')
        delBtn.addEventListener('click', handleItemDelete)
}

function renderNewItem(data){
    const item = document.createElement('li')
    item.innerHTML = currentItem + '<button class="close" id="remove-inventory-item">X</button>'
    item.dataset.item = itemId
    item.dataset.char = charId
    inventoryList.appendChild(item) 
}

function renderCharItems(items) {
    inventoryList.innerHTML = ``
    items.forEach(item => {
        inventoryList.innerHTML += 
            `<li class="inventory-items" data-id="${item.id}">${item.name}<button class='close' id="remove-inventory-item">X</button></li>`
    })
}

// CALLING FETCH REQUESTS
getUsers()

