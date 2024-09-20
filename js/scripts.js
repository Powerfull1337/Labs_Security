

const FILE_KEY = 'usersData';

//дефолт 256 хешування
function hashPassword(password) {
    return 'sha256$' + CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}


function loadData() {
    const data = localStorage.getItem(FILE_KEY);
    if (data) {
        const parsedData = JSON.parse(data);

        if (parsedData.ADMIN.password === '') {
            parsedData.ADMIN.password = hashPassword('123');
            saveData(parsedData);
        }
        return parsedData;
    } else {
        const initialData = {
            ADMIN: { password: hashPassword('123'), blocked: false, password_restrictions: false }
        };
        saveData(initialData);
        return initialData;
    }
}

// засейвити
function saveData(data) {
    localStorage.setItem(FILE_KEY, JSON.stringify(data));
}

let data = loadData();
let currentAction = '';

function authenticateUser() {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    console.log(`Username: ${username}`);
    console.log(`Input Password: ${password}`);

    if (data[username]) {
        const userInfo = data[username];
        console.log(`Stored Password Hash: ${userInfo.password}`);
        const hashedPassword = hashPassword(password);
        console.log(`Hashed Input Password: ${hashedPassword}`);

        if (userInfo.blocked) {
            showAlert('Користувач заблокований!', 'error');
        } else if (userInfo.password === hashedPassword) {
            addLog('Login', username);
            if (username === 'ADMIN') {
                showAdminMenu();
            } else {
                showUserMenu(username);
            }
        } else {
            showAlert('Неправильний пароль!', 'error');
        }
    } else {
        showAlert('Користувача не знайдено!', 'error');
    }
}

function showAdminMenu() {
    hideAllScreens();
    document.getElementById('admin-menu').classList.remove('hidden');
}

function showUserMenu(username) {
    hideAllScreens();
    document.getElementById('user-greeting').textContent = username;
    document.getElementById('user-menu').classList.remove('hidden');
}

function hideAllScreens() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-menu').classList.add('hidden');
    document.getElementById('user-menu').classList.add('hidden');
    document.getElementById('user-list').classList.add('hidden');
}

function changePassword() {
    showPasswordModal('Змінити пароль', 'change-password');
}

function viewUsers() {
    hideAllScreens();
    const userListDiv = document.getElementById('user-list-content');
    userListDiv.innerHTML = '<h2>Список користувачів:</h2>';

    Object.keys(data).forEach(username => {
        if (username !== 'ADMIN') {
            const status = data[username].blocked ? 'Заблоковано' : 'Активний';
            const restrictions = data[username].password_restrictions ? 'Обмеження включені' : 'Обмеження вимкнені';
            const userInfoStr = `${username} - ${status} - ${restrictions}`;
            userListDiv.innerHTML += `<p>${userInfoStr}</p>`;
        }
    });

    document.getElementById('user-list').classList.remove('hidden');
}

function addUser() {
    showUsernameModal('Додати користувача', 'add-user');
}

function blockUser() {
    showUsernameModal('Заблокувати користувача', 'block-user');
}

function unblockUser() {
    showUsernameModal('Розблокувати користувача', 'unblock-user');
}

function togglePasswordRestrictions() {
    showUsernameModal('Змінити обмеження пароля', 'toggle-restrictions');
}

function showPasswordModal(title, action) {
    document.getElementById('password-modal-title').textContent = title;
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    const username = document.getElementById('username-input').value;
    const user = data[username];

    if (user && user.password_restrictions) {
        document.getElementById('password-requirements').classList.remove('hidden');
    } else {
        document.getElementById('password-requirements').classList.add('hidden');
    }

    document.getElementById('password-modal').classList.remove('hidden');
}


function closePasswordModal() {
    document.getElementById('password-modal').classList.add('hidden');
}

