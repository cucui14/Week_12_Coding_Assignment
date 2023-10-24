//MOCK API added into a variable
const TODO_URL = 'https://652e0671f9afa8ef4b27f838.mockapi.io/api/v1/users';

//class load users to construct the user list, user's todo list and thir methods
class LoadUsers {
  //constructor for the api url and currently user todolist been displayed
  constructor() {
    this.users = TODO_URL + '/';
    this.currentUser = null;
  }
  //This method loads the list of users
  loadUsersList() {
    //get request takes api url and passes the data
    $.get(this.users, (users) => {
      //for let loop loops loops over users
      for (let user of users) {
        //div created for each user card with classes and width
        const divCard = document.createElement('div');
        divCard.classList.add('card', 'm-2');
        divCard.style.width = '9rem';
        //user image is created with classes and src atribute
        const avatar = document.createElement('img');
        avatar.classList.add('card-img-top');
        avatar.setAttribute('src', user.AvataR);
        //card div body created with classes
        const divBody = document.createElement('div');
        divBody.classList.add('card-body');
        //open list button created with classes, inner text, id with user's id, type as button and attributes to open modal
        const cardButton = document.createElement('button');
        cardButton.classList.add('btn', 'btn-info', 'm-2');
        cardButton.innerHTML = 'Open list';
        cardButton.setAttribute('id', user.id);
        cardButton.setAttribute('type', 'button');
        cardButton.setAttribute('data-bs-toggle', 'modal');
        cardButton.setAttribute('data-bs-target', '#listModal');
        //div to hold the edit and delete button created with classes and user id
        const userDelAddButtons = document.createElement('div');
        userDelAddButtons.classList.add('d-flex', 'justify-content-between');
        userDelAddButtons.setAttribute('id', user.id);
        //delete button created with clases and inner text
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'm-1');
        //edit button created with classes, inner text and attributes to toggle the modal
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'm-1');
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#listModal');
        editButton.innerHTML = 'Edit';
        //adding the edit and delete buttons to the userDelAddButtons div
        userDelAddButtons.append(editButton, deleteButton);
        //adding the user image, div body, edit and delete buttons div and the open list button to the user card
        divCard.append(avatar, divBody, userDelAddButtons, cardButton);
        //creating the card title for th user name with a class and innerhtml from the user name
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerHTML = user.name;
        //adding the card title to the div body
        divBody.append(cardTitle);
        //adding the user card to the div with id of users
        $('#users').append(divCard);
        //adds an event listener to the open list button, passes the even target id and does a get request using the id passed
        cardButton.addEventListener('click', (userCard) => {
          $.get(`${TODO_URL}/${userCard.target.id}/tasks/`, (data) => {
            //uses returned data and passes it to the openList method
            this.openList(data);
            //changes the currentUser variable to the id of the card the button open list was clicked on
            this.currentUser = userCard.target.id;
          });
        });
        //adds an event listener to the delete button
        deleteButton.addEventListener('click', (data) => {
          //passes data to deleteUser method
          this.deleteUser(data);
        });
        //addds and event listener to the edit button
        editButton.addEventListener('click', (data) => {
          //pases the data to the editUser method
          this.editUser(data);
        });
      }
    });
  }

  //open list method recieves data as an argument
  openList(data) {
    //changes content of the modal body to an empty string
    $('.modal-body').text('');
    //changes the title of the modal to Todo List
    $('#listModalLabel').text('Todo List');
    //creates an ul and adds a class
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');
    //for let loop loops through todo items
    for (let list of data) {
      //li is created with classes
      const listItem = document.createElement('li');
      listItem.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between'
      );
      //p tag created with the todo item added in the innerHTML
      const pItem = document.createElement('p');
      pItem.innerHTML = list.todo;
      //div created for the delete button with classes and attributes for the todo item id and user id
      const buttonsDiv = document.createElement('div');
      buttonsDiv.classList.add('d-flex');
      buttonsDiv.setAttribute('id', list.id);
      buttonsDiv.setAttribute('data-userid', list.userId);
      //delete button created with classes and innerHTML as Delete
      const deleteListItem = document.createElement('button');
      deleteListItem.classList.add('btn', 'btn-danger', 'btn-sm');
      deleteListItem.innerHTML = 'Delete';
      //delete button added to div
      buttonsDiv.append(deleteListItem);
      //p tag and div added to the li
      listItem.append(pItem, buttonsDiv);
      //li added to the ul
      listGroup.append(listItem);
      //ul added to the modal body
      $('.modal-body').append(listGroup);
      //adds event listener to the delete button
      deleteListItem.addEventListener('click', (data) => {
        //passes data to deleteItem method
        this.deleteItem(data);
      });
    }
    //runs addItemButton method which adds the input and add button at the bottom
    this.addItemButton();
  }

  //addItemButton method
  addItemButton() {
    //creates a div with a class
    const addDiv = document.createElement('div');
    addDiv.classList.add('input-group');
    //creates an put with classes and atributes for type of input and a placeholder
    const addInput = document.createElement('input');
    addInput.classList.add('form-control', 'new-item-input');
    addInput.setAttribute('type', 'text');
    addInput.setAttribute('placeholder', 'New Item');
    //creates a button with classes and innerHTML as ADD
    const addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn-primary', 'add-item-button');
    addButton.innerHTML = 'ADD';
    //adds the input and button to the div
    addDiv.append(addInput, addButton);
    //adds the div to the modal body
    $('.modal-body').append(addDiv);
    //executes the createNewItem method
    this.createNewItem();
  }

  //createNewItem method
  createNewItem() {
    //adds and event listener to the ADD button
    $('.add-item-button').on('click', () => {
      //takes the value of the input into a variable
      let newListItem = $('.new-item-input').val();
      //if input is empty it logs to the onsole
      if (newListItem === '') {
        console.log('Enter a todo item');
      } else {
        //if input not empty it changes the ul in the modal to empty
        $('.list-group').text('');
        //Does a post request with the current user and passes the input value as a todo
        $.post(`${TODO_URL}/${this.currentUser}/tasks`, {
          todo: `${$('.new-item-input').val()}`,
        })
          .then((task) => {
            //Does a get request with the current user
            $.get(`${TODO_URL}/${this.currentUser}/tasks/`, (data) => {
              //empties the ul and the input
              $('.list-group').text('');
              $('.new-item-input').val('');
              //executes the openList method
              this.openList(data);
            });
          })
          //catches any error passed through
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  //createNewUser method
  createNewUser() {
    //adds an event listener to th new user button
    $('#newUserButton').on('click', () => {
      //takes the value of the newUserInput Input and adds it to a varaible
      let newUser = $('#newUserInput').val();
      //if newUser input is epty it logs to the console
      if (newUser === '') {
        console.log('Please enter a name');
      } else {
        //else if newUser input is not empty it changes the innerHTML of the #users div to empty
        document.querySelector('#users').innerHTML = '';
        //sends a post request to the API and passes the newUse value as a name
        $.post(`${TODO_URL}`, {
          name: `${newUser}`,
        })
          //if successfull returns the data as json
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          //then creates a new LoadUsers instance and runs the loadUsersList method on it to load the users again
          .then(() => {
            let loadAllUsers = new LoadUsers();
            loadAllUsers.loadUsersList();
            //changes the newUserInput value to empty
            $('#newUserInput').val('');
          })
          //logs to the console any errors passed through
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  //deleteUser method
  deleteUser(data) {
    //sets the #users div innerHTML to empty
    document.querySelector('#users').innerHTML = '';
    //Does a fetch request to the API and passes the id of the targeted delete button and sends a DELETE method
    fetch(`${TODO_URL}/${data.target.parentNode.id}`, {
      method: 'DELETE',
    })
      //if okay it returns the data as json
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      //then it creats a new instanc of LoadUsers and runs the method LoadUsersList on it to load the users again
      .then(() => {
        let loadAllUsers = new LoadUsers();
        loadAllUsers.loadUsersList();
      })
      //logs to the console any errors passed through
      .catch((error) => {
        console.log(error);
      });
  }

  //deleteItem method
  deleteItem(data) {
    //Does a fetch request, passes the API url with the user id data attribute of the parentNode target and the id of the item targeted to delete. Sends a DELETE method
    fetch(
      `${TODO_URL}/${data.target.parentNode.getAttribute(
        'data-userid'
      )}/tasks/${data.target.parentNode.id}`,
      {
        method: 'DELETE',
      }
    )
      //if okay it returns the data as json
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      //does a get request for the users todo list. Sets the ul in the modal to empty and runs the openList method with the data passed
      .then(() => {
        $.get(`${TODO_URL}/${this.currentUser}/tasks/`, (data) => {
          $('.list-group').text('');
          this.openList(data);
        });
      })
      //logs to the console any error passed through
      .catch((error) => {
        console.log(error);
      });
  }

  //edituser method passes data as an argument
  editUser(data) {
    //sets the modal body to empty
    $('.modal-body').text('');
    //changes the title of the modal body to Change name
    $('#listModalLabel').text('Change name');
    //takes the id of the parentNode clicked on and adds it to a variable
    const editUserId = data.target.parentNode.id;
    //create a new div with classes
    const newNameDiv = document.createElement('div');
    newNameDiv.classList.add('d-flex', 'justify-content-between');
    //creates an input with attributes for type and placeholder
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Enter new name');
    //creates a button with classes, innerHTML as Save and an attribute to close the modal
    const saveName = document.createElement('button');
    saveName.classList.add('btn', 'btn-success', 'btn-sm', 'm-1');
    saveName.innerHTML = 'Save';
    saveName.setAttribute('data-bs-dismiss', 'modal');
    //Adds the input and save button to the div created
    newNameDiv.append(newInput, saveName);
    //adds the div to the modal body
    $('.modal-body').append(newNameDiv);
    //adds an event listener to the save button
    saveName.addEventListener('click', () => {
      //Does a fetch request to the API url and editUserId variable. Sends a method PUT and updates the name of the user to the value of the input
      fetch(`${TODO_URL}/${editUserId}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: newInput.value }),
      })
        //if okay it returns the data as json
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        //sets the #users div to empty, then loads the users by creating a new instance of LoadUsers and runs the method loadUsersList
        .then(() => {
          document.querySelector('#users').innerHTML = '';
          let loadAllUsers = new LoadUsers();
          loadAllUsers.loadUsersList();
        })
        //logs to the console any error passed through
        .catch((error) => {
          console.log(error);
        });
    });
  }
}

//creates a new intance of LoadUsers and runs the loadUsersList of it to load the users when the page loads
let loadAllUsers = new LoadUsers();
loadAllUsers.loadUsersList();
//creates a new instance of LoadUsers and runs teh createNewUset method to create the new uset input and add button when the page loads
let loadNewUserInput = new LoadUsers();
loadNewUserInput.createNewUser();
