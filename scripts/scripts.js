// Variables para gestión de usuarios
let currentUser = null;
// Variables para guardar las medidas del holograma
let userMedidas = null;
let selectedPrendas = [];


// Comprobar si hay un usuario en localStorage al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();
    loadResenas();
});

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
        
        // Crear un ID único para la prenda
        const prendaId = 'prenda_' + Date.now();
        
        // Guardar la prenda en el array
        const nuevaPrenda = {
            id: prendaId,
            nombre: prendaInput,
            // Podríamos añadir más datos como categoría, color, etc.
        };
        
        selectedPrendas.push(nuevaPrenda);
        
        // Crear elemento de la lista
        li.textContent = prendaInput;
        li.dataset.id = prendaId;
        
        // Agregar botón para eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add('btn');
        deleteBtn.style.margin = "0";
        deleteBtn.style.padding = "5px 10px";
        deleteBtn.style.fontSize = "0.8rem";
        deleteBtn.onclick = function() {
            // Eliminar del array
            selectedPrendas = selectedPrendas.filter(p => p.id !== prendaId);
            li.remove();
            updateTryOnButton();
            updatePrendasDisplay();
        };
        
        li.appendChild(deleteBtn);
        document.getElementById('prendasLista').appendChild(li);
        document.getElementById('prendaInput').value = "";
        
        updateTryOnButton();
        updatePrendasDisplay();
    }
}

// Boton de probar prendas
function updateTryOnButton() {
    const hasPrendas = document.getElementById('prendasLista').children.length > 0;
    document.getElementById('tryOnButton').style.display = hasPrendas ? 'block' : 'none';
}

function goToTryOn() {
    showSection('mi-holograma');
}

//funcion para crear el holograma
function tryOnClothes() {
    // Verificar si hay usuario logueado
    if (!currentUser) {
        alert('Por favor, inicia sesión para crear tu holograma personal.');
        showAuthForm('login');
        return;
    }

    // Simulación de procesamiento
    const altura = document.getElementById('altura').value;
    const peso = document.getElementById('peso').value;
    const cintura = document.getElementById('cintura').value;
    const cadera = document.getElementById('cadera').value;
    
    if (!altura || !peso) {
        alert('Por favor, completa al menos la altura y el peso para continuar.');
        return;
    }
    
    // Guardar medidas
    userMedidas = {
        altura: parseFloat(altura),
        peso: parseFloat(peso),
        cintura: cintura ? parseFloat(cintura) : null,
        cadera: cadera ? parseFloat(cadera) : null,
        userId: currentUser.id
    };
    
    // Guardar en localStorage
    localStorage.setItem('tryOnHoloMedidas_' + currentUser.id, JSON.stringify(userMedidas));
    
    alert('¡Holograma creado correctamente! Ahora puedes añadir prendas para probar.');
    showSection('prendas');
    
    // Actualizar la visualización del holograma
    updateHologramaView();
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

// Funciones para la autenticación

// Mostrar el formulario de autenticación correspondiente
function showAuthForm(formType) {
    document.getElementById('auth-modal').style.display = 'flex';
    
    if (formType === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    } else {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    }
}

// Cerrar el formulario de autenticación
function closeAuthForm() {
    document.getElementById('auth-modal').style.display = 'none';
}

// Iniciar sesión
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // En una aplicación real, aquí se conectaría con el backend
    // Para esta versión, simularemos el inicio de sesión comprobando en localStorage
    const users = JSON.parse(localStorage.getItem('tryOnHoloUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        closeAuthForm();
        alert('¡Bienvenido de nuevo, ' + user.name + '!');
    } else {
        alert('Email o contraseña incorrectos');
    }
}

// Registro de nuevo usuario
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    // En una aplicación real, aquí se conectaría con el backend
    // Para esta versión, guardaremos el usuario en localStorage
    const users = JSON.parse(localStorage.getItem('tryOnHoloUsers') || '[]');
    
    // Comprobar si el email ya está registrado
    if (users.some(u => u.email === email)) {
        alert('Este email ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('tryOnHoloUsers', JSON.stringify(users));
    
    // Establecer como usuario actual
    setCurrentUser(newUser);
    closeAuthForm();
    alert('¡Registro completado! Bienvenido, ' + name);
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('tryOnHoloCurrentUser');
    currentUser = null;
    updateAuthUI();
    alert('Has cerrado sesión correctamente');
}

// Establecer usuario actual
function setCurrentUser(user) {
    // No guardamos la contraseña en la sesión por seguridad
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email
    };
    localStorage.setItem('tryOnHoloCurrentUser', JSON.stringify(userSession));
    currentUser = userSession;
    updateAuthUI();
    
    // Cargar medidas del usuario
    loadUserMedidas();
}

// Comprobar si hay sesión al cargar la página
function checkUserSession() {
    const userJson = localStorage.getItem('tryOnHoloCurrentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        updateAuthUI();
        
        // Cargar medidas del usuario
        loadUserMedidas();
    }
}

// Actualizar la interfaz según si hay usuario o no
function updateAuthUI() {
    if (currentUser) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('usernameDisplay').textContent = currentUser.name;
    } else {
        document.getElementById('authButtons').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
    }
}

