/* =========================================================
   INDÓMITA — LÓGICA DE LA PÁGINA MANUSCRITOS
   Este archivo SOLO se usa en manuscritos.html
   ========================================================= */
/**
 * Convierte un archivo (File) a string base64, sin el prefijo
 * "data:tipo/mime;base64," que agrega el navegador.
 */
function convertirArchivoABase64(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result.split(',')[1]);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('formManuscrito');
  const radiosObraPublicada = document.querySelectorAll('input[name="obraPublicada"]');
  const grupoObraDetalle = document.getElementById('grupoObraDetalle');
  const inputArchivo = document.getElementById('archivoManuscrito');
  const nombreArchivoEl = document.getElementById('nombreArchivo');
  const btnEnviar = document.getElementById('btnEnviar');
  const formMensaje = document.getElementById('formMensaje');

  /* ---------- Mostrar/ocultar "cuál obra publicada" ---------- */
  radiosObraPublicada.forEach(radio => {
    radio.addEventListener('change', (e) => {
      grupoObraDetalle.style.display = e.target.value === 'si' ? 'block' : 'none';
    });
  });

  /* ---------- Mostrar nombre del archivo elegido ---------- */
  if (inputArchivo) {
    inputArchivo.addEventListener('change', () => {
      if (inputArchivo.files.length > 0) {
        const archivo = inputArchivo.files[0];
        const tamanioMB = (archivo.size / (1024 * 1024)).toFixed(2);
        nombreArchivoEl.textContent = `${archivo.name} (${tamanioMB} MB)`;
      } else {
        nombreArchivoEl.textContent = '';
      }
    });
  }

  /* ---------- Envío del formulario ---------- */
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
    btnEnviar.textContent = 'Enviando, esto puede tardar algunos minutos...';
    formMensaje.textContent = '';
    formMensaje.className = 'form-mensaje';

    try {
      const archivo = inputArchivo.files[0];
      if (!archivo) {
        throw new Error('Falta adjuntar el archivo del manuscrito.');
      }

      // Convierte el archivo a base64 para poder mandarlo en el JSON.
      const base64 = await convertirArchivoABase64(archivo);

      const obraPublicadaInput = form.querySelector('input[name="obraPublicada"]:checked');

      const payload = {
        tipo: 'manuscrito',
        datos: {
          nombreApellido: form.nombreApellido.value,
          email: form.email.value,
          redes: form.redes.value,
          tituloManuscrito: form.tituloManuscrito.value,
          generoTropos: form.generoTropos.value,
          extension: form.extension.value,
          sinopsis: form.sinopsis.value,
          obraPublicada: obraPublicadaInput ? obraPublicadaInput.value : '',
          obraDetalle: form.obraDetalle.value
        },
        archivo: {
          nombre: archivo.name,
          mimeType: archivo.type,
          base64: base64
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

      formMensaje.textContent = '¡Gracias! Recibimos tu manuscrito y te vamos a contactar pronto.';
      formMensaje.className = 'form-mensaje form-mensaje--exito';
      form.reset();
      nombreArchivoEl.textContent = '';
      grupoObraDetalle.style.display = 'none';

    } catch (error) {
      formMensaje.textContent = 'Hubo un problema al enviar tu manuscrito. Probá de nuevo o escribinos por mail.';
      formMensaje.className = 'form-mensaje form-mensaje--error';
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar manuscrito';
    }
  });
  }

});
