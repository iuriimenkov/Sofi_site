// Окна записи и отклика на вакансию.
(function () {
  var contacts = window.SOFI_CONTACTS || {};

  var FLOWS = {
    hair: {
      title: "Запись к парикмахеру",
      lead: "Выберите услугу",
      options: ["Окрашивание", "Стрижка", "Окрашивание + стрижка"]
    },
    nails: {
      title: "Запись на ногтевой сервис",
      lead: "Выберите услугу",
      options: ["Маникюр", "Педикюр", "Маникюр + педикюр"]
    },
    vip: {
      title: "Запись в VIP-зал",
      lead: "Выберите услугу",
      options: ["Окрашивание", "Стрижка", "Окрашивание + стрижка"]
    },
    career: {
      title: "Работа в «Софи»",
      lead: "Кем хотите работать?",
      options: ["Парикмахер", "Мастер маникюра и педикюра", "Другое"],
      career: true
    }
  };

  var modal = document.getElementById("modal");
  var body = document.getElementById("modal-body");
  var state = {};

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function open(key) {
    state = { key: key };
    if (key === "choose") renderChoose(); else renderOptions();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { modal.classList.add("is-open"); });
  }

  function close() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(function () { modal.hidden = true; }, 200);
  }

  function steps(n, total) {
    var s = "";
    for (var i = 1; i <= total; i++) s += '<span class="steps__dot' + (i <= n ? " is-on" : "") + '"></span>';
    return '<div class="steps">' + s + "</div>";
  }

  // Шаг 0 — с главного экрана: выбор направления
  function renderChoose() {
    body.innerHTML =
      '<h3 class="modal__title" id="modal-title">Запись в «Софи»</h3>' +
      '<p class="modal__lead">Куда хотите записаться?</p>' +
      '<div class="choices">' +
        '<button type="button" class="choice" data-go="hair">Парикмахеры<small>окрашивание, стрижка</small></button>' +
        '<button type="button" class="choice" data-go="nails">Ногтевой сервис<small>маникюр, педикюр</small></button>' +
        '<button type="button" class="choice" data-go="vip">VIP-зал<small>парикмахеры в отдельном зале</small></button>' +
      "</div>";
  }

  // Шаг 1 — выбор услуги / должности
  function renderOptions() {
    var f = FLOWS[state.key];
    body.innerHTML =
      steps(1, 3) +
      '<h3 class="modal__title" id="modal-title">' + f.title + "</h3>" +
      '<p class="modal__lead">' + f.lead + "</p>" +
      '<div class="choices">' +
        f.options.map(function (o) {
          return '<button type="button" class="choice" data-option="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("") +
      "</div>";
  }

  // Шаг 2 — контакты клиента
  function renderForm() {
    var f = FLOWS[state.key];
    var extra = f.career
      ? '<label class="field"><span>Опыт работы</span><input name="exp" placeholder="Например, 3 года"></label>'
      : '<label class="field"><span>Желаемая дата</span><input name="date" type="date"></label>' +
        '<label class="field"><span>Удобное время</span><select name="time">' +
          "<option>Любое</option><option>Утро</option><option>День</option><option>Вечер</option>" +
        "</select></label>";
    body.innerHTML =
      steps(2, 3) +
      '<h3 class="modal__title" id="modal-title">' + esc(state.option) + "</h3>" +
      '<p class="modal__lead">Оставьте контакты — мы свяжемся с вами.</p>' +
      '<form class="form" novalidate>' +
        '<label class="field"><span>Имя</span><input name="name" required autocomplete="name"></label>' +
        '<label class="field"><span>Телефон</span><input name="phone" type="tel" required autocomplete="tel" placeholder="+7"></label>' +
        extra +
        '<label class="field"><span>Комментарий</span><textarea name="comment" rows="2"></textarea></label>' +
        '<p class="form__error" hidden>Укажите имя и телефон</p>' +
        '<div class="modal__actions">' +
          '<button type="button" class="btn btn--outline" data-back>Назад</button>' +
          '<button type="submit" class="btn">Далее</button>' +
        "</div>" +
      "</form>";
  }

  // Шаг 3 — отправка заявки салону
  function renderSend(data) {
    var f = FLOWS[state.key];
    var c = contacts[state.key] || {};
    var lines = [
      f.career ? "Отклик на вакансию с сайта «Софи»" : "Заявка с сайта «Софи»",
      f.career ? "Должность: " + state.option : "Услуга: " + state.option + (state.key === "vip" ? " (VIP-зал)" : ""),
      "Имя: " + data.name,
      "Телефон: " + data.phone
    ];
    if (data.exp) lines.push("Опыт: " + data.exp);
    if (data.date) lines.push("Дата: " + data.date.split("-").reverse().join("."));
    if (data.time) lines.push("Время: " + data.time);
    if (data.comment) lines.push("Комментарий: " + data.comment);
    var text = lines.join("\n");

    var buttons = "";
    if (c.whatsapp) buttons += '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/' + c.whatsapp + "?text=" + encodeURIComponent(text) + '">Отправить в WhatsApp</a>';
    if (c.telegram) buttons += '<a class="btn" target="_blank" rel="noopener" href="https://t.me/' + c.telegram + "?text=" + encodeURIComponent(text) + '">Отправить в Telegram</a>';
    if (c.tel) buttons += '<a class="btn btn--outline" href="tel:' + c.tel + '">Позвонить ' + esc(c.display || c.tel) + "</a>";

    body.innerHTML =
      steps(3, 3) +
      '<h3 class="modal__title" id="modal-title">' + (f.career ? "Отклик готов" : "Заявка готова") + "</h3>" +
      '<p class="modal__lead">' + (buttons ? "Отправьте её нам удобным способом:" : "Номер для связи скоро появится на сайте.") + "</p>" +
      '<pre class="summary">' + esc(text) + "</pre>" +
      '<div class="modal__actions modal__actions--col">' +
        buttons +
        '<button type="button" class="btn btn--outline" data-copy>Скопировать текст</button>' +
      "</div>";
    state.text = text;
  }

  // События
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open],[data-close],[data-go],[data-option],[data-back],[data-copy]");
    if (!t) return;
    if (t.dataset.open) open(t.dataset.open);
    else if (t.hasAttribute("data-close")) close();
    else if (t.dataset.go) { state.key = t.dataset.go; renderOptions(); }
    else if (t.dataset.option) { state.option = t.dataset.option; renderForm(); }
    else if (t.hasAttribute("data-back")) renderOptions();
    else if (t.hasAttribute("data-copy")) {
      try {
        navigator.clipboard.writeText(state.text).then(function () { t.textContent = "Скопировано"; }, function () {});
      } catch (err) {}
    }
  });

  body.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value.trim(); });
    if (!data.name || data.phone.replace(/\D/g, "").length < 10) {
      form.querySelector(".form__error").hidden = false;
      return;
    }
    renderSend(data);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