// Función para visitar tiendas desde la sección de tiendas
function visitStore(url) {
    // En una aplicación real, podría abrir una ventana modal con un iframe
    // o redirigir a la URL con parámetros para volver
    const confirmVisit = confirm(`¿Deseas visitar ${url}? 
    Podrás seleccionar prendas para probar en tu holograma.`);
    
    if (confirmVisit) {
        // Abrimos en una nueva pestaña para no perder la sesión
        window.open(url, '_blank');
    }
}

// Cargar medidas del usuario actual si existen
function loadUserMedidas() {
    if (currentUser) {
        const savedMedidas = localStorage.getItem('tryOnHoloMedidas_' + currentUser.id);
        if (savedMedidas) {
            userMedidas = JSON.parse(savedMedidas);
            updateHologramaView();
        }
    }
}

// Actualizar la visualización del holograma en la sección "Mi Holograma"
function updateHologramaView() {
    const medidasDisplay = document.getElementById('medidasDisplay');
    
    if (!userMedidas) {
        medidasDisplay.innerHTML = '<p>Para ver tus medidas, primero crea tu holograma en la sección "Crear Holograma".</p>';
        return;
    }
    
    // Limpiar el contenedor de medidas
    medidasDisplay.innerHTML = '';
    
    // Crear elementos para mostrar las medidas
    const medidasItems = [
        { label: 'Altura', valor: userMedidas.altura + ' m' },
        { label: 'Peso', valor: userMedidas.peso + ' kg' }
    ];
    
    if (userMedidas.cintura) {
        medidasItems.push({ label: 'Cintura', valor: userMedidas.cintura + ' cm' });
    }
    
    if (userMedidas.cadera) {
        medidasItems.push({ label: 'Cadera', valor: userMedidas.cadera + ' cm' });
    }
    
    // Añadir los elementos al contenedor
    medidasItems.forEach(item => {
        const medidaItem = document.createElement('div');
        medidaItem.className = 'medida-item';
        
        const medidaLabel = document.createElement('span');
        medidaLabel.className = 'medida-label';
        medidaLabel.textContent = item.label;
        
        const medidaValor = document.createElement('span');
        medidaValor.className = 'medida-valor';
        medidaValor.textContent = item.valor;
        
        medidaItem.appendChild(medidaLabel);
        medidaItem.appendChild(medidaValor);
        medidasDisplay.appendChild(medidaItem);
    });
    
    // Simular carga de silueta
    const hologramaImage = document.getElementById('hologramaImage');
    // Aquí podrías cargar una imagen diferente según las medidas
    // Por ahora usamos un placeholder, pero podrías personalizarlo
    hologramaImage.alt = `Silueta personalizada para ${currentUser.name}`;
}

// Actualizar la visualización de prendas seleccionadas
function updatePrendasDisplay() {
    const prendasContainer = document.getElementById('prendasSeleccionadas');
    
    if (selectedPrendas.length === 0) {
        prendasContainer.innerHTML = '<p>No has seleccionado ninguna prenda. Ve a la sección "Añadir Prendas" para seleccionar.</p>';
        return;
    }
    
    // Limpiar el contenedor
    prendasContainer.innerHTML = '';
    
    // Añadir tarjetas para cada prenda
    selectedPrendas.forEach(prenda => {
        const prendaCard = document.createElement('div');
        prendaCard.className = 'prenda-card';
        prendaCard.dataset.id = prenda.id;
        prendaCard.onclick = function() {
            togglePrendaSelection(this);
        };
        
        const prendaThumb = document.createElement('div');
        prendaThumb.className = 'prenda-thumb';
        
        const prendaImg = document.createElement('img');
        // Usamos un placeholder, pero aquí podrías cargar una imagen según el tipo de prenda
        prendaImg.src = '/api/placeholder/100/100';
        prendaImg.alt = prenda.nombre;
        
        const prendaName = document.createElement('div');
        prendaName.className = 'prenda-name';
        prendaName.textContent = prenda.nombre;
        
        prendaThumb.appendChild(prendaImg);
        prendaCard.appendChild(prendaThumb);
        prendaCard.appendChild(prendaName);
        prendasContainer.appendChild(prendaCard);
    });
}

// Seleccionar/deseleccionar prendas para prueba
function togglePrendaSelection(element) {
    element.classList.toggle('selected');
}

// Función para iniciar la prueba virtual
function startVirtualTryOn() {
    if (!userMedidas) {
        alert('Por favor, crea tu holograma antes de probar prendas.');
        showSection('holograma');
        return;
    }
    
    if (selectedPrendas.length === 0) {
        alert('Por favor, selecciona al menos una prenda para probar.');
        showSection('prendas');
        return;
    }

    alert('¡Prendas aplicadas al holograma!');

}

//Funcion para eliminar las prendas seleccionadas en el apartado de Mi Holograma tras clickar en el boton Reiniciar
function resetPrendas() {
    selectedPrendas = [];
    document.getElementById('prendasSeleccionadas').innerHTML = '<p>No has seleccionado ninguna prenda. Ve a la sección "Añadir Prendas" para seleccionar.</p>';
    updateTryOnButton();

    //Eliminar las prendas de la seccion de Añadir prendas
    const prendasLista = document.getElementById('prendasLista');
    while (prendasLista.firstChild) {
        prendasLista.removeChild(prendasLista.firstChild);
    }
    // Reiniciar el array de prendas
    selectedPrendas = [];
    // Actualizar la visualización de prendas
    updatePrendasDisplay();


    alert("Prendas reiniciadas. Puedes añadir nuevas prendas para probar.");
}


function resetPrendas() {
    selectedPrendas = [];
    document.getElementById('prendasSeleccionadas').innerHTML = '<p>No has seleccionado ninguna prenda. Ve a la sección "Añadir Prendas" para seleccionar.</p>';
    updateTryOnButton();

    //Eliminar las prendas de la seccion de Añadir prendas
    const prendasLista = document.getElementById('prendasLista');
    while (prendasLista.firstChild) {
        prendasLista.removeChild(prendasLista.firstChild);
    }
    // Reiniciar el array de prendas
    selectedPrendas = [];
    // Actualizar la visualización de prendas
    updatePrendasDisplay();


    alert("Prendas reiniciadas. Puedes añadir nuevas prendas para probar.");
}

// Funciones para la sección de Reseñas

