const menueURL = `https://galvanize-eats-api.herokuapp.com/menu`;
fetch(menueURL).then((menu) => {
    // console.log(menu.json);
    return menu.json();
  }).then((menuItem) => {
      // console.log(menuItem.menu[0].type, typeof(menuItem.menu[0].type));
      // console.log(menuItem);
      var burgerItems = [];
      var pizzaItems = [];
      var burgerPrice = [];
      var pizzaPrice = [];
      var allMenuItems = [];
      let selected = elClass(`selected`, 0);
      for (let i = 0; i < menuItem.menu.length; i++) {
        allMenuItems.push(menuItem.menu[i].name.split(` `).join(``));
      }
      // console.log(allMenuItems);
      for (let i = 0; i < menuItem.menu.length; i++) {
        if (menuItem.menu[i].type === `burger`) {
          burgerItems.push(menuItem.menu[i].name.split(` `).join(``));
          burgerPrice.push(menuItem.menu[i].price);
        }
        else if (menuItem.menu[i].type === `pizza`) {
          pizzaItems.push(menuItem.menu[i].name.split(` `).join(``));
          pizzaPrice.push(menuItem.menu[i].price);
        }
      }
      let foodType = [];
      for (let i = 0; i < menuItem.menu.length; i++) {
        if (foodType.indexOf(menuItem.menu[i].type) === -1) {
          foodType.push(menuItem.menu[i].type);
        }
      }
      for (let i = 0; i < foodType.length; i++) {
        newEl(`h1`, foodType[i], elId(`item_picker`), `id`, foodType[i]);
      }

      for (let i = 0; i < burgerItems.length; i++) {
        newEl(`section`, null, elId(`burger`), `id`, burgerItems[i]+`_area`);
        newAttribute(`class`, `burger_area`, elId(burgerItems[i]+`_area`));
        newEl(`h6`, burgerItems[i], elId(burgerItems[i]+`_area`), `id`, burgerItems[i]);
        newEl(`h6`, burgerPrice[i], elId(burgerItems[i]+`_area`), `id`, burgerPrice[i]);
      }

      for (let i = 0; i < pizzaItems.length; i++) {
        newEl(`section`, null, elId(`pizza`), `id`, pizzaItems[i]+`_area`);
        newAttribute(`class`, `pizza_area`, elId(pizzaItems[i]+`_area`));
        newEl(`h6`, pizzaItems[i], elId(pizzaItems[i]+`_area`), `id`, pizzaItems[i]);
        newEl(`h6`, pizzaPrice[i], elId(pizzaItems[i]+`_area`), `id`, pizzaPrice[i]);
      }

      // console.log(foodType);
      var firstItemInMenu = elId(`Cheeseburger`);
      newAttribute(`class`, `selected`, firstItemInMenu);

      elId(`item_picker`).addEventListener(`click`, (event) => {
        // console.log(event.target.nextSibling.id);
        // console.log(event.target.id);
        if (allMenuItems.includes(event.target.id) == true) {
          let selected = elClass(`selected`, 0);
          newAttribute(`class`, `selected`, event.target);
          selected.setAttribute(`class`, `none`);
        }
      });
      elId(`add_to_order`).addEventListener(`click`, (event) => {
        let quantity = elId(`quantity`).value;
        if (quantity >= 1 && quantity <= 99) {
          for (let i = 0; i < quantity; i++) {
            let wrapper = document.createElement(`div`);
            let price = elClass(`selected`, 0).nextSibling.id;
            newEl(`h3`, elClass(`selected`, 0).innerHTML, wrapper, `class`, `item_data`);
            newEl(`h3`, price, wrapper, `class`, `item_data`);
            addToSubotal(price);
            addTax(price);
            addToGrandTotal(); //
            elId(`items_selected`).append(wrapper);
          }
        }
        else {
          window.alert(`I don't think you understand how numbers work`);
        }
      });
    });

function addToSubotal (addend) {
  var subtotal = Number(addend) + Number(elId(`subtotal`).innerText);
  elId(`subtotal`).innerText = Math.round(subtotal * 100) / 100;
  // console.log(`subtotal`,subtotal);
  return subtotal;
}

function addTax (addend) {
  var tax = (Number(addend) * 0.083) + Number(elId(`tax`).innerText);
  elId(`tax`).innerText = Math.round(tax * 100) / 100;

  // console.log(`tax`,tax);
  return tax;
}

function addToGrandTotal () {
  var subtotal = Number(elId(`subtotal`).innerText);
  var tax = Number(elId(`tax`).innerText);
  var grandTotal = subtotal + tax;
  elId(`grand_total`).innerText = Math.round(grandTotal * 100) / 100;
  // console.log(grandTotal);
}

document.getElementById(`delivery_button`).addEventListener(`click`, (event) => {
  window.alert(`Your Order has been submitted! Have a nice day! :)`);
  // console.log(event);
  var name = event.path[1][0].value;
  var phoneNnumber = event.path[1][1].value;
  var streetAddress = event.path[1][2].value;
  postInfo(name, phoneNnumber, streetAddress);
});

function postInfo (name, phoneNnumber, streetAddress) {
  var userInfo = {
    "name" : name,
    "phoneNumber" : phoneNnumber,
    "streetAddress" : streetAddress,
    "order_items" : [document.getElementById(`items_selected`).innerText]
  };
  // console.log(userInfo);
  const ordersURL = `https://galvanize-eats-api.herokuapp.com/orders`;

  fetch(ordersURL, {
    method: "post",
    body: userInfo
  }).then((res) => {
    // console.log(res);
  });
}
