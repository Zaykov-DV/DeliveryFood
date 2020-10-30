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
      { description, image, name, price  } = goods
  card.className = 'card'
  console.log(card)

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
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">${price} &#8381;</strong>
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
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
}

//search
const inputSearch = document.querySelector('.input-search')


init()