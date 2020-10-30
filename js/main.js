'use strict'
// ===  auth ==================

const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')

const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')

let login = localStorage.getItem('deliveryFood')

function toggleModalAuth () {
  modalAuth.classList.toggle('is-open')
  loginInput.style.borderColor = ''
}

// IF LOG IN
function authorized() {

  function logOut() {
    login = null
    localStorage.removeItem('deliveryFood')
    // обнуление
    buttonAuth.style.display = ''
    userName.style.display = ''
    buttonOut.style.display = ''
    buttonOut.removeEventListener('click', logOut)
    checkAuth()
  }

    console.log('Авторизован')

    userName.textContent = login

    buttonAuth.style.display = 'none'
    userName.style.display = 'inline'
    buttonOut.style.display = 'block'

    buttonOut.addEventListener('click', logOut)
}
// IF LOG OUT
function notAuthorized() {
  console.log('Не авторизован')
  function logIn (event) {
    event.preventDefault()
    // check for login field isn't empty
    if (login = loginInput.value.trim()) {
      // save user in localStorage
      localStorage.setItem('deliveryFood', login)

      toggleModalAuth()
      buttonAuth.removeEventListener('click', toggleModalAuth)
      closeAuth.removeEventListener('click', toggleModalAuth)
      logInForm.removeEventListener('submit', logIn)
      logInForm.reset()
      checkAuth()
    } else {
      //if login is empty
      loginInput.style.borderColor = '#ff0000'
    }
  }

    buttonAuth.addEventListener('click', toggleModalAuth)
    closeAuth.addEventListener('click', toggleModalAuth)
    logInForm.addEventListener('submit', logIn)
}
// check Authorization
function checkAuth() {
  if (login != null) {
    authorized()
  } else {
      notAuthorized()
    }
  }

checkAuth()
//==========================================

// render cards
const cardsRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.container-promo')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const cardsMenu = document.querySelector('.cards-menu')


// create card
function createCardRestaurant() {
  const card = `
		<a class="card card-restaurant">
		   <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
		   <div class="card-text">
			   <div class="card-heading">
				   <h3 class="card-title">Тануки</h3>
				   <span class="card-tag tag">60 мин</span>
			   </div>
			   <div class="card-info">
				   <div class="rating">
					   4.5
				   </div>
				   <div class="price">От 1 200 ₽</div>
				   <div class="category">Суши, роллы</div>
			   </div>
		   </div>
		</a>
  `
  // add card in the end of all cards
  cardsRestaurants.insertAdjacentHTML('beforeend', card)
}

createCardRestaurant()
createCardRestaurant()
createCardRestaurant()

//card
function createCardGood() {
  const card = document.createElement('div')
  card.className = 'card'
  console.log(card)

  card.insertAdjacentHTML('beforeend', `
		<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">Пицца Классика</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">510 ₽</strong>
			</div>
		</div>
  `)

  cardsMenu.insertAdjacentElement('beforeend', card)
}

// open card with goods
function openGoods(event) {
  const target = event.target

  const restaurant = target.closest('.card-restaurant')

  if (restaurant) {
    containerPromo.classList.add('hide')
    restaurants.classList.add('hide')
    menu.classList.remove('hide')
    //reset menu
    cardsMenu.textContent = ''
    //create menu
    createCardGood()
    createCardGood()
    createCardGood()
  }
}

cardsRestaurants.addEventListener('click', openGoods)


// logo
const logo = document.querySelector('.logo')
logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
} )



