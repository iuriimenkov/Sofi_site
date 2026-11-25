// Мастерская красоты «Софи»: услуги, окна записи, контакты.
(function () {
  var S = window.SOFI || {};
  var phones = S.phones || [];

  /*
   * УСЛУГИ. Чтобы добавить, убрать или переименовать услугу — правьте этот список.
   *   title    — название направления
   *   options  — варианты внутри направления (если пусто — клиент сразу переходит к форме)
   *   featured — крупная карточка в первом ряду
   */
  var SERVICES = [
    { id: "hair",  title: "Парикмахерский зал", featured: true,
      options: ["Окрашивание", "Стрижка", "Окрашивание + стрижка"] },
    { id: "nails", title: "Ногтевая студия", featured: true,
      options: ["Маникюр", "Педикюр", "Маникюр + педикюр"] },
    { id: "vip",   title: "VIP-зал", featured: true, dark: true,
      options: ["Окрашивание", "Стрижка", "Окрашивание + стрижка"] },
    { id: "cosmo", title: "Косметология врачебная и эстетическая",
      options: ["Уход за лицом", "Химический пилинг", "Контурная пластика и биоревитализация", "Миотерапия", "Лечение акне (проблемной кожи)", "Лечение гипергидроза", "Уход за телом"] },
    { id: "hardware", title: "Аппаратная косметология", options: [] },
    { id: "inject",   title: "Инъекции красоты", options: [] },
    { id: "figure",   title: "Коррекция фигуры", options: [] },
    { id: "massage",  title: "Массаж", options: [] },
    { id: "tan",      title: "Студия загара", options: [] },
    { id: "men",      title: "Для мужчин", options: [] }
  ];

  var EXTRA = {
    gift:   { title: "Подарочный сертификат", options: [], gift: true },
    career: { title: "Работа в «Софи»", lead: "Кем хотите работать?", career: true,
              options: ["Парикмахер", "Мастер маникюра и педикюра", "Косметолог", "Массажист", "Администратор", "Другое"] }
  };

  function find(id) {
    for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
    return EXTRA[id];
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---------- Контакты на странице ----------
  document.querySelectorAll(".js-phone").forEach(function (el) {
    var p = phones[+el.dataset.i || 0];
    if (p) { el.href = "tel:" + p.tel; el.textContent = p.display; }
  });
  document.querySelectorAll(".js-phone-btn").forEach(function (el) {
    var p = phones[+el.dataset.i || 0];
    if (p) el.href = "tel:" + p.tel;
  });
  document.querySelectorAll(".js-phones").forEach(function (el) {
    el.innerHTML = phones.map(function (p) {
      return '<a href="tel:' + p.tel + '">' + esc(p.display) + "</a>";
    }).join("<br>");
  });
  document.querySelectorAll(".js-email").forEach(function (el) {
    if (S.email) { el.href = "mailto:" + S.email; el.textContent = S.email; }
  });
  document.querySelectorAll(".js-map").forEach(function (el) { el.href = S.mapUrl; });
  document.querySelectorAll(".js-reviews").forEach(function (el) { el.href = S.reviewsUrl; });

  // ---------- Карточки услуг ----------
  var grid = document.getElementById("services-grid");
  if (grid) {
    grid.innerHTML = SERVICES.map(function (s) {
      var list = s.options.length
        ? '<ul class="service__list">' + s.options.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>"
        : "";
      return '<button type="button" class="service' + (s.featured ? " service--featured" : "") + (s.dark ? " service--dark" : "") +
        '" data-open="' + s.id + '"><span class="service__title">' + esc(s.title) + "</span>" + list +
        '<span class="service__cta">Записаться <span aria-hidden="true">→</span></span></button>';
    }).join("");
  }

  // ---------- Мобильное меню ----------
  var burger = document.querySelector(".burger");
  var header = document.querySelector(".header");
  if (burger) {
    burger.addEventListener("click", function () { header.classList.toggle("is-menu"); });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { header.classList.remove("is-menu"); });
    });
  }

  // ---------- Окно записи ----------
  var modal = document.getElementById("modal");
  var body = document.getElementById("modal-body");
  var state = {};

  function openModal(id) {
    state = { id: id };
    if (id === "choose") renderChoose();
    else start();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { modal.classList.add("is-open"); });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(function () { modal.hidden = true; }, 200);
  }

  function start() {
    var s = find(state.id);
    if (s.options.length) renderOptions();
    else { state.option = ""; renderForm(); }
  }

  function steps(n) {
    var s = find(state.id);
    var total = s && s.options.length ? 3 : 2;
    if (!s || !s.options.length) n = n - 1;
    var out = "";
    for (var i = 1; i <= total; i++) out += '<span class="steps__dot' + (i <= n ? " is-on" : "") + '"></span>';
    return '<div class="steps">' + out + "</div>";
  }

  function renderChoose() {
    body.innerHTML =
      '<p class="modal__eyebrow">мастерская красоты «Софи»</p>' +
      '<h3 class="modal__title" id="modal-title">Куда записаться?</h3>' +
      '<div class="choices choices--scroll">' +
        SERVICES.map(function (s) {
          return '<button type="button" class="choice" data-go="' + s.id + '">' + esc(s.title) +
            (s.options.length ? "<small>" + esc(s.options.slice(0, 3).join(", ").toLowerCase()) + (s.options.length > 3 ? "…" : "") + "</small>" : "") +
            "</button>";
        }).join("") +
      "</div>";
  }

  function renderOptions() {
    var s = find(state.id);
    body.innerHTML =
      steps(1) +
      '<h3 class="modal__title" id="modal-title">' + esc(s.title) + "</h3>" +
      '<p class="modal__lead">' + esc(s.lead || "Выберите услугу") + "</p>" +
      '<div class="choices">' +
        s.options.map(function (o) {
          return '<button type="button" class="choice" data-option="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("") +
      "</div>";
  }

  function renderForm() {
    var s = find(state.id);
    var extra;
    if (s.career) {
      extra = '<label class="field"><span>Опыт работы</span><input name="exp" placeholder="Например, 3 года"></label>';
    } else if (s.gift) {
      extra = '<label class="field"><span>Сумма или услуга</span><input name="gift" placeholder="Например, 5000 ₽ или маникюр"></label>';
    } else {
      extra =
        '<div class="field-row">' +
          '<label class="field"><span>Желаемая дата</span><input name="date" type="date"></label>' +
          '<label class="field"><span>Время</span><select name="time">' +
            "<option>Любое</option><option>Утро</option><option>День</option><option>Вечер</option>" +
          "</select></label>" +
        "</div>";
    }
    var hasOptions = s.options.length > 0;
    body.innerHTML =
      steps(2) +
      '<h3 class="modal__title" id="modal-title">' + esc(state.option || s.title) + "</h3>" +
      '<p class="modal__lead">' + (s.career ? "Оставьте контакты — мы перезвоним." : "Оставьте контакты — администратор свяжется с вами.") + "</p>" +
      '<form class="form" novalidate>' +
        '<label class="field"><span>Имя</span><input name="name" required autocomplete="name"></label>' +
        '<label class="field"><span>Телефон</span><input name="phone" type="tel" required autocomplete="tel" placeholder="+7"></label>' +
        extra +
        '<label class="field"><span>Комментарий</span><textarea name="comment" rows="2"></textarea></label>' +
        '<p class="form__error" hidden>Укажите имя и телефон</p>' +
        '<div class="modal__actions">' +
          (hasOptions ? '<button type="button" class="btn btn--outline" data-back>Назад</button>' : "") +
          '<button type="submit" class="btn">Далее</button>' +
        "</div>" +
      "</form>";
  }

  function renderSend(d) {
    var s = find(state.id);
    var head = s.career ? "Отклик на вакансию с сайта «Софи»" : s.gift ? "Заявка на подарочный сертификат с сайта «Софи»" : "Заявка на запись с сайта «Софи»";
    var lines = [head];
    if (s.career) lines.push("Должность: " + state.option);
    else if (!s.gift) lines.push("Услуга: " + s.title + (state.option ? " — " + state.option : ""));
    lines.push("Имя: " + d.name, "Телефон: " + d.phone);
    if (d.exp) lines.push("Опыт: " + d.exp);
    if (d.gift) lines.push("Сертификат: " + d.gift);
    if (d.date) lines.push("Дата: " + d.date.split("-").reverse().join("."));
    if (d.time) lines.push("Время: " + d.time);
    if (d.comment) lines.push("Комментарий: " + d.comment);
    var text = lines.join("\n");
    state.text = text;

    var callList = phones;
    if (s.career && S.career && S.career.tel) callList = [S.career];

    var btns = "";
    if (S.whatsapp) btns += '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/' + S.whatsapp + "?text=" + encodeURIComponent(text) + '">Отправить в WhatsApp</a>';
    if (S.telegram) btns += '<a class="btn" target="_blank" rel="noopener" href="https://t.me/' + S.telegram + "?text=" + encodeURIComponent(text) + '">Отправить в Telegram</a>';
    if (S.email) btns += '<a class="btn" href="mailto:' + S.email + "?subject=" + encodeURIComponent(head) + "&body=" + encodeURIComponent(text) + '">Отправить на почту</a>';
    callList.forEach(function (p) {
      btns += '<a class="btn btn--outline" href="tel:' + p.tel + '">Позвонить ' + esc(p.display) + "</a>";
    });

    body.innerHTML =
      steps(3) +
      '<h3 class="modal__title" id="modal-title">' + (s.career ? "Отклик готов" : "Заявка готова") + "</h3>" +
      '<p class="modal__lead">Отправьте её нам или позвоните — мы работаем ' + esc(S.hours || "") + ".</p>" +
      '<pre class="summary">' + esc(text) + "</pre>" +
      '<div class="modal__actions modal__actions--col">' + btns +
        '<button type="button" class="link-btn" data-copy>Скопировать текст заявки</button>' +
      "</div>";
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open],[data-close],[data-go],[data-option],[data-back],[data-copy]");
    if (!t) return;
    if (t.dataset.open) openModal(t.dataset.open);
    else if (t.hasAttribute("data-close")) closeModal();
    else if (t.dataset.go) { state.id = t.dataset.go; start(); }
    else if (t.dataset.option) { state.option = t.dataset.option; renderForm(); }
    else if (t.hasAttribute("data-back")) renderOptions();
    else if (t.hasAttribute("data-copy")) {
      try {
        navigator.clipboard.writeText(state.text).then(function () { t.textContent = "Скопировано ✓"; }, function () {});
      } catch (err) {}
    }
  });

  body.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, d = {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name) d[el.name] = el.value.trim(); });
    if (!d.name || d.phone.replace(/\D/g, "").length < 10) {
      form.querySelector(".form__error").hidden = false;
      return;
    }
    renderSend(d);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();
