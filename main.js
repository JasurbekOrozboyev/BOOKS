const darkModeToggle = document.getElementById("dark-mode-toggle");
const html = document.documentElement;

function setDarkMode(isDark) {
  if (isDark) {
    html.classList.add("dark");
    darkModeToggle.textContent = "☀️";
    localStorage.setItem("dark-mode", "enabled");
  } else {
    html.classList.remove("dark");
    darkModeToggle.textContent = "🌙";
    localStorage.setItem("dark-mode", "disabled");
  }
}

if (localStorage.getItem("dark-mode") === "enabled") {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

darkModeToggle.addEventListener("click", () => {
  setDarkMode(!html.classList.contains("dark"));
});

let index = 0;
const slides = document.querySelectorAll("#slider img");
const totalSlides = slides.length;

document.getElementById("next").addEventListener("click", () => {
  index = (index + 1) % totalSlides;
  document.getElementById("slider").style.transform = `translateX(-${
    index * 100
  }%)`;
});

document.getElementById("prev").addEventListener("click", () => {
  index = (index - 1 + totalSlides) % totalSlides;
  document.getElementById("slider").style.transform = `translateX(-${
    index * 100
  }%)`;
});

let books = [];
let activeCategory = null;


async function fetchBooks() {
try {
  const response = await fetch("https://fakerapi.it/api/v2/books?_quantity=51");
  const data = await response.json();

  books = data.data.map(book => ({
      ...book,
      image: "https://avatars.mds.yandex.net/i?id=9840186b293969c6d0fe48a1556cfa2c_l-10701700-images-thumbs&n=13", 
      category: book.genre || "Unknown"
  }));

  loadCategories();
  displayBooks(books);
} catch (error) {
  console.error("Xatolik yuz berdi:", error);
}
}

function loadCategories() {
const categorySet = new Set(["All", ...books.map(book => book.category)]);
const categoryList = document.getElementById("categoryList");
categoryList.innerHTML = '';

categorySet.forEach(category => {
  const li = document.createElement("li");
  li.textContent = category;
  li.className = "category-item px-4 py-2 rounded cursor-pointer hover:bg-gray-200";
  li.dataset.category = category;

  li.addEventListener("click", function() {
      if (activeCategory) {
          activeCategory.classList.remove("bg-blue-500", "text-white");
      }

      filterBooks(category);
  });

  categoryList.appendChild(li);
});
}


function displayBooks(bookArray) {
const bookList = document.getElementById("bookList");
bookList.innerHTML = '';

bookArray.forEach(book => {
  const div = document.createElement("div");
  div.className = "p-4 bg-white rounded-lg shadow-md";

  div.innerHTML = `
      <img src="${book.image}" class="w-full h-48 object-cover rounded">
      <h2 class="text-lg font-semibold mt-2">${book.title}</h2>
      <p class="text-sm text-gray-600">${book.author}</p>
      <p class="text-xs text-gray-500 mt-1">${book.category}</p>
  `;

  bookList.appendChild(div);
});
}


function filterBooks(category) {
if (category === "All") {
  displayBooks(books);
} else {
  displayBooks(books.filter(book => book.category === category));
}
}


document.getElementById("search").addEventListener("input", function() {
const query = this.value.toLowerCase();
const filteredBooks = books.filter(book => 
  book.title.toLowerCase().includes(query) || 
  book.author.toLowerCase().includes(query)
);
displayBooks(filteredBooks);
});

fetchBooks();