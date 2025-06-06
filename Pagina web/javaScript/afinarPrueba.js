 // Mobile Menu Toggle
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
            const menu = document.querySelector('.mobile-menu');
            menu.classList.toggle('hidden');
        });

        // Funcionalidad para mostrar cuadros según situación
        function mostrarCuadro(idCuadroActivo) {
            const cuadros = document.querySelectorAll("#parteMedia .form-section");
            cuadros.forEach(cuadro => {
                cuadro.classList.add('hidden');
            });
            document.getElementById(idCuadroActivo).classList.remove('hidden');
        }

        document.getElementById('encontrate').addEventListener('change', (event) => {
            const valorSeleccionado = event.target.value;
            mostrarCuadro("ajustesCuadro" + valorSeleccionado);
        });
        
        // Función para modificar campos
        let activo = false;
        function modCampos() {
            const nombre = document.getElementById('nombres');
            const telefono = document.getElementById('telefono');
            const button = document.getElementById('cambiarDatos');
            
            if (!activo) {
                button.innerHTML = '<span>Guardar cambios</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                button.classList.remove('bg-primary');
                button.classList.add('bg-green-600');
                activo = true;
                nombre.disabled = false;
                telefono.disabled = false;
            } else {
                button.innerHTML = '<span>Cambiar datos</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                button.classList.remove('bg-green-600');
                button.classList.add('bg-primary');
                activo = false;
                nombre.disabled = true;
                telefono.disabled = true;
                
                // Toast notification
                crearToast('toast-success', 'Datos guardados correctamente');
            }
        }
        
        // Asignar evento al botón
        document.getElementById('cambiarDatos').addEventListener('click', modCampos);
        
        // Reiniciar cuestionario
        function reiniciarCuestionario() {
            const inputs = document.querySelectorAll("input, select");
            inputs.forEach(input => {
                if (input.type !== 'button' && input.type !== 'submit') {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        input.checked = false;
                    } else {
                        input.value = "";
                    }
                }
            });
            
            // Mostrar notificación
            crearToast('toast-success', 'Cuestionario reiniciado');
        }
        
        // Asignar evento al botón
        document.getElementById('reiniciarForm').addEventListener('click', reiniciarCuestionario);
        
        // Preview de imagen de perfil
        document.getElementById('upload').addEventListener('change', function(event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('preview').src = e.target.result;
                }
                reader.readAsDataURL(event.target.files[0]);
            }
        });
        
        // Función para crear toasts
        function crearToast(tipo, mensaje) {
            const toast = document.createElement('div');
            toast.className = `toast ${tipo}`;
            
            let icono = '';
            if (tipo === 'toast-success') {
                icono = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            } else {
                icono = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            }
            
            toast.innerHTML = `${icono} ${mensaje}`;
            document.getElementById('toasts').appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }