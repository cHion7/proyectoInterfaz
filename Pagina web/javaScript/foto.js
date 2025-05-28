const preview = document.getElementById('preview');
const upload = document.getElementById('upload');

// Al hacer clic en la imagen, activa el input
preview.addEventListener('click', () => {
    upload.click();
});

// Cuando se selecciona una imagen, actualiza la vista previa
upload.addEventListener('change', () => {
    const file = upload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});