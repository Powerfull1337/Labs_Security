
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function generateCaptcha() {
  const captchaCanvas = document.getElementById('captcha-canvas');
  const ctx = captchaCanvas.getContext('2d');


  captchaCanvas.width = 200;
  captchaCanvas.height = 70;


  ctx.fillStyle = getRandomColor();
  ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);


  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height, 2, 2);
  }


  window.captchaText = generateRandomString(6);
  ctx.font = '40px Arial';
  ctx.fillStyle = getRandomColor();
  ctx.fillText(window.captchaText, 30, 50);


  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = getRandomColor();
    ctx.beginPath();
    ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
    ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
    ctx.stroke();
  }
}


function checkCaptcha() {
  const userInput = document.getElementById('captcha-input').value;
  if (userInput === window.captchaText) {
    showAlert('CAPTCHA перевірено успішно!', 'success');
    showLoginFields(); 
  } else {
    showAlert('Неправильна CAPTCHA, спробуйте ще раз!', 'error');
    generateCaptcha(); 
  }
}


function showLoginFields() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('captcha-container').classList.add('hidden'); 
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

generateCaptcha();