// Establecer la valoración en estrellas
function setRating(rating) {
    currentRating = rating;
    document.getElementById('ratingValue').textContent = rating;
    
    // Actualizar estrellas visuales
    const stars = document.querySelectorAll('.stars-input .star');
    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'));
        if (starValue <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}


// Añadir reseñas precargadas
const resenasPrecargadas = [
    {
        id: 1001,
        userId: "user1",
        userName: "María González",
        rating: 5,
        title: "¡Increíble experiencia con TryOnHolo!",
        text: "Nunca había probado una aplicación de realidad aumentada tan precisa. La forma en que puedo ver la ropa en mi cuerpo antes de comprarla me ha ahorrado muchas devoluciones. Totalmente recomendado.",
        date: "2025-04-15T14:22:00.000Z",
        likes: 12,
        dislikes: 1
    },
    {
        id: 1002,
        userId: "user2",
        userName: "Carlos Ramírez",
        rating: 4,
        title: "Muy útil para compras online",
        text: "La app funciona muy bien en la mayoría de tiendas. Solo le quito una estrella porque con algunas marcas la precisión no es tan buena, pero en general es una herramienta fantástica para comprar ropa sin sorpresas.",
        date: "2025-04-10T09:15:00.000Z",
        likes: 8,
        dislikes: 0
    },
    {
        id: 1003,
        userId: "user3",
        userName: "Laura Martínez",
        rating: 5,
        title: "Revolucionario para comprar ropa",
        text: "Desde que uso TryOnHolo he reducido mis devoluciones a cero. La tecnología es impresionante y la interfaz súper intuitiva. No puedo imaginar comprar online sin esta herramienta ahora.",
        date: "2025-04-05T16:30:00.000Z",
        likes: 15,
        dislikes: 2
    },
    {
        id: 1004,
        userId: "user4",
        userName: "Roberto Sánchez",
        rating: 3,
        title: "Buena idea, pero necesita mejoras",
        text: "El concepto es genial, pero la app podría mejorar en cuanto a precisión con ciertas telas y estilos. A veces los colores no coinciden exactamente con el producto real. Espero que mejoren en futuras actualizaciones.",
        date: "2025-03-28T11:45:00.000Z",
        likes: 3,
        dislikes: 1
    },
    {
        id: 1005,
        userId: "user5",
        userName: "Elena Torres",
        rating: 5,
        title: "¡Adiós a las devoluciones!",
        text: "Como alguien que detesta devolver ropa, esta app ha sido un regalo del cielo. La precisión del ajuste y cómo se ve realmente la ropa en mí es casi perfecta. La recomiendo a todos mis amigos.",
        date: "2025-03-20T13:20:00.000Z",
        likes: 10,
        dislikes: 0
    }
];

// Enviar una reseña
function submitResena() {
    // Verificar si hay usuario logueado
    if (!currentUser) {
        alert('Por favor, inicia sesión para publicar una reseña.');
        showAuthForm('login');
        return;
    }
    
    const titulo = document.getElementById('resenaTitle').value;
    const texto = document.getElementById('resenaText').value;
    
    if (!titulo || !texto || currentRating === 0) {
        alert('Por favor, completa todos los campos y añade una valoración.');
        return;
    }
    
    // Crear objeto de reseña
    const nuevaResena = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        rating: currentRating,
        title: titulo,
        text: texto,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0
    };
    
    // Guardar la reseña en localStorage
    let resenas = JSON.parse(localStorage.getItem('tryOnHoloResenas') || '[]');
    resenas.push(nuevaResena);
    localStorage.setItem('tryOnHoloResenas', JSON.stringify(resenas));
    
    // Restablecer el formulario
    document.getElementById('resenaTitle').value = '';
    document.getElementById('resenaText').value = '';
    setRating(0);
    
    // Actualizar la lista de reseñas
    loadResenas();
    
    alert('Tu reseña ha sido publicada. ¡Gracias por compartir tu experiencia!');
}

// Inicializar el localStorage con reseñas precargadas si no existe
function initResenas() {
    // Verificar si ya se inicializaron las reseñas
    if (!localStorage.getItem('resenasInitialized')) {
        // Guardar las reseñas precargadas en localStorage
        localStorage.setItem('tryOnHoloResenas', JSON.stringify(resenasPrecargadas));
        // Marcar que ya se inicializaron
        localStorage.setItem('resenasInitialized', 'true');
        console.log('Reseñas precargadas inicializadas correctamente');
    }
}

