import { useState } from "react";

const USERS = {
  Labubu16: "1234", // Админ
  Zimomo19: "5678", // Ограниченный пользователь
};

const INITIAL_CATEGORIES = {
  "Guy Ritchie Films": [
    { title: "Lock, Stock and Two Smoking Barrels", ratings: {}, watched: false },
    { title: "Snatch", ratings: {}, watched: false },
    { title: "Swept Away", ratings: {}, watched: false },
    { title: "Revolver", ratings: {}, watched: false },
    { title: "RocknRolla", ratings: {}, watched: false },
    { title: "Sherlock Holmes", ratings: {}, watched: false },
    { title: "Sherlock Holmes: A Game of Shadows", ratings: {}, watched: false },
    { title: "The Man from U.N.C.L.E.", ratings: {}, watched: false },
    { title: "King Arthur: Legend of the Sword", ratings: {}, watched: false },
    { title: "Aladdin", ratings: {}, watched: false },
    { title: "The Gentlemen", ratings: {}, watched: false },
    { title: "Wrath of Man", ratings: {}, watched: false },
    { title: "Operation Fortune: Ruse de Guerre", ratings: {}, watched: false },
    { title: "The Covenant", ratings: {}, watched: false },
    { title: "In Bruges", ratings: {}, watched: false },
  ],
};

