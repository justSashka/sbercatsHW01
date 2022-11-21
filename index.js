const urlBase = 'http://sb-cats.herokuapp.com/api/2/justSashka';
const $wr = document.querySelector('[data-wr]');
const $addCatButton = document.querySelector('.header-button_addCat');
const $modalCloseButton = document.querySelector('.modal-close');
const $modalSubmitButton = document.querySelector('.modal-submit');
const $form = document.querySelector('.modal-form');
const $scmodal = document.querySelector('.modal-showCat');
const $cardShowButton = document.querySelector('.card-button_show');
const $sCHButton = document.querySelector('.saveCh');
// Add cat button functional (close and open modal)
$addCatButton.addEventListener('click', () =>
  document.querySelector('.modal-addCat-container').classList.toggle('hidden'),
);
$modalCloseButton.addEventListener('click', () =>
  document.querySelector('.modal-addCat-container').classList.toggle('hidden'),
);

// form submit
document.forms.add_cat.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());

  data.id = +data.id;
  data.rate = +data.rate;
  data.favourite = data.favourite === 'on';
  addCat(data);
  $wr.insertAdjacentHTML('beforeend', generateCardHTML(data));
});

// card buttons (delete or show)
$wr.addEventListener('click', (event) => {
  console.log(event.target.dataset.action);
  console.log(event.target);
  switch (event.target.dataset.action) {
    case 'delete': {
      const $cardWr = event.target.closest('[data-cardid]');
      const catId = $cardWr.dataset.cardid;
      $cardWr.remove();
      deleteCat(catId);
      break;
    }
    case 'show': {
      const $cardWr = event.target.closest('[data-cardid]');
      const catId = $cardWr.dataset.cardid;
      showCat(catId);
      document.querySelector('.modal-showCat').classList.toggle('hidden');
      break;
    }

    default:
      break;
  }
});

$scmodal.addEventListener('click', (event) => {
  console.log(event.target.dataset.action);
  console.log(event.target);
  switch (event.target.dataset.action) {
    case 'close': {
      document.querySelector('.modal-showCat').classList.toggle('hidden');
      $scmodal.innerHTML = '';
    }
    case 'edit': {
      document.querySelector('.showCat-modal_change-form').classList.toggle('hidden');
    }
    case 'schanges': {
      document.forms.change_cat.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        const changeBody = {};
        changeBody.favourite = data.scFavourite === 'on';
        changeBody.rate = data.scRating;
        changeBody.description = data.scDescr;
        changeBody.img_link = data.scCatPhoto;
        const catId = data.scId;
        changeCat(catId, changeBody);
      });
    }

    default:
      break;
  }
});

async function changeCat(id, data) {
  await fetch(`${urlBase}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  window.location.reload();
}

async function deleteCat(id) {
  const response = await fetch(`${urlBase}/delete/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

async function showCat(id) {
  await fetch(`${urlBase}/show/${id}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json.data);
      const postHTML = generateOneCatHTML(json.data);
      $scmodal.insertAdjacentHTML('afterbegin', postHTML);
    });
}

async function addCat(data) {
  const response = await fetch(`${urlBase}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (response.status != 200) {
    throw new Error();
  }
}

const generateOneCatHTML = (post) => {
  return `<div class="modal-showCat_catImg">
      <img class="show-cat_img" src="${
        post.img_link
      }" alt="Cat Photo" width="300px" height="300px"></div>
      <div class="modal-showCat_catID">Kitty ID: ${post.id}</div>
      <div class="modal-showCat_catName">Kitty Name: ${post.name}</div>
      <div class="modal-showCat_catFavor">Favourite: ${post.favourite ? 'Yes :)' : 'Nope :('}</div>
      <div class="modal-showCat_catRate">Kitty Rating: ${post.rate}</div>
      <div class="modal-showCat_catDescription">About Kitty: ${post.description}</div></div>
      <button class="modal-showCat_edit" data-action="edit" data-cardid = ${post.id}>Edit</button>
      <button class="modal-showCat_close" data-action="close" data-cardid = ${
        post.id
      }>Close</button>
      <div class="showCat-modal_change-form-container">
      <form action="" class="showCat-modal_change-form" name="change_cat">
      <label for="scId">Kitty Id: </label>
      <input type="number" name="scId" value=${post.id} readonly />
        <label for="scCatPhoto">Change Kitty Photo URL</label>
        <input type="text" name="scCatPhoto" id="" value = ${post.img_link} />
        <label for="scFavourite">Favourite kitty?</label>
        <input type="checkbox" name="scFavourite" id="" />
        <label for="scRating">Kitty Rate (0 - 10)</label>
        <input type="number" name="scRating" id="" min="0" max="10" value=${post.rate} />
        <label for="scDescr">About Kitty</label>
        <textarea  class="scAbout" type="text" name="scDescr">${post.description}</textarea>
        <button class = "saveCh" type="submit" data-action = "schanges">Save Changes</button>
      </form>
    </div>`;
};
const generateCardHTML = (post) => {
  return `<div class="card" data-cardid = ${post.id}>
  <div class="card-body">
    <img class="card-cat_img" src="${post.img_link}" alt="Cat Photo" width="300px" height="300px">
    <h5 class="card-cat_name">${post.name}</h5>
    <p class="card-cat_desc">${post.description}</p>
    <div class="card-button_container">
    <button class="card-button_show" data-action="show">Show</button>
  <button class="card-button_delete" data-action="delete">Delete</button>
  </div>
  </div>
  
</div>`;
};
async function generateHTML() {
  fetch('http://sb-cats.herokuapp.com/api/2/justSashka/show')
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      const postHTML = json.data.map((post) => generateCardHTML(post));
      $wr.insertAdjacentHTML('beforeend', postHTML.join(''));
    });
}
generateHTML();

const $addForm = document.forms.add_cat;
const rawDataFromLocalStorage = localStorage.getItem(document.forms.add_cat);
const formDataFromLS = rawDataFromLocalStorage ? JSON.parse(rawDataFromLocalStorage) : undefined;
if (formDataFromLS) {
  Object.keys(formDataFromLS).forEach((key) => {
    document.forms.add_cat[key].value = formDataFromLS[key];
  });
}
document.forms.add_cat.addEventListener('input', (e) => {
  const formDataObj = Object.fromEntries(new FormData(document.forms.add_cat).entries());
  console.log({ formDataObj });
  localStorage.setItem(document.forms.add_cat, JSON.stringify(formDataObj));
});
