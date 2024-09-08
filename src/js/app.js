// TODO: write code here
const container = document.querySelector('.container');
const modal = document.querySelector('.modal');
const url = 'http://localhost:6060';

const btnAddTicket = document.createElement('button');
btnAddTicket.classList.add('btn','btnAddTicket');
btnAddTicket.innerHTML = 'Добавить Тикет';
btnAddTicket.addEventListener('click', () => {
  modal.insertAdjacentHTML("afterbegin", `
  <h3 class="text-center mb-3 fw-bold">
    Добавить тикет
  </h3>
  <form class="formAddTicket">
    <div class="form-group mb-3"><label>Краткое описание</label><br><input type="text" name="ticketName" required></div>
    <div class="form-group mb-3"><label>Подробное описание</label><br><textarea name="ticketDescription"></textarea></div>
    <p class="text-end"><button class="btn btn-close" type="button">Отмена</button>  <button class="btn" type="submit">Ok</button></p>
  </form>
  `);
  //Добавляем новый Тикет
  const formAddTicket = document.querySelector('.formAddTicket');
  formAddTicket.addEventListener('submit', (e) => {
    e.preventDefault();
    const  form = new FormData(formAddTicket)
    const newTicket = {
      id: null,
      status: false,
      name: form.get('ticketName'),
      description: form.get('ticketDescription'),
      created: Date.now(),
    }
    let response = fetch(url + '?method=createTicket', {
      method: 'POST',
      body: JSON.stringify(newTicket)
    });
    getTickets();
    modal.replaceChildren();
    modal.insertAdjacentHTML("beforeend", `
      <h3 class="text-center mb-3 fw-bold">
        Тикет успешно добавлен
      </h3>
        <p class="text-end"><button class="btn btn-close" type="button">Закрыть окно</button></p>
      </form>
    `);
    formAddTicket.reset();
    closeModal();
  })
  closeModal();
  modal.showModal();
})

const btnAddTicketmain = document.createElement('p');
btnAddTicketmain.classList.add('text-end','mb-3');
btnAddTicketmain.insertAdjacentElement("afterbegin", btnAddTicket);
container.appendChild(btnAddTicketmain);

//Формируем список Тикетов
const allTickets = document.createElement('div');
allTickets.classList.add('allTickets');
container.appendChild(allTickets);
getTickets();

function closeModal() {
  let btnClose = document.querySelector('.btn-close');
  if(btnClose){
    btnClose.addEventListener('click', () => {
      modal.close();
      modal.replaceChildren();
     })
  }
}
function getTickets() {
  fetch(url + '?method=allTickets')
    .then((response) => {
      return response.json()
    })
    .then(data => {
      const options = {
        day: 'numeric', month: 'numeric', year: 'numeric', minute: 'numeric', hour: 'numeric'
      }
      allTickets.replaceChildren(); //Удаляем все старые элементы
      data.forEach(element => {
        const checked = element.status === true? 'checked' : '';
        const elementDiv= document.createElement('div');
        elementDiv.classList.add('row', 'ticket-row');
        elementDiv.insertAdjacentHTML("beforeend", `
            <div class="col col-1"><input class="inputDone" type="checkbox" id="${element.id}" ${checked}></div>
            <div class="col col-6"><div class="ticketName cursor-pointer fw-bold">${element.name}</div><div class="ticketDescription mt-3 d-none">${element.description}</div></div>
            <div class="col col-3 text-end">${new Date(element.created).toLocaleDateString('ru-RU', options)}</div>
            <div class="col col-2 text-end"><button type="button" class="btn btnTicketEdit me-2"></button><button type="button" class="btn btnTicketRemove"></button>
            `);
        //elementDiv.insertAdjacentHTML("beforeend", '');
        //elementDiv.insertAdjacentHTML("beforeend", '');
        //elementDiv.insertAdjacentHTML("beforeend", '');
        allTickets.appendChild(elementDiv); //Добавляем новые Тикеты
      })

      const ticketsRow = allTickets.childNodes;
      let status = false;
      ticketsRow.forEach((element) => {
        //Показываем описание тикета по клику на Имя
        element.querySelector('.ticketName').addEventListener('click', () => {
          element.querySelector('.ticketDescription').classList.toggle('d-none');
        })
        //Ставим галочку - Выполнено
        element.querySelector('.inputDone').addEventListener('change', (input) => {
          if(input.target.checked){
            status = true;
          }
          const newPost = {
            status: status
          }
          fetch(url + '?method=updateById&id='+input.target.id, {method: 'POST',body: JSON.stringify(newPost)})
        })
        const id = element.querySelector('.inputDone').id;
        //Редактирование тикета
        element.querySelector('.btnTicketEdit').addEventListener('click', () => {

          fetch(url + '?method=ticketById&id='+id)
            .then((response) => {
              return response.json()
            })
            .then(data => {
              modal.replaceChildren();
              modal.insertAdjacentHTML("afterbegin", `
              <h3 class="text-center mb-3 fw-bold">
                Изменить тикет
              </h3>
              <form class="formEditTicket">
                <div class="form-group mb-3"><label>Краткое описание</label><br><input type="text" name="ticketName" required value="`+ data.name +`"></div>
                <div class="form-group mb-3"><label>Подробное описание</label><br><textarea name="ticketDescription">`+ data.description+`</textarea></div>
                <p class="text-end"><button class="btn btn-close" type="button">Отмена</button>  <button class="btn" type="submit">Ok</button></p>
              </form>
              `);
              closeModal();
              modal.showModal();
              //Редактируем тикет
              const formEditTicket = document.querySelector('.formEditTicket');
              formEditTicket.addEventListener('submit', (e) => {
                e.preventDefault();
                const  form = new FormData(formEditTicket)
                const body = {
                  name: form.get('ticketName'),
                  description: form.get('ticketDescription'),
                }
                fetch(url + '?method=updateById&id='+id, {method: 'POST',body: JSON.stringify(body)})
                getTickets();
                modal.close();
              })
            })
        })
        //Удаляем тикет
        const deleteTicket = element.querySelector('.btnTicketRemove');
        deleteTicket.addEventListener('click', (e) => {
          modal.replaceChildren();
          modal.insertAdjacentHTML("afterbegin", `
              <h3 class="text-center mb-3 fw-bold">
                Удалить тикет
              </h3>
              <p class="mb-3">Вы уверены, что хотите удалить тикет? Это действие не может быть отменено</p>
              <p class="text-end"><button class="btn btn-close" type="button">Отмена</button>  <button class="btn ticketRemove" type="submit">Ok</button></p>
              `);
          closeModal();
          modal.showModal();
          modal.querySelector('.ticketRemove').addEventListener('click', (e) => {
            fetch(url + '?method=deleteById&id='+id)
            getTickets();
            modal.replaceChildren();
            modal.insertAdjacentHTML("afterbegin", `
              <h3 class="text-center mb-3 fw-bold">
                Тикет удален
              </h3>
              <p class="text-end"><button class="btn btn-close" type="button">Закрыть окно</button></p>
              `);
            closeModal();
            modal.showModal();
          })
        })
      })
    })
    .catch((err) => {
        console.log(err)
      }
    )
}
