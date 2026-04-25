Створено репозиторій 09-auth.
Проєкт створено за допомогою Next.js (App Router).
Усі компоненти, які не прив'язані безпосередньо до маршруту та їх частин, зберігаються в папці components, кожен — у власній папці, з файлами:
файл компонента з розширенням .tsx (наприклад, Header.tsx);
файл стилів з такою самою назвою, що й компонент, з розширенням .module.css (наприклад, Header.module.css).

Загальні типи та інтерфейси винесені до файлів types/note.ts, types/user.ts.
Функції роботи з API винесені в lib/api/ у вигляді окремих модулів.
Для HTTP-запитів використовується бібліотека axios.
Стан запитів у CSR-компонентах керується через TanStack Query (React Query).
Усі компоненти типізовані з використанням TypeScript.
Код має бути відформатований за допомогою Prettier.
Стилізація — за допомогою CSS Modules.
У проєкті реалізована підтримка SSR та CSR відповідно до завдання.

Бекенд
Ознайомтесь із документацією нового бекенда за посиланням:

https://notehub-api.goit.study/docs

Для виконання ДЗ вам потрібні будуть наступні ендпоінти бекенда (базовий URL: https://notehub-api.goit.study):

Аутентифікація:

POST /auth/login - аутентифікація користувача. В тілі запиту очікує обов'язкові поля: email, password. У разі успіху у відповіді - об'єкт користувач.
POST /auth/register - реєстрація нового користувача. В тілі запиту обов'язково: email, password. У разі успіху у відповіді - створений об'єкт користувача.
POST /auth/logout - вихід користувача з системи. Тіло порожнє. У разі успіху у відповіді - статус 200 без тіла.
GET /auth/session - перевірка активної сесії. У разі успіху у відповіді - об'єкт користувача. Або статус 200 без тіла, якщо користувач неавторизований.
Користувачі:

GET /users/me - отримати свій профіль. У разі успіху у відповіді - об'єкт користувача
PATCH /users/me - оновити дані користувача. В тілі: оновлений об'єкт користувача. У разі успіху у відповіді - оновлений об'єкт користувача
Нотатки:

GET /notes - список нотаток. Query-params: search (пошук), page (номер сторінки), perPage (завжди 12), tag (тег для фільтрації). У разі успіху у відповіді - масив нотаток.
GET /notes/:id - отримати одну нотатку за ID (ID з типом String!!!).. У разі успіху у відповіді - об'єкт нотатки.
POST /notes - створити нотатку. В тілі запиту обов'язково: title, content, tag. У разі успіху у відповіді - об'єкт створеної нотатки.
DELETE /notes/:id - видалити нотатку за ID (ID з типом String!!!). У разі успіху у відповіді - об'єкт видаленої нотатки.
Важливо: усі запити (окрім login/register) потребують кукі для авторизації.

Для того, щоб у вашому проєкті після додавання логіки авторизації, всі маршрути працювали коректно, нам потрібно додати папку app/api з готовими маршрутами (не плутайте з папкою lib/api). У цій папці кожен підкаталог і файл описує окремий серверний роут — наприклад, app/api/auth/login/route.ts обробляє запит на логін, а інші файли будуть відповідати за реєстрацію, логаут тощо. Завантажити готову папку api з усіма потрібними файлами і вкладеними папками ви можете тут: https://github.com/goitacademy/react-notehub-styles/tree/hw-09-api-files. Це потрібно, бо ви ще не вивчали бекенд, і вся бекенд-логіка вже написана за вас.

Типи маршрутів та їх структура
На цьому етапі проєкту необхідно розділити маршрути на приватні та публічні, при цьому врахувати, що для коректної роботи модального вікна (modal routes) у Next.js маршрути, які мають бути перехоплені, та перехоплювачі повинні перебувати в одному routing-контексті (layout scope). Приватні маршрути доступні лише для авторизованих користувачів. Далі в кроках ви будете реалізовувати захист цих маршрутів.

Приватні маршрути — доступні тільки для авторизованих користувачів, їх потрібно розмістити у папці app/(private routes). До приватних маршрутів належать:

Всі сторінки, що починаються з /profile;
Всі сторінки, що починаються з /notes.

Маршрути для реєстрації та аутентифікації розмістіть у папці — . Ці маршрути потрібно розмістити у папці app/(auth routes). До них належать:

/sign-in
/sign-up
обов'язково додайте файл layouts.tsx, щоб маршрути працювали коректно після деплою на Vercel.

Навігація по сторінкам AuthNavigation
Внесіть зміни у навігацію в компоненті Header, додавши в список <ul> посилання на нові сторінки. Ці нові посилання винесіть у окремий компонент components/AuthNavigation/AuthNavigation.tsx. Компонент AuthNavigation має створювати наступну розмітку:

 <li className={css.navigationItem}>
  <a href="/profile" prefetch={false} className={css.navigationLink}>
    Profile
  </a>
</li>

<li className={css.navigationItem}>
  <p className={css.userEmail}>User email</p>
  <button className={css.logoutButton}>
    Logout
  </button>
</li>

<li className={css.navigationItem}>
  <a href="/sign-in" prefetch={false} className={css.navigationLink}>
    Login
  </a>
</li>

<li className={css.navigationItem}>
  <a href="/sign-up" prefetch={false} className={css.navigationLink}>
    Sign up
  </a>
</li>

Сторінка профілю користувача
Створіть приватний маршрут для профілю користувача app/(private routes)/profile/page.tsx. Поки що компонент Profile має створювати наступну розмітку:

<main className={css.mainContent}>
  <div className={css.profileCard}>
      <div className={css.header}>
	     <h1 className={css.formTitle}>Profile Page</h1>
	     <a src="" className={css.editProfileButton}>
	       Edit Profile
	     </a>
	   </div>
     <div className={css.avatarWrapper}>
      <img
        src="Avatar"
        alt="User Avatar"
        width={120}
        height={120}
        className={css.avatar}
      />
    </div>
    <div className={css.profileInfo}>
      <p>
        Username: your_username
      </p>
      <p>
        Email: your_email@example.com
      </p>
    </div>
  </div>
</main>

Додайте на сторінку профілю усі небхідні meta-теги.

Для коректної роботи з віддаленими зображеннями у Next.js (аватар профілю) потрібно в next.config.ts додати розділ images з масивом remotePatterns, який обов'язково містить hostname: 'ac.goit.global'.

Робота з API
Усі функції для роботи з API розділіть на три файли:

1. lib/api/api.ts — для створення одного спільного екземпляра axios, з налаштуванням withCredentials: true для підтримки cookies;

2. lib/api/clientApi.ts — для функцій, які викликаються у клієнтських компонентах:

fetchNotes
fetchNoteById
createNote
deleteNote
register
login
logout
checkSession
getMe
updateMe 3. lib/api/serverApi.ts — для функцій, які викликаються у серверних компонентах (до params потрібно додавати cookeis у headers):

fetchNotes
fetchNoteById
getMe
checkSession.

Це допоможе чітко відокремити логіку клієнтських запитів від серверної частини та уникнути помилок із середовищем виконання.

Оголосіть у файлі .env змінну NEXT_PUBLIC_API_URL. Під час локальної розробки вона має містити http://localhost:3000, а після деплою — адресу вашого сайту на Vercel. Це потрібно, щоб у файлі lib/api/api.ts до baseURL (const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';) запити завжди йшли на правильний сервер, незалежно від середовища.

Сторінка реєстрації
Створіть сторінку для реєстрації нового користувача app/(auth routes)/sign-up/page.tsx. Ця сторінка має бути клієнтським компонентом. На сторінці має створюватись наступна розмітка:

<main className={css.mainContent}>
  <h1 className={css.formTitle}>Sign up</h1>
	<form className={css.form}>
    <div className={css.formGroup}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" className={css.input} required />
    </div>

    <div className={css.formGroup}>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" className={css.input} required />
    </div>

    <div className={css.actions}>
      <button type="submit" className={css.submitButton}>
        Register
      </button>
    </div>

    <p className={css.error}>Error</p>

  </form>
</main>

Форма має надсилати запит до API з підтримкою cookies.

Оголосіть у файлі lib/api/clientApi.ts функцію для запиту на реєстрацію нового користувача.

У файлі types/user.ts оголосіть інтерфейс User з трьома обов'язковими полями: email, username, avatar.

!!Зверніть увагу, що у файлі types/user.ts має бути лише тип User. Типи та інтерфейси, пов'язані з реєстрацією, автентифікацією, Response, Request описуються у файлах, де вони використовуються (наприклад, lib/api/clientApi.ts, lib/api/serverApi.ts).

У разі успішної реєстрації має відбуватись автоматичний редірект користувача на сторінку профілю /profile.

Додавати специфічні meta-теги на сторінку реєстрації не потрібно.

Сторінка автентифікації
Створіть сторінку для автентифікації (логіну) користувача app/(auth routes)/sign-in/page.tsx. Ця сторінка має бути клієнтським компонентом. На сторінці має створюватись наступна розмітка:

<main className={css.mainContent}>
 <form className={css.form}>
    <h1 className={css.formTitle}>Sign in</h1>

    <div className={css.formGroup}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" className={css.input} required />
    </div>

    <div className={css.formGroup}>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" className={css.input} required />
    </div>

    <div className={css.actions}>
      <button type="submit" className={css.submitButton}>
        Log in
      </button>
    </div>

    <p className={css.error}>{error}</p>

  </form>
</main>

Форма має надсилати запит до API з підтримкою cookies.

Оголосіть у файлі lib/api/clientApi.ts функцію для запиту на автентифікацію користувача.

У разі успішної автентифікації має відбуватись автоматичний редірект користувача на сторінку профілю /profile.

Додавати специфічні meta-теги на сторінку реєстрації не потрібно.

Перевірка авторизації
Для перевірки та зберігання стану авторизації у файлі lib/store/authStore.ts створіть Zustand-стор, який зберігає інформацію про користувача (user) та булеве значення isAuthenticated. Стор має методи setUser для запису даних користувача після успішного логіну та clearIsAuthenticated для очищення стану під час виходу. Це дозволить в будь-якому компоненті отримувати актуальний стан авторизації.

!!!Під час створення Zustand-стору в TypeScript використовуйте подвійні дужки після create, інакше типи визначаться некоректно. Наприклад:
create<AuthStore>()((set) => ({ ... }))

Навігація в AuthNavigation
Внесіть зміни в компонент AuthNavigation, щоб додати динамічну логіку залежно від статусу авторизації користувача та можливості перемикатися між новими сторінками.

Якщо користувач не авторизований, в AuthNavigation мають відображатися посилання на сторінки реєстрації (Register) та входу (Login).

Якщо користувач авторизований, в AuthNavigation мають відображатися:

посилання на сторінку профілю (Profile);
кнопка Logout, яка при натисканні викликає функцію виходу з акаунта і виконує редірект на сторінку Login.

!!!Важливо: логіку виведення елементів Register, Login, Profile, Logout в хедері необхідно побудувати через умовний рендер на основі значення isAuthenticated з Zustand-стора.

Захист маршрутів
Додайте захист маршрутів на рівні Proxy у файлі proxy.ts. Налаштуйте перевірку токенів у cookies: якщо неавторизований користувач намагається відкрити приватну сторінку — його перенаправляє на сторінку входу. Якщо авторизований користувач відкриває публічну сторінку — його перенаправляє на профіль. Використайте для цього функцію proxy з матеріалів Модуля 4. Авторизація та безпека у розділі Proxy.

Створіть клієнтський компонент components/AuthProvider/AuthProvider.tsx, який перевіряє, чи користувач авторизований, і при переході на приватну сторінку виконує повторну перевірку сесії. Якщо користувач неавторизований і намагається перейти на приватну сторінку, має виконуватися вихід і контент не відображатись. Під час перевірки показуйте лоедер.

!!!У файлі app/layout.tsx компонент AuthProvider обов'язково має обгортати весь контент застосунку (хедер, модалки, children і футер) і бути вкладеним усередину TanStackProvider.

Сторінка редагування профілю
При натисканні на кнопку Edit, розташовану на сторінці профілю користувача, має відбуватися перехід на сторінку редагування профілю /profile/edit.

Створіть приватний маршрут для редагування профілю користувача за шляхом app/(private routes)/profile/edit/page.tsx. Ця сторінка має бути клієнтським компонентом, який відповідає за всю клієнтську логіку (отримання поточних даних користувача, роботу з формою тощо).

На сторінці має створюватись наступна розмітка:

<main className={css.mainContent}>
  <div className={css.profileCard}>
    <h1 className={css.formTitle}>Edit Profile</h1>

    <img src="avatar"
      alt="User Avatar"
      width={120}
      height={120}
      className={css.avatar}
    />

    <form className={css.profileInfo}>
      <div className={css.usernameWrapper}>
        <label htmlFor="username">Username:</label>
        <input id="username"
          type="text"
          className={css.input}
        />
      </div>

      <p>Email: user_email@example.com</p>

      <div className={css.actions}>
        <button type="submit" className={css.saveButton}>
          Save
        </button>
        <button type="button" className={css.cancelButton}>
          Cancel
        </button>
      </div>
    </form>

  </div>
</main>

Достатньо реалізувати можливість редагування лише для поля з іменем користувача (username), при цьому в полі інпуту має бути встановлене початкове значення поточного імені. Email користувача відображається у вигляді звичайного тексту, без можливості редагування. Аватар користувача відображається зображенням, без можливості редагування, використовуйте компонент Image від Next.js.

При натисканні на кнопку Save має відправлятися запит на оновлення імені користувача через API. У разі успішного оновлення має виконуватися автоматичне перенаправлення (редірект) на сторінку профілю /profile.

При натисканні на кнопку Cancel користувач повинен повернутися назад на сторінку профілю.
