const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertAt = new Date().toISOString();
  const updateAt = insertAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertAt,
    updateAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (isSuccess === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  }

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = (_, h) => h.response({
  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  },
}).code(200);

const getBookbyHandler = (request, h) => {
  const { id } = request.params;

  if (id === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }
  return h.response({
    status: 'success',
    data: {
      books,
    },
  }).code(200);
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updateAt = new Date().toDateString();

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (id === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal diperbaharui, perhatikan id anda',
    }).code(404);
  }

  const index = books.findIndex((book) => book.id === id);
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updateAt,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  if (id === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookbyHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
