function deleteitem(event) {
    if (event.target.classList.contains('Dbtn')) {
      const todoId = event.target.getAttribute('data-id');
      const confirmed = confirm('Do you really want to delete?');
      if (confirmed) {
        axios
          .post('/delete', { id: todoId })
          .then(function(response) {
            event.target.parentElement.parentElement.remove();
            
          })
          .catch(function(error) {
            console.error(error);
          });
      }
    }
  }