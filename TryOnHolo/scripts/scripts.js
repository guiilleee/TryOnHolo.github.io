// Mostrar la sección correspondiente al hacer clic en un enlace de navegación
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    // Actualizar navegación activa
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');
}

// Añadir una prenda a la lista
function addClothingItem() {
    const prendaInput = document.getElementById('prendaInput').value;
    if (prendaInput.trim() !== "") {
        const li = document.createElement('li');
        li.textContent = prendaInput;
        
        // Agregar botón para eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add('btn');
        deleteBtn.style.margin = "0";
        deleteBtn.style.padding = "5px 10px";
        deleteBtn.style.fontSize = "0.8rem";
        deleteBtn.onclick = function() {
            li.remove();
            updateTryOnButton();
        };
        
        li.appendChild(deleteBtn);
        document.getElementById('prendasLista').appendChild(li);
        document.getElementById('prendaInput').value = "";
        
        updateTryOnButton();
    }
}

// Boton de probar prendas
function updateTryOnButton() {
    const hasPrendas = document.getElementById('prendasLista').children.length > 0;
    document.getElementById('tryOnButton').style.display = hasPrendas ? 'block' : 'none';
}


function goToTryOn() {
    showSection('holograma');
    alert('¡Selecciona o crea tu holograma para probar las prendas!');
}

//funcion para crear el holograma
function tryOnClothes() {
    // Simulación de procesamiento
    const altura = document.getElementById('altura').value;
    const peso = document.getElementById('peso').value;
    
    if (!altura || !peso) {
        alert('Por favor, completa al menos la altura y el peso para continuar.');
        return;
    }
    
    alert('¡Holograma creado correctamente! Ahora puedes añadir prendas para probar.');
    showSection('prendas');
}


// Para la previsualización de imágenes
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Vista previa';
            
            preview.appendChild(img);
        }
        
        reader.readAsDataURL(file);
    }
});