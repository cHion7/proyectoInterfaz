const firebaseConfig = ({
    apiKey: "AIzaSyDCi97vgUzaR-TXpFvmv5vMKG7cdm7vNhU",
    authDomain: "base-de-datos-del-tfg-1.firebaseapp.com",
    projectId: "base-de-datos-del-tfg-1",
    storageBucket: "base-de-datos-del-tfg-1.appspot.com",
    messagingSenderId: "322269238228",
    appId: "1:322269238228:android:90de023599f3f7f7157c41",
     databaseURL: "https://base-de-datos-del-tfg-1-default-rtdb.europe-west1.firebasedatabase.app"
});
//este es el de firebase que cambia la contraseña en el authentification NO EN LA REAL TIME DATABSE

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert('Correo enviado. Revisa tu bandeja de entrada.');
    })
    .catch(error => {
      alert('Error: ' + error.message);
    });
});




// este usa emailjs para madar email lo poder usar y aprobecharlo para cuando haga login y alguna vez mas
emailjs.init("OXblKMh3Qmzf1P3Kj"); 

  const btn = document.getElementById('button');

  document.getElementById('form')
    .addEventListener('submit', function(event) {
      event.preventDefault();

      btn.value = 'Enviando...';

      const email = this.user_email.value;
      const recoveryLink = `https://tusitio.com/reset-password?email=${encodeURIComponent(email)}`;
      document.getElementById("recovery_link").value = recoveryLink;

      emailjs.sendForm("service_7r1r4hd", "template_5tg6acw", this)
        .then(() => {
          btn.value = 'Enviar enlace';
          alert('¡Correo enviado!');
        }, (err) => {
          console.error(err);
          btn.value = 'Enviar enlace';
          alert("Error al enviar: " + JSON.stringify(err));
        });
    });

