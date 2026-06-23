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
  const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyY6MJFQFx_l4_0KTzhL1VfVlHqwVys2-o4DcDXO98ydEcOnJpU31kF6ZrRPT3lkhhjjA/exec'; 

  if (form) {
    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!URL_APPS_SCRIPT) {
      formMensaje.textContent = 'El envío todavía no está conectado al backend.';
      formMensaje.className = 'form-mensaje form-mensaje--info';
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    formMensaje.textContent = '';
    formMensaje.className = 'form-mensaje';

    try {
      const payload = {
        tipo: 'contacto',
        datos: {
          nombreApellido: form.nombreApellido.value,
          email: form.email.value,
          asunto: form.asunto.value,
          mensaje: form.mensaje.value
        }
      };

    const response = await fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const resultado = await response.json();

      if (!resultado.ok) {
        throw new Error(resultado.error || 'Error desconocido del servidor.');
      }

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
