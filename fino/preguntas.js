

// Lógica de registro
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("formRegistro");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      let nombre = document.getElementById("nombre").value;
      let correo = document.getElementById("correo").value;
      let clave = document.getElementById("clave").value;

      localStorage.setItem("usuario", JSON.stringify({nombre, correo, clave}));

      document.getElementById("registro").style.display = "none";
      document.getElementById("menuGrados").style.display = "block";
    });
  }
});
