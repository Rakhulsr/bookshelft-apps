let bookList = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("listBooks")) {
    renderListBooks();
  }

  const submitFilter = document.getElementById("searchBook");
  submitFilter.addEventListener("submit", function (e) {
    e.preventDefault();

    const queryJudul = e.target.querySelector("#searchBookTitle").value;
    filterBook(queryJudul);
  });

  //func filter buku
  function filterBook(queryJudul) {
    const filteredBook = bookList.filter((book) => book.judul.toLowerCase().includes(queryJudul));

    const wrapperBookFilter = document.querySelector("#filterWrapper");
    if (queryJudul) {
      wrapperBookFilter.style.display = "block";
    } else {
      wrapperBookFilter.style.display = "none";
    }

    const elementBookFilter = document.querySelector("#filteredBook");
    elementBookFilter.innerHTML = "";

    for (const bookItem of filteredBook) {
      const bookElement = tambahBookList(bookItem);
      elementBookFilter.append(bookElement);
    }
  }

  const submitButton = document.getElementById("inputBook");
  submitButton.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  //func tambah buku
  const addBook = () => {
    const checkBox = document.getElementById("inputBookIsComplete");
    const judulBuku = document.getElementById("inputBookTitle").value;
    const penulisBuku = document.getElementById("inputBookAuthor").value;
    const tahunBuku = parseInt(document.getElementById("inputBookYear").value);

    const generatedID = generateID();
    const bookListObject = generateBookObject(generatedID, judulBuku, penulisBuku, tahunBuku, checkBox.checked);

    bookList.push(bookListObject);
    localStorage.setItem("listBooks", JSON.stringify(bookList));

    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  const generateID = () => {
    return +new Date();
  };

  const generateBookObject = (id, judul, penulis, tahun, isComplete) => {
    return {
      id,
      penulis,
      judul,
      tahun,
      isComplete,
    };
  };

  function renderListBooks() {
    bookList = JSON.parse(localStorage.getItem("listBooks"));

    const unreadBook = document.getElementById("incompleteBookshelfList");
    unreadBook.innerHTML = "";

    const readerBook = document.getElementById("completeBookshelfList");
    readerBook.innerHTML = "";

    const storageBookLists = localStorage.getItem("listBooks");
    for (const bookItem of JSON.parse(storageBookLists)) {
      const bookElement = tambahBookList(bookItem);
      if (!bookItem.isComplete) {
        unreadBook.append(bookElement);
      } else {
        readerBook.append(bookElement);
      }
    }
  }

  document.addEventListener(RENDER_EVENT, () => renderListBooks());

  //container rak buku
  function tambahBookList(bookListObject) {
    const textBookTitle = document.createElement("h3");
    textBookTitle.innerText = bookListObject.judul;

    const textPenulis = document.createElement("p");
    textPenulis.innerText = "Penulis: " + bookListObject.penulis;

    const textTahun = document.createElement("p");
    textTahun.innerText = "Tahun: " + bookListObject.tahun;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    // button keterangan selesai/belum dibaca & hapus buku
    const markButton = document.createElement("button");
    markButton.classList.add("green");
    markButton.innerText = bookListObject.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";

    markButton.addEventListener("click", function () {
      const bookIndex = bookList.findIndex((book) => book.id === bookListObject.id);
      bookList[bookIndex].isComplete = !bookList[bookIndex].isComplete;
      localStorage.setItem("listBooks", JSON.stringify(bookList));

      document.dispatchEvent(new Event(RENDER_EVENT));

      const queryJudul = document.querySelector("#searchBookTitle").value;
      filterBook(queryJudul);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.dataset.bookId = bookListObject.id;

    deleteButton.addEventListener("click", function (e) {
      const confirmHapus = confirm("Apakah Anda Yakin ingin menghapus buku?");
      if (confirmHapus === true) {
        const bookID = e.target.dataset.bookId;
        const bookIndex = bookList.findIndex((book) => book.id === parseInt(bookID));

        if (bookIndex !== -1) {
          bookList.splice(bookIndex, 1);
          localStorage.setItem("listBooks", JSON.stringify(bookList));
          document.dispatchEvent(new Event(RENDER_EVENT));
        }

        const queryJudul = document.querySelector("#searchBookTitle").value;
        filterBook(queryJudul);
      }
    });

    const editButton = document.createElement("button");
    editButton.classList.add("grey");
    editButton.innerText = "Edit Buku";
    editButton.dataset.bookId = bookListObject.id;

    editButton.addEventListener("click", function (e) {
      const bookID = e.target.dataset.bookId;
      const bookIndex = bookList.findIndex((book) => book.id === parseInt(bookID));

      if (bookIndex !== -1) {
        const judulBuku = prompt("Ubah Judul : ", bookList[bookIndex].judul);
        const penulisBuku = prompt("Ubah Penulis : ", bookList[bookIndex].penulis);
        const tahunBuku = prompt("Ubah Tahun (Harap masukan angka) : ", bookList[bookIndex].tahun);

        if (judulBuku !== null && penulisBuku !== null && tahunBuku !== null && !isNaN(tahunBuku)) {
          bookList[bookIndex].judul = judulBuku;
          bookList[bookIndex].penulis = penulisBuku;
          bookList[bookIndex].tahun = parseInt(tahunBuku);

          localStorage.setItem("listBooks", JSON.stringify(bookList));
          document.dispatchEvent(new Event(RENDER_EVENT));

          const queryJudul = document.querySelector("#searchBookTitle").value;
          filterBook(queryJudul);
        } else {
          alert("Anda tidak merubah apapun");
        }
      }
    });

    actionContainer.append(markButton, deleteButton, editButton);

    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book_item");
    bookContainer.append(textBookTitle, textPenulis, textTahun, actionContainer);

    return bookContainer;
  }
});
