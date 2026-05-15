// Funciones de ayuda para LocalStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}
function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

let modo = "login";
let token = "";
let role = "";

// CARGAR SESIÓN
window.onload = () => {
  const savedToken = localStorage.getItem("token");

  if (savedToken) {
    token = savedToken;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;

      formCard.style.display = "none";
      panel.style.display = "block";

      if (role === "admin") {
        adminPanel.style.display = "block";
      }
    } catch (e) {
      localStorage.removeItem("token");
    }
  }
};

// CAMBIAR MODO
function toggleModo() {
  if (modo === "login") {
    modo = "register";
    titulo.innerText = "Registro";
    roleSelect.style.display = "block";
  } else {
    modo = "login";
    titulo.innerText = "Login";
    roleSelect.style.display = "none";
  }
}

// 🔁 BOTÓN PRINCIPAL
function accion() {
  if (modo === "login") login();
  else register();
}

// 📝 REGISTRO
function register() {
  if (!username.value || !password.value) {
    alert("Usuario y contraseña son obligatorios");
    return;
  }

  const users = getUsers();
  const userExists = users.find(u => u.username === username.value);
  
  if (userExists) {
    alert("El usuario ya existe");
    return;
  }
  
  users.push({
    username: username.value,
    password: password.value,
    role: roleSelect.value
  });
  
  saveUsers(users);
  alert("Usuario registrado correctamente");
  toggleModo(); // volver a login
}

// 🔐 LOGIN
function login() {
  try {
    const users = getUsers();
    const user = users.find(u => u.username === username.value && u.password === password.value);
    
    if (!user) {
      // Si es el primer usuario en entrar y no hay base de datos, 
      // le permitiremos entrar por defecto si pone admin/admin (facilita pruebas)
      if (username.value === "admin" && password.value === "admin" && users.length === 0) {
        users.push({ username: "admin", password: "admin", role: "admin" });
        saveUsers(users);
        return login(); // reintentar
      }
      throw new Error("Credenciales inválidas. Regístrate primero.");
    }

    // Crear un token falso para mantener compatibilidad
    const payload = { username: user.username, role: user.role };
    token = "fakeHeader." + btoa(JSON.stringify(payload)) + ".fakeSignature";
    localStorage.setItem("token", token);

    role = user.role;

    formCard.style.display = "none";
    panel.style.display = "block";

    if (role === "admin") {
      adminPanel.style.display = "block";
    }

  } catch (error) {
    alert(error.message);
  }
}

// 📦 CREAR PRODUCTO
function crearProducto() {
  if (!title.value || !description.value || !price.value) {
    alert("Campos obligatorios");
    return;
  }

  const products = getProducts();
  products.push({
    _id: Date.now().toString(),
    title: title.value,
    description: description.value,
    price: Number(price.value)
  });
  
  saveProducts(products);
  alert("Producto creado");
  
  title.value = "";
  description.value = "";
  price.value = "";
  
  // Actualizar lista si está visible
  if (resultado.innerHTML !== "") {
    verProductos();
  }
}

// 👀 VER PRODUCTOS (versión completa y segura)
function verProductos() {
  try {
    const data = getProducts();
    resultado.innerHTML = ""; // Limpiar productos previos

    if (!data.length) {
      resultado.innerHTML = "<p>No hay productos</p>";
      return;
    }

    data.forEach(prod => {
      const div = document.createElement("div");
      div.classList.add("card-producto");

      div.innerHTML = `
        <h4>${prod.title}</h4>
        <p>${prod.description}</p>
        <span>$ ${prod.price}</span>
      `;

      // BOTÓN BORRAR solo para admin
      if (role === "admin") {
        const btnBorrar = document.createElement("button");
        btnBorrar.textContent = "Borrar";

        btnBorrar.addEventListener("click", () => {
          if (confirm(`¿Eliminar producto "${prod.title}"?`)) {
            try {
              const prodId = prod._id || prod.id;
              if (!prodId) throw new Error("Producto sin id");

              let products = getProducts();
              products = products.filter(p => (p._id || p.id) !== prodId);
              saveProducts(products);

              alert("Producto eliminado");
              verProductos(); // actualizar lista
            } catch (err) {
              alert("Error: " + err.message);
            }
          }
        });

        div.appendChild(btnBorrar);
      }

      resultado.appendChild(div);
    });

  } catch (error) {
    resultado.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
  }
}

// 🔓 LOGOUT
function logout() {
  token = "";
  role = "";

  localStorage.removeItem("token");

  panel.style.display = "none";
  formCard.style.display = "block";
  adminPanel.style.display = "none";

  resultado.innerHTML = "";
  
  // Limpiar campos
  username.value = "";
  password.value = "";
}