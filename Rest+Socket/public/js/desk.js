const pendingLbl = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');
const lblCurrentTicket = document.querySelector('small');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('desk')) {
  window.location = 'index.html';
  throw new Error('Desk is required');
}

const deskNumber = searchParams.get('desk');
let workingTicket = null;
deskHeader.innerHTML = deskNumber;

function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    noMoreAlert.classList.remove('d-none');
    pendingLbl.classList.add('d-none');
  } else {
    noMoreAlert.classList.add('d-none');
    pendingLbl.classList.remove('d-none');
    pendingLbl.innerHTML = currentCount;
  }
}

async function loadInitialCount() {
  const pendingTickets = await fetch('/api/tickets/pending').then(response => response.json());

  checkTicketCount(pendingTickets.length);
}

async function getTicket() {
  await finishTicket()

  const { status, ticket, message } = await fetch(`/api/tickets/draw/${deskNumber}`).then(
    response => response.json(),
  );

  if (status === 'error') {
    lblCurrentTicket.innerHTML = message;
    return;
  }

  workingTicket = ticket;
  lblCurrentTicket.innerHTML = ticket.number;
}

async function finishTicket() {
  if (!workingTicket) {
    return;
  }
  const { status, message } = await fetch(`/api/tickets/done/${workingTicket.number}`, {
    method: 'PUT',
  }).then(response => response.json());

  if (status === 'ok') {
    workingTicket = null;
    lblCurrentTicket.innerHTML = 'Empty'
  }
}

function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = event => {
    const { type, payload } = JSON.parse(event.data);

    if (type !== 'on-ticket-count-changed') {
      return;
    }

    checkTicketCount(payload);
  };

  socket.onclose = event => {
    console.log('Connection closed');

    setTimeout(() => {
      console.log('retrying to connect');
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = event => {
    console.log('Connected');
  };
}

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);

loadInitialCount();
connectToWebSockets();
