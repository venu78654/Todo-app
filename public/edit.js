const editButtons = document.querySelectorAll('.Ebtn');

editButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      
      const todoId = event.target.getAttribute('data-id');
      const newtext = prompt('Enter updated text');
      
      axios.post('/update', { text: newtext, id: todoId })
        .then(function(response) {
          console.log(response.data);
          window.location.reload();
        })
        .catch(function(error) {
          console.error(error);
        });
    });
  });
<button data-id="${item._id}" class="Ebtn" >Edit</button>