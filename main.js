const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
}



function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}



function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(bookObject) {

    const {
        id,
        title,
        author,
        year,
        isCompleted
    } = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;

    const textYear = document.createElement('p');
    textYear.innerText = year;

    const divAction = document.createElement('div');
    divAction.classList.add('action');

    const articleContainer = document.createElement('article');
    articleContainer.classList.add('book_item');
    articleContainer.append(textTitle, textAuthor, textYear, divAction);
    articleContainer.setAttribute('id', `todo-${id}`);


    if (isCompleted) {

        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum Dibaca';
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';
        trashButton.addEventListener('click', function () {

            if (confirm('Ingin menghapus buku?')) {
                removeTaskFromCompleted(id);
                alert('Buku berhasil dihapus.');
            } else {
                alert('Buku gagal dihapus.')
            }
        });

        divAction.append(undoButton, trashButton);
    } else {

        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai Dibaca';
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';
        trashButton.addEventListener('click', function () {

            if (confirm('Ingin menghapus buku?')) {
                removeTaskFromCompleted(id);
                alert('Buku berhasil dihapus.');
            } else {
                alert('Buku gagal dihapus.')
            }

        });



        divAction.append(checkButton, trashButton);
    }

    return articleContainer;
}


function addBook() {
    const textBook = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const checkIsCompleted = document.getElementById('inputBookIsComplete').checked;


    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, textAuthor, textYear, checkIsCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    document.getElementById('inputBook').reset();

}



document.getElementById('searchSubmit').addEventListener("click", function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for (book of bookList) {
        if (searchBook !== book.innerText.toLowerCase()) {
            book.parentElement.style.display = "none";
        } else {
            book.parentElement.style.display = "block";
        }
    }
})




function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();

    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');


    uncompletedBOOKList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBOOKList.append(bookElement);
        }
    }
});