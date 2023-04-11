const button = document.querySelector('#startButton')
const option = document.querySelectorAll('.option')

let selected = 0;
option[0].addEventListener('click', () => {
  selected = 0;
  option[0].style.boxShadow = '2px 2px 5px';
  option[0].style.scale = '0.9';
  option[1].style.boxShadow = '';
  option[1].style.scale = '1';
});

option[1].addEventListener('click', () => {
  selected = 1;
  option[1].style.boxShadow = '2px 2px 5px';
  option[1].style.scale = '0.9';
  option[0].style.boxShadow = '';
  option[0].style.scale = '1';
});

button.addEventListener('click', () => {
  if (selected == 1) {
    window.location = 'NeuralNetwork/neuralNetwork.html'
  } else {
    window.location = 'index.html';
  }
})
