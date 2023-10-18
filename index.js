const URL = 'https://652e0671f9afa8ef4b27f838.mockapi.io/api/v1/Routine';

$.get(URL, (data) => {
  //console.log(data);
  for (let user of data) {
    createCards(user);
  }
});

const createCards = (user) => {
  //console.log(user);
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'm-2');
  divCard.style.width = '18rem';
  const userImg = document.createElement('img');
  userImg.setAttribute(
    'src',
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR2v8jGQFEHwDE0bEIm2Sofs-0n5RUWyiNtY_JQw46IozVB-YPU'
  );
  userImg.classList.add('card-img-top');
  userImg.setAttribute('alt', 'dog');
  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  divCard.append(userImg, divCardBody);
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.innerHTML = user.username;
  const buttonSchedule = document.createElement('button');
  buttonSchedule.innerHTML = 'See Schedule';
  buttonSchedule.classList.add('btn', 'btn-primary');
  buttonSchedule.setAttribute('id', user.id);
  divCardBody.append(cardTitle, buttonSchedule);
  $('#userCards').append(divCard);
  buttonSchedule.addEventListener('click', (button) => {
    openSchedules(button.target.id);
  });
};

const openSchedules = (userId) => {
  //console.log(userId);
  $.get(URL, (data) => {
    document.querySelector('.week-grid').innerHTML = '';
    $('.card-title').removeClass('current-user');
    for (let user of data) {
      //console.log(user.id);
      if (user.id == userId) {
        //console.log(user.daysofweek);
        for (let day of user.daysofweek) {
          console.log(day.day);
          const weekGrid = $('.week-grid');
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('card', 'm-2');
          weekGrid.append(cardDiv);
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
          const listGroup = document.createElement('ul');
          listGroup.classList.add('list-group', 'list-group-flush');
          cardDiv.append(cardBody, listGroup);
          const cardTitle = document.createElement('h5');
          cardTitle.classList.add('card-title');
          cardTitle.innerHTML = day.day;
          cardBody.append(cardTitle);

          //console.log(day.reminders);
          for (let reminder of day.reminders) {
            console.log(reminder);
            const listItem = document.createElement('li');
            listItem.innerHTML = reminder.reminder;
            listItem.setAttribute('id', reminder.id);
            listItem.classList.add('list-group-item');
            listGroup.append(listItem);
          }
          const addItem = document.createElement('li');
          addItem.classList.add('list-group-item');
          const addInput = document.createElement('input', 'text');
          addInput.classList.add('form-control', 'mb-1');
          addInput.setAttribute('placeholder', 'New Item');
          const addButton = document.createElement('button');
          addButton.classList.add('btn', 'btn-info');
          addButton.innerHTML = 'ADD';
          listGroup.append(addItem);
          addItem.append(addInput, addButton);
        }
      }
    }
  });
};
