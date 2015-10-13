/* ========================================================================
 * Section
 * ======================================================================== */

var orders = [];

document.addEventListener('DOMContentLoaded', function() {

  // get orders from page

  chrome.tabs.executeScript(null, {
    code: "\
      var orders = [];\
      if (document.querySelectorAll('h1')[0].innerText.toLowerCase().indexOf('istoric comenzi') != -1) {\
        var tags = document.querySelectorAll('.history-item')[0].querySelectorAll('.content');\
        for (var i = 0; i < tags.length; i++) {\
          orders.push({\
            name: tags[i].querySelector('h4').innerText.trim(),\
            price: tags[i].querySelector('.price').innerText.trim(),\
          });\
        }\
      } else {\
        var name_tags = document.querySelectorAll('h1');\
        var price_tags = document.querySelectorAll('div.price');\
        for (var i = 0; i < name_tags.length; i++) {\
          orders.push({\
            name: name_tags[i].innerText.trim(),\
            price: price_tags[i].innerText.trim(),\
          });\
        }\
      }\
      JSON.stringify(orders);\
    "
  }, function(orders) {
    orders = JSON.parse(orders);
    orders.sort(function(a, b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    // render the checklist

    var html = '';
    for (var i = 0; i < orders.length; i++) {
      html = html + '<tr>';
      html = html + '<td><label for="check' + i + '">' + orders[i].name + '</label></td>';
      html = html + '<td><label for="check' + i + '">' + orders[i].price + '</label></td>';
      html = html + '<td><input id="check' + i + '" type="checkbox" data-name="' + orders[i].name + '"' + (orders[i].payed ? ' checked ' : '') + '></td>';
      html = html + '</tr>';
    }
    document.querySelector('tbody').innerHTML = html;
    var checks = document.querySelectorAll('td input');
    for (var i = 0; i < checks.length; i++) {
      checks[i].addEventListener('click', function(event) {
        var name = this.getAttribute('data-name');
        for (var j = 0; j < orders.length; j++) {
          if (orders[j].name == name) {
            orders[j].payed = this.checked;
            chrome.tabs.executeScript(null, {
              code: "sessionStorage.setItem('" + name + "', " + this.checked + ")"
            });
          }
        }
      });
    }

    // get checkbox statuses from parent page

    for (var i = 0; i < orders.length; i++) {
      chrome.tabs.executeScript(null, {
        code: i.toString() + " + ':' + sessionStorage.getItem('" + orders[i].name + "')"
      }, function(data) {
        data = data[0].split(':');
        var index = parseInt(data[0]);
        var value = (data[1] == 'true' ? true : false);
        orders[index].payed = value;
        document.querySelector('input[data-name="' + orders[index].name + '"]').checked = value;
      });
    }
  });
});

/* ========================================================================
 * Section
 * ======================================================================== */
