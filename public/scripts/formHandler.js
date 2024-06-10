document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register').addEventListener('submit', async function(event) {
      event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
      
      // Obtener los datos del formulario
      const formData = new FormData(this);
  
      try {
        const response = await fetch('/user/create', {
          method: 'POST',
          body: formData
        });
  
        const result = await response.json();
  
        // Manejar la respuesta del servidor
        if (response.ok) {
          // Éxito, hacer algo con la respuesta
          console.log(result);
          // Por ejemplo, redirigir a otra página o mostrar un mensaje de éxito
        } else {
          // Error, mostrar un mensaje de error
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    });
  });