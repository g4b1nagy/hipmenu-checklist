/* ========================================================================
 * Section
 * ======================================================================== */

document.addEventListener('DOMContentLoaded', function() {

  // get orders from page
  chrome.tabs.executeScript(null, {
    code: "\
      var orders = [], i, tags, dinerNameDOMElement, dinerName, priceValueDOMElement, priceValue;\
      if (document.location.hash.startsWith('#history')) {\
        tags = document.querySelectorAll('.history-item')[0];\
        tags = tags && tags.querySelectorAll('.content');\
        if (tags == undefined || tags.length == 0) {\
          tags = document.querySelectorAll('.history-diners')[0].querySelectorAll('.content');\
        }\
        for (i = 0; i < tags.length; i++) {\
          dinerNameDOMElement = tags[i].querySelector('h4');\
          dinerName = dinerNameDOMElement.innerText.trim();\
          priceValueDOMElement = tags[i].querySelector('.simple-footer');\
          if (priceValueDOMElement != null) {\
            priceValue = priceValueDOMElement.innerHTML.trim();\
            priceValue = priceValue.replace('Total ' + dinerName + ': ', '');\
          } else {\
            priceValueDOMElement = tags[i].querySelector('footer').querySelectorAll('td');\
            priceValueDOMElement = priceValueDOMElement[priceValueDOMElement.length - 1];\
            priceValue = priceValueDOMElement.innerHTML.trim();\
          }\
          orders.push({\
            name: dinerName,\
            price: priceValue\
          });\
        }\
      } else {\
        var name_tags = document.querySelectorAll('h1');\
        var price_tags = document.querySelectorAll('div.price');\
        for (i = 0; i < name_tags.length; i++) {\
          orders.push({\
            name: name_tags[i].innerText.trim(),\
            price: price_tags[i].innerText.trim()\
          });\
        }\
      }\
      JSON.stringify(orders);"
  }, function(orders) {
    var html = '', i, j, checks, dinerName, pageURL, dinerKey;

    orders = JSON.parse(orders);
    if (orders.length == 0) {
      return;
    }
    orders.sort(function(a, b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    chrome.tabs.executeScript(null, {
      code: "document.location.hash"
    }, function(data) {
      pageURL = data;

      // render the checklist
      for (i = 0; i < orders.length; i++) {
        html = html + '<tr>';
        html = html + '<td><label for="check' + i + '">' + orders[i].name + '</label></td>';
        html = html + '<td><label for="check' + i + '">' + orders[i].price + '</label></td>';
        html = html + '<td><input id="check' + i + '" type="checkbox" data-name="' + orders[i].name + '"' + (orders[i].payed ? ' checked ' : '') + '></td>';
        html = html + '</tr>';
      }

      document.querySelector('tbody').innerHTML = html;

      checks = document.querySelectorAll('td input');
      for (i = 0; i < checks.length; i++) {
        checks[i].addEventListener('click', function() {
          dinerName = this.getAttribute('data-name');
          dinerKey = dinerName + ":url:" + pageURL;
          for (j = 0; j < orders.length; j++) {
            if (orders[j].name == dinerName) {
              orders[j].payed = this.checked;
              chrome.tabs.executeScript(null, {
                code: "sessionStorage.setItem('" + dinerKey + "', " + this.checked + ")"
              });
            }
          }
        });
      }

      // get checkbox statuses from parent page
      for (i = 0; i < orders.length; i++) {
        dinerKey = orders[i].name + ":url:" + pageURL;

        chrome.tabs.executeScript(null, {
          code: i.toString() + " + ':' + sessionStorage.getItem('" + dinerKey + "')"
        }, function(data) {
          data = data[0].split(':');
          var index = parseInt(data[0]);
          var value = data[1] == 'true';
          orders[index].payed = value;
          document.querySelector('input[data-name="' + orders[index].name + '"]').checked = value;
        });
      }
    });
  });
});

/* ========================================================================
 * Section
 * ======================================================================== */
