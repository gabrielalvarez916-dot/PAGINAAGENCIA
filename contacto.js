/* =========================================================
   INDÓMITA — LÓGICA DE LA PÁGINA CONTACTO
   Este archivo SOLO se usa en contacto.html
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('formContacto');
  const btnEnviar = document.getElementById('btnEnviarContacto');
  const formMensaje = document.getElementById('formMensajeContacto');

  /* IMPORTANTE: la URL de Apps Script se completa cuando armemos el backend.
     Por ahora el formulario valida pero no envía a ningún lado todavía. */
  const URL_APPS_SCRIPT = ''; // <-- ACÁ va la URL del Web App de Apps Script

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!URL_APPS_SCRIPT) {
        formMensaje.textContent = 'El envío todavía no está conectado al backend. Esta parte se completa en el siguiente paso del proyecto.';
        formMensaje.className = 'form-mensaje form-mensaje--info';
        return;
      }

      btnEnviar.disabled = true;
      btnEnviar.textContent = 'Enviando...';
      formMensaje.textContent = '';
      formMensaje.className = 'form-mensaje';

      try {
        const formData = new FormData(form);
        // El envío real a Apps Script se implementa acá cuando tengamos el backend.

        formMensaje.textContent = '¡Gracias por escribirnos! Te vamos a responder a la brevedad.';
        formMensaje.className = 'form-mensaje form-mensaje--exito';
        form.reset();
      } catch (error) {
        formMensaje.textContent = 'Hubo un problema al enviar tu mensaje. Probá de nuevo o escribinos directamente por mail.';
        formMensaje.className = 'form-mensaje form-mensaje--error';
      } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar mensaje';
      }
    });
  }

});
