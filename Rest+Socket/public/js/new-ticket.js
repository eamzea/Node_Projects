const currentTicketLbl = document.querySelector('span');
const createTicketBtn = document.querySelector('button');

async function getLastTicket() {
  const lastTicket = await fetch('/api/tickets/last').then(response => response.json());
  currentTicketLbl.innerText = lastTicket;
}

async function createTicket() {
  const newTicket = await fetch('/api/tickets', {
    method: 'POST',
  }).then(response => response.json());

  currentTicketLbl.innerText = newTicket.number;
}

createTicketBtn.addEventListener('click', createTicket)

getLastTicket()
