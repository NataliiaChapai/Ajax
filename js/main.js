const jsBtn = document.getElementById('js');
const fetchBtn = document.getElementById('fetch');
const jsContainer = document.querySelector('.js');
const fetchContainer = document.querySelector('.fetch');
const loader = document.querySelector('.loader');
const BASE_URL = 'https://jsonplaceholder.typicode.com/users';
const ok = 200;
const del = -3;
let userId;
let value;
let editContainer;


jsBtn.addEventListener('click', onJsBtnClick);
fetchBtn.addEventListener('click', onfetchBtnClick);
loader.hidden = true;

function onJsBtnClick() {
    loader.hidden = false;
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onload = () => {
        if (request.status === ok) {
        let data = request.response;
            jsGetUsers(data);
            loader.hidden = true;
        } else {
            alert('Something went wrong')
        }
    } 
    request.open('get', BASE_URL);
    request.send();
}

function onfetchBtnClick() {
    loader.hidden = false;
    return fetch(`${BASE_URL}`).then(response => {
    if (response.ok) {
        loader.hidden = true;
        return response.json().then(users => fetchGetUsers(users));
    }
    throw new Error();
    })
    .catch(() => alert('Something went wrong'));
}

function jsGetUsers(users) {
    return users.map(user => jsContainer.insertAdjacentHTML('beforeend', jsRenderMarkup(user)));
}

function fetchGetUsers(users) {
    users.map(user => fetchContainer.insertAdjacentHTML('beforeend', featchRenderMarkup(user)));
    const editBtns = document.querySelectorAll('.edit');
    const deleteBtns = document.querySelectorAll('.delete');
    editBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', onEditBtnClick))
    deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', onDeleteBtnClick));
}

function jsRenderMarkup(user) {
    return `<li class="user">
        <p class="user-name">${user.name}</p>
    </li>`
}

function featchRenderMarkup(user) {
    return `<li id="${user.id}user">
        <div class="user">
        <p id="${user.id}name" class="user-name">${user.name}</p>
        <div class="btns">
            <button id="${user.id}" class="btn edit">Edit</button>
            <button id="${user.id}del" class="btn delete">Delete</button>
        </div>
        <div id="${user.id}editor" class="edit-container"></div>
        </div>
    </li>`    
}

function onEditBtnClick(event) {
    userId = event.target.id;
    editContainer = document.getElementById(`${userId}editor`);
    editContainer.innerHTML = `<input id="${userId}input" type="text" class="input">
        <button id="${userId}btn" class="btn">Save</button>`;
    const input = document.getElementById(`${userId}input`);
    input.addEventListener('input', onInput);
}

function onInput(event) {
    value = event.target.value;
    const saveBtn = document.getElementById(`${userId}btn`);
    saveBtn.addEventListener('click', onSaveBtnClick)
}

function onSaveBtnClick() {
    editContainer.innerHTML = '';
    loader.hidden = false;
    return fetch(`${BASE_URL}/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then((response) => response.json())
    .then(({name}) => {
        loader.hidden = true;
        const editName = document.getElementById(`${userId}name`);
        editName.textContent = name;
    })
}

function onDeleteBtnClick(event) {
    loader.hidden = false;
    const userId = event.target.id.slice(0, del);
    return fetch(`${BASE_URL}/${userId}`, {
        method: 'DELETE'
    })
    .then((response) => response.json())
    .then(() => {
        loader.hidden = true;
        alert(`User with id – ${userId} was deleted`);
        if (alert) {
        const item = document.getElementById(`${userId}user`);
            item.innerHTML = '';
        }
    })
}