// Cargar las reseñas desde localStorage
function loadResenas() {
    const resenasContainer = document.getElementById('resenasContainer');
    let resenas = JSON.parse(localStorage.getItem('tryOnHoloResenas') || '[]');
    
    // Si no hay reseñas (lo que no debería ocurrir después de la inicialización)
    if (resenas.length === 0) {
        // Como respaldo, usar las precargadas directamente
        resenas = [...resenasPrecargadas];
        localStorage.setItem('tryOnHoloResenas', JSON.stringify(resenas));
        console.log('Se cargaron reseñas precargadas como respaldo');
    }
    
    if (resenas.length === 0) {
        resenasContainer.innerHTML = '<p class="no-resenas">Todavía no hay reseñas. ¡Sé el primero en compartir tu experiencia!</p>';
        document.getElementById('ratingPromedio').textContent = '0.0';
        document.getElementById('totalResenas').textContent = '0 reseñas';
        
        // Restablecer barras de valoración
        document.querySelectorAll('.rating-bar-item .bar-filled').forEach(bar => {
            bar.style.width = '0%';
        });
        document.querySelectorAll('.rating-bar-item span:last-child').forEach(span => {
            span.textContent = '0%';
        });
        
        return;
    }
    
    // Calcular estadísticas
    let totalRating = 0;
    const ratingCounts = [0, 0, 0, 0, 0]; // Índice 0 para 1 estrella, etc.
    
    resenas.forEach(resena => {
        totalRating += resena.rating;
        ratingCounts[resena.rating - 1]++;
    });
    
    const averageRating = (totalRating / resenas.length).toFixed(1);
    document.getElementById('ratingPromedio').textContent = averageRating;
    document.getElementById('totalResenas').textContent = resenas.length + (resenas.length === 1 ? ' reseña' : ' reseñas');
    
    // Actualizar barras de valoración
    for (let i = 0; i < 5; i++) {
        const percentage = Math.round((ratingCounts[4 - i] / resenas.length) * 100);
        document.querySelectorAll('.rating-bar-item')[i].querySelector('.bar-filled').style.width = percentage + '%';
        document.querySelectorAll('.rating-bar-item')[i].querySelector('span:last-child').textContent = percentage + '%';
    }
    
    // Actualizar estrellas promedio
    const percentageFilled = (averageRating / 5) * 100;
    document.querySelector('.stars-filled').style.width = percentageFilled + '%';
    
    // Ordenar reseñas por fecha (más recientes primero)
    resenas.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limpiar contenedor
    resenasContainer.innerHTML = '';
    
    // Mostrar las reseñas
    resenas.forEach(resena => {
        const resenaElement = document.createElement('div');
        resenaElement.className = 'resena-item';
        
        // Formatear fecha
        const fecha = new Date(resena.date);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Crear estrellas HTML
        let estrellas = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= resena.rating) {
                estrellas += '<span class="star filled">★</span>';
            } else {
                estrellas += '<span class="star">★</span>';
            }
        }
        
        resenaElement.innerHTML = `
            <div class="resena-header">
                <div class="resena-user">
                    <div class="resena-avatar">${resena.userName.charAt(0).toUpperCase()}</div>
                    <div class="resena-name">${resena.userName}</div>
                </div>
                <div class="resena-date">${fechaFormateada}</div>
            </div>
            <div class="resena-rating">
                ${estrellas}
            </div>
            <h4 class="resena-title">${resena.title}</h4>
            <div class="resena-text">${resena.text}</div>
        `;
        
        resenasContainer.appendChild(resenaElement);
    });
}

// Función para establecer la clasificación de estrellas en el formulario
function setRating(rating) {
    currentRating = rating;
    document.getElementById('ratingValue').textContent = rating;
    
    // Actualizar estrellas en el formulario
    const stars = document.querySelectorAll('.stars-input .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Inicializar la variable de rating actual
let currentRating = 0;

// Cargar las reseñas al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    // Primero inicializar las reseñas precargadas
    initResenas();
    // Luego cargar todas las reseñas
    loadResenas();
});