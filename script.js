// Подставляет телефоны из config.js в кнопки и подписи.
(function () {
  var contacts = window.SOFI_CONTACTS || {};

  document.querySelectorAll(".js-phone").forEach(function (el) {
    var c = contacts[el.dataset.contact];
    if (c && c.tel) {
      el.href = "tel:" + c.tel;
    } else {
      el.removeAttribute("href");
      el.classList.add("is-disabled");
    }
  });

  document.querySelectorAll(".js-phone-text").forEach(function (el) {
    var c = contacts[el.dataset.contact];
    el.textContent = c && c.tel ? (c.display || c.tel) : "Номер скоро появится";
  });
})();