function App() {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [currentCategory, setCurrentCategory] = useState("Bests");
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem("categories")) || INITIAL_CATEGORIES
  );

  const isAdmin = user === "Labubu16";

  function login() {
    if (USERS[username] === password) {
      setUser(username);
    } else {
      alert("Неверный логин или пароль");
    }
  }

  function logout() {
    setUser(null);
    setUsername("");
    setPassword("");
  }

  function addCategory(name) {
    if (!isAdmin || !name.trim() || categories[name]) return;
    const updated = { ...categories, [name]: [] };
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    setCurrentCategory(name);
  }

  function addMovie(title) {
    if (!isAdmin || !title.trim() || !currentCategory || currentCategory === "Bests") return;
    const updated = {
      ...categories,
      [currentCategory]: [...categories[currentCategory], { title, ratings: {}, watched: false }],
    };
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  }

  function editCategoryName(oldName, newName) {
    if (!isAdmin || !newName.trim() || categories[newName] || currentCategory === "Bests") return;
    const updated = { ...categories };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    if (currentCategory === oldName) setCurrentCategory(newName);
  }

  function editMovieTitle(oldTitle, newTitle) {
    if (!isAdmin || !newTitle.trim() || !currentCategory || currentCategory === "Bests") return;
    const updated = {
      ...categories,
      [currentCategory]: categories[currentCategory].map((m) =>
        m.title === oldTitle ? { ...m, title: newTitle } : m
      ),
    };
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  }

  function deleteCategory(categoryName) {
    if (!isAdmin || currentCategory === "Bests") return;
    const updated = { ...categories };
    delete updated[categoryName];
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    if (currentCategory === categoryName) setCurrentCategory("Bests");
  }

  function deleteMovie(title) {
    if (!isAdmin || currentCategory === "Bests") return;
    const updated = {
      ...categories,
      [currentCategory]: categories[currentCategory].filter((m) => m.title !== title),
    };
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  }

  function rateMovie(title, score) {
    if (!currentCategory || currentCategory === "Bests") return;
    const updated = {
      ...categories,
      [currentCategory]: categories[currentCategory].map((m) =>
        m.title === title ? { ...m, ratings: { ...m.ratings, [user]: score } } : m
      ),
    };
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  }

  function toggleWatched(title) {
    if (!currentCategory || currentCategory === "Bests") return;
    const updated = {
      ...categories,
      [currentCategory]: categories[currentCategory].map((m) =>
        m.title === title ? { ...m, watched: !m.watched } : m
      ),
    };
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  }

  function average(ratings) {
    const vals = Object.values(ratings);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-20 gap-4 bg-[#FFCCCC]">
        <h1 className="text-2xl font-bold text-[#660000]">Login</h1>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-[#FF9999] p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#FF9999] p-2 rounded"
        />
        <button
          onClick={login}
          className="bg-[#FF0000] text-white px-4 py-2 rounded shadow-md"
        >
          Войти
        </button>
      </div>
    );
  }

  let categoryInput = "";
  let movieInput = "";

  const movies = currentCategory === "Bests"
    ? Object.entries(categories)
        .flatMap(([cat, ms]) =>
          ms
            .filter((m) => average(m.ratings) >= 4.3)
            .map((m) => ({ ...m, category: cat }))
        )
        .sort((a, b) => average(b.ratings) - average(a.ratings))
    : categories[currentCategory] || [];

  return (
    <div className="p-4 max-w-2xl mx-auto bg-[#FFCCCC]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-[#660000]">Hello, {user}</h1>
        <button onClick={logout} className="text-[#FF6666] hover:underline">
          Выйти
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <select
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
          className="border border-[#FF9999] p-2 rounded bg-white text-[#990000]"
        >
          <option value="Bests">Bests</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat} className="text-[#990000]">
              {cat}
            </option>
          ))}
        </select>
        <input
          placeholder="Новая категория (актер/режиссер)"
          onChange={(e) => (categoryInput = e.target.value)}
          className="border border-[#FF9999] p-2 rounded flex-grow bg-white text-[#990000]"
          disabled={!isAdmin}
        />
        <button
          onClick={() => addCategory(categoryInput)}
          className="bg-[#FF0000] text-white px-4 py-2 rounded shadow-md"
          disabled={!isAdmin}
        >
          + Категория
        </button>
        {currentCategory !== "Bests" && (
          <button
            onClick={() => deleteCategory(currentCategory)}
            className="bg-[#FF6666] text-white px-4 py-2 rounded ml-2"
            disabled={!isAdmin}
          >
            Удалить категорию
          </button>
        )}
      </div>

      {currentCategory && currentCategory !== "Bests" && (
        <>
          <div className="mb-4 flex gap-2">
            <input
              placeholder="Название фильма"
              onChange={(e) => (movieInput = e.target.value)}
              className="border border-[#FF9999] p-2 rounded flex-grow bg-white text-[#990000]"
              disabled={!isAdmin}
            />
            <button
              onClick={() => addMovie(movieInput)}
              className="bg-[#FF6666] text-white px-4 py-2 rounded"
              disabled={!isAdmin}
            >
              + Фильм
            </button>
          </div>

          <h2
            className="text-lg font-semibold mt-6 cursor-pointer text-[#660000] hover:underline"
            onClick={() => {
              if (isAdmin) {
                const newName = prompt(`Введите новое название для "${currentCategory}":`);
                if (newName) editCategoryName(currentCategory, newName);
              }
            }}
          >
            {currentCategory}
          </h2>
          <ul className="flex flex-wrap -mx-2">
            {movies.map((m) => {
              const myRating = m.ratings[user] || 0;
              const avg = average(m.ratings);
              const allRated = Object.keys(USERS).every((u) => m.ratings[u] !== undefined);

              return (
                <li
                  key={m.title}
                  className={`w-1/2 px-2 mb-4 ${m.watched ? "bg-[#FF9999] rounded" : "bg-white border border-[#FF9999] rounded p-2"}`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={m.watched}
                          onChange={() => toggleWatched(m.title)}
                          className="h-4 w-4 rounded accent-[#FF3333]"
                          disabled={!isAdmin}
                        />
                        <span
                          onClick={() => {
                            if (isAdmin) {
                              const newTitle = prompt(`Введите новое название для "${m.title}":`);
                              if (newTitle) editMovieTitle(m.title, newTitle);
                            }
                          }}
                          className="cursor-pointer text-[#990000] hover:underline"
                        >
                          {m.title}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteMovie(m.title)}
                        className="bg-[#FF6666] text-white px-2 py-1 rounded ml-2"
                        disabled={!isAdmin}
                      >
                        Удалить
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[#990000]">My Rank:</span>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          onClick={() => {
                            const newRating = prompt(`Введите оценку для "${m.title}" (0-5, например 4.5):`);
                            if (newRating !== null && !isNaN(newRating) && newRating >= 0 && newRating <= 5) {
                              rateMovie(m.title, parseFloat(newRating));
                            }
                          }}
                          className={`cursor-pointer ${myRating >= i + 1 ? "text-[#FF0000]" : "text-[#FFCCCC]"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[#990000]">Overall:</span>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.round(avg) ? "text-[#FF0000]" : allRated ? "text-[#FF0000]" : "text-[#FFCCCC]"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {currentCategory === "Bests" && (
        <>
          <h2 className="text-lg font-semibold mt-6 text-[#660000]">Bests</h2>
          <ul className="space-y-2">
            {movies.map((m) => (
              <li
                key={`${m.category}-${m.title}`}
                className="border border-[#FF9999] p-2 rounded"
                style={{ backgroundColor: "#FF9999", color: "#660000" }}
              >
                {m.title} ({m.category}) — {average(m.ratings).toFixed(1)} ★
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
