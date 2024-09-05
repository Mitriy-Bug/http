// TODO: write code here
const container = document.querySelector('.container');

const btnAddTicket = document.createElement('p');
btnAddTicket.classList.add('text-end','mb-3');
btnAddTicket.insertAdjacentHTML("afterbegin", '<button type="button" class="btn btnAddTicket">Добавить Тикет</button>');
container.appendChild(btnAddTicket);

//Добавляем новый Тикет
btnAddTicket.querySelector('.btnAddTicket').addEventListener('click', (btnAdd) => {
  console.log(btnAdd)
})

//Формируем список Тикетов
const allTickets = document.createElement('div');
allTickets.classList.add('allTickets');
container.appendChild(allTickets);
fetch('http://localhost:6060?method=allTickets')
  .then((response) => {
    //console.log(response)
    return response.json()
  })
  .then(data => {
    const options = {
      day: 'numeric', month: 'numeric', year: 'numeric', minute: 'numeric', hour: 'numeric'
    }
    data.forEach(element => {
      const checked = element.status === true? 'checked' : '';
      const elementDiv= document.createElement('div');
      elementDiv.classList.add('row', 'ticket-row');
      elementDiv.insertAdjacentHTML("beforeend", '<div class="col col-1"><input class="inputDone" type="checkbox" id="' + element.id + '" '+ checked +'></div>');
      elementDiv.insertAdjacentHTML("beforeend", '<div class="col col-6"><div class="ticketName cursor-pointer fw-bold">' + element.name + '</div><div class="ticketDescription mt-3 d-none">' + element.description + '</div></div>');
      elementDiv.insertAdjacentHTML("beforeend", '<div class="col col-3 text-end">' + new Date(element.created).toLocaleDateString('ru-RU', options) + '</div>');
      elementDiv.insertAdjacentHTML("beforeend", '<div class="col col-2 text-end"><button type="button" class="btn btnTicketEdit me-2"></button><button type="button" class="btn btnTicketRemove"></button>');
      allTickets.appendChild(elementDiv);
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
        fetch('http://localhost:6060?method=updateById&id='+input.target.id, {method: 'POST',body: JSON.stringify(newPost)})
      })
    })
  })
  .catch((err) => {
      console.log(err)
    }
  )