function submitPasswordModal() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const username = document.getElementById('username-input').value;
    console.log(`Current Password: ${currentPassword}`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Confirm Password: ${confirmPassword}`);


    console.log(`Hashed Current Password: ${hashPassword(currentPassword)}`);
    console.log(`Hashed New Password: ${hashPassword(newPassword)}`);

    if (data[username] && data[username].password === hashPassword(currentPassword)) {
        if (newPassword === confirmPassword) {

            data[username].password = hashPassword(newPassword);
            saveData(data);
            addLog('Password Change', username);
            showAlert('Пароль успішно змінено!', 'success');
        } else {
            showAlert('Новий пароль і підтвердження не збігаються!', 'error');
        }
    } else {
        showAlert('Поточний пароль невірний!', 'error');
    }

    closePasswordModal();
}




function showUsernameModal(title, action) {
    document.getElementById('username-modal-title').textContent = title;
    document.getElementById('username-input-modal').value = '';
    currentAction = action;
    document.getElementById('username-modal').classList.remove('hidden');
}

function closeUsernameModal() {
    document.getElementById('username-modal').classList.add('hidden');
}

function submitUsernameModal() {
    const username = document.getElementById('username-input-modal').value;

    if (currentAction === 'add-user') {
        if (username && !data[username]) {
            data[username] = {
                password: hashPassword('123'),
                blocked: false,
                password_restrictions: false
            };
            saveData(data);
            showAlert(`Користувач ${username} успішно доданий!`, 'success');
        } else if (data[username]) {
            showAlert('Користувач з таким ім\'ям вже існує!', 'error');
        } else {
            showAlert('Ім\'я користувача не може бути порожнім!', 'error');
        }
    } else if (currentAction === 'block-user') {
        if (username && data[username] && username !== 'ADMIN') {
            data[username].blocked = true;
            saveData(data);
            showAlert(`Користувач ${username} заблокований!`, 'success');
        } else if (username === 'ADMIN') {
            showAlert('Неможливо заблокувати адміністратора!', 'error');
        } else {
            showAlert('Користувача не знайдено!', 'error');
        }
    } else if (currentAction === 'unblock-user') {
        if (username && data[username] && username !== 'ADMIN') {
            data[username].blocked = false;
            saveData(data);
            showAlert(`Користувач ${username} розблокований!`, 'success');
        } else if (username === 'ADMIN') {
            showAlert('Неможливо розблокувати адміністратора!', 'error');
        } else {
            showAlert('Користувача не знайдено!', 'error');
        }
    } else if (currentAction === 'toggle-restrictions') {
        if (username && data[username]) {
            data[username].password_restrictions = !data[username].password_restrictions;
            saveData(data);
            const status = data[username].password_restrictions ? 'включені' : 'вимкнені';
            showAlert(`Обмеження на паролі для ${username} ${status}!`, 'success');
        } else {
            showAlert('Користувача не знайдено!', 'error');
        }
    }

    closeUsernameModal();
}



function showAlert(message, type) {
    Swal.fire({
        text: message,
        icon: type,
        confirmButtonText: 'OK'
    });
}

function showLoginScreen() {
    hideAllScreens();
    document.getElementById('login-screen').classList.remove('hidden');
}

function logout() {
    hideAllScreens();
    showLoginScreen();
}


//для пароля
function checkPasswordStrength() {
    const password = document.getElementById('new-password').value;


    const lengthStatus = document.getElementById('length-status');
    const specialStatus = document.getElementById('special-status');
    const uppercaseStatus = document.getElementById('uppercase-status');


    if (password.length >= 8) {
        lengthStatus.classList.add('valid');
        lengthStatus.classList.remove('invalid');
    } else {
        lengthStatus.classList.add('invalid');
        lengthStatus.classList.remove('valid');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        specialStatus.classList.add('valid');
        specialStatus.classList.remove('invalid');
    } else {
        specialStatus.classList.add('invalid');
        specialStatus.classList.remove('valid');
    }


    if (/[A-Z]/.test(password)) {
        uppercaseStatus.classList.add('valid');
        uppercaseStatus.classList.remove('invalid');
    } else {
        uppercaseStatus.classList.add('invalid');
        uppercaseStatus.classList.remove('valid');
    }
}
