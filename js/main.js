'use strict'
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

function toggleModal() {
  modal.classList.toggle("is-open");
}
// ===  auth ==================

const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')

const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')

let login = localStorage.getItem('deliveryFood')

// basket
// key for local storage
const cart = JSON.parse(localStorage.getItem(`deliveryFood_${login}`)) || []

function saveCart() {
  localStorage.setItem(`deliveryFood_${login}`, JSON.stringify(cart))
}
function downloadCart() {
  if (localStorage.getItem(`deliveryFood_${login}`, JSON.stringify(cart))) {
    const data = JSON.parse(localStorage.getItem(`deliveryFood_${login}`))
    cart.push(...data)
  }
}

function toggleModalAuth () {
  modalAuth.classList.toggle('is-open')
  loginInput.style.borderColor = ''
}

// return menu when logout
function returnMainMenu () {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
}
// IF LOG IN
function authorized() {

  function logOut() {
    // reset login and store
    login = null
    cart.length = 0
    localStorage.removeItem('deliveryFood')
    // reset style
    buttonAuth.style.display = ''
    userName.style.display = ''
    buttonOut.style.display = ''
    cartButton.style.display = ''
    buttonOut.removeEventListener('click', logOut)
    checkAuth()
    returnMainMenu()
  }

    console.log('Авторизован')

    userName.textContent = login
    // change buttons
    buttonAuth.style.display = 'none'
    userName.style.display = 'inline'
    buttonOut.style.display = 'flex'
  // basket
    cartButton.style.display = 'flex'

    buttonOut.addEventListener('click', logOut)
}
// IF LOG OUT

function notAuthorized() {
  function logIn (event) {
    event.preventDefault()

    // check for login field isn't empty
    if (login = loginInput.value.trim()) {
      // save user in localStorage
      localStorage.setItem('deliveryFood', login)

      toggleModalAuth()
      downloadCart()
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


//==========================================

// render cards
const cardsRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.swiper-container')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const cardsMenu = document.querySelector('.cards-menu')

const restaurantTitle = document.querySelector('.restaurant-title')
const restaurantRating = document.querySelector('.rating')
const restaurantPrice = document.querySelector('.price')
const restaurantCategory = document.querySelector('.category')


// create card
function createCardRestaurant(restaurant) {
  // get items from json
  const { image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery } = restaurant
  // header info
  const cardRestaurant = document.createElement('a')
  cardRestaurant.className = 'card card-restaurant'
  cardRestaurant.products = products
  cardRestaurant.info = { kitchen, name, price, stars }

  const card = `
		   <img src="${image}" alt="image" class="card-image"/>
		   <div class="card-text">
			   <div class="card-heading">
				   <h3 class="card-title">${name}</h3>
				   <span class="card-tag tag">${timeOfDelivery}</span>
			   </div>
			   <div class="card-info">
				   <div class="rating">${stars}</div>
				   <div class="price">${price} &#8381;</div>
				   <div class="category">${kitchen}</div>
			   </div>
		   </div>
		</a>
  `
  // add card in the end of all cards
  cardRestaurant.insertAdjacentHTML('beforeend', card)
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant)

}

//card
function createCardGood(goods) {
  const card = document.createElement('div'),
      { description, image, name, price, id } = goods
  card.className = 'card'
  // card.id = id

  card.insertAdjacentHTML('beforeend', `
		<img src="${image}" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart" id="${id}">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price card-price-bold">${price} &#8381;</strong>
			</div>
		</div>
  `)

  cardsMenu.insertAdjacentElement('beforeend', card)
}

// open card with goods
function openGoods(event) {
  const target = event.target

  if (login) {
    const restaurant = target.closest('.card-restaurant')

    if (restaurant) {
      //reset menu
      cardsMenu.textContent = ''
      // reset css
      containerPromo.classList.add('hide')
      restaurants.classList.add('hide')
      menu.classList.remove('hide')
      // header info
      const { kitchen, name, price, stars, id } = restaurant.info
      restaurantTitle.textContent = name
      restaurantRating.textContent = stars
      restaurantPrice.textContent = `От ${price} ₽`
      restaurantCategory.textContent = kitchen
      //create menu
      getData(`./db/${restaurant.products}`)
          .then((data) => {
            data.forEach(createCardGood)
          })

    }
  } else {
    toggleModalAuth()
  }

}

// logo
const logo = document.querySelector('.logo')
logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
} )

//Slider
new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'cube',
  grabCursor: true,
  cubeEffect: {
    shadow: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
});


// json parser
const getData = async function (url) {

  const response = await fetch(url)
  // error
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`)
  }
  return await response.json()
}

// basket
  function addToCart (event) {
    const target = event.target
    const buttonAddToCart = target.closest('.button-add-cart')

    if (buttonAddToCart) {
      const card = target.closest('.card')
      const title = card.querySelector('.card-title').textContent
      const cost = card.querySelector('.card-price').textContent
      const id = buttonAddToCart.id

      const food = cart.find((item) => item.id === id)

      if (food) {
        food.count += 1
      } else {
        cart.push({
          title,
          cost,
          id,
          count: 1
        })
      }
      saveCart()
    }
  }

  // render basket
  const modalBody = document.querySelector('.modal-body')
  const modalPrice = document.querySelector('.modal-pricetag')
  function renderCart() {
    // reset
    modalBody.textContent = ''

    cart.forEach(function ({ id, title, cost, count }) {
      const itemCart = `
        <div class="food-row">
          <span class="food-name">${title}</span>
          <strong class="food-price">${cost}</strong>
          <div class="food-counter">
           <button class="counter-button counter-button-minus" data-id="${id}">-</button>
           <span class="counter">${count}</span>
           <button class="counter-button counter-button-plus" data-id="${id}">+</button>
          </div>
         </div>`

      modalBody.insertAdjacentHTML('beforeend', itemCart)
    } )

    const totalPrice = cart.reduce((result, item) => result + (parseFloat(item.cost) * item.count) , 0 )
    modalPrice.textContent = totalPrice + ' ₽'
    saveCart()
  }

  function changeCount(event) {
    const target = event.target

    if (target.classList.contains('counter-button')) {
      const food = cart.find((item) => item.id === target.dataset.id)
      if (target.classList.contains('counter-button-minus')) {
        food.count--
        if (food.count === 0) cart.splice(cart.indexOf(food), 1)
      }
      if (target.classList.contains('counter-button-plus')) food.count++
      renderCart()
    }

  }

  // clear
  const buttonClearCart = document.querySelector('.clear-cart')

// init project
function init () {
  // get data from db
  getData('./db/partners.json')
      .then((data) => {
        data.forEach(createCardRestaurant)
      })
  // check authorization
  checkAuth()
  // open goods
  cardsRestaurants.addEventListener('click', openGoods)
  // basket
  cardsMenu.addEventListener('click', addToCart )
  modalBody.addEventListener('click', changeCount)
  // clear basket
  buttonClearCart.addEventListener('click', function () {
    cart.length = 0
    renderCart()
  })
  //search
  inputSearch.addEventListener('keypress', function (event) {
    if (event.charCode === 13) {
      const value = event.target.value.trim()
      // check value is not empty
      if (!value) {
        event.target.style.backgroundColor = 'red'
        event.target.value = ""
        setTimeout(() => event.target.style.backgroundColor = '', 1500 )
        return
      }
      // get data from json
      getData('./db/partners.json')
          .then((data) => {
            return data.map(function (partner) {
              return partner.products
            })
          })
          .then((linksProduct) => {
            linksProduct.forEach(function (link) {
              getData(`./db/${link}`)
                  .then((data) => {
                    // filter results
                    const resultSearch = data.filter(function (item) {
                      const name = item.name.toLowerCase()
                      return name.includes(value.toLowerCase())
                    }
                    )
                    //resets
                    cardsMenu.textContent = ''
                    containerPromo.classList.add('hide')
                    restaurants.classList.add('hide')
                    menu.classList.remove('hide')
                    // results
                    restaurantTitle.textContent = 'Результат поиска'
                    restaurantRating.textContent = ""
                    restaurantPrice.textContent = ""
                    restaurantCategory.textContent = ""
                    // data
                    resultSearch.forEach(createCardGood)
                  })
            })
          })
    }
  })
  // modals
  cartButton.addEventListener("click", function (){
    renderCart()
    toggleModal()
  });
  close.addEventListener("click", toggleModal);
}

//search
const inputSearch = document.querySelector('.input-search')


init()