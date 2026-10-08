from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Book(BaseModel):
    isbn: str
    title: str
    author: str
    publisher: str
    cost: float

# In-memory database for demonstration
books_db: List[Book] = []

@app.get("/books", response_model=List[Book])
def get_books(search_by: Optional[str] = None, query: Optional[str] = None):
    if query and search_by:
        q = query.lower()
        if search_by == "title":
            return [b for b in books_db if q in b.title.lower()]
        elif search_by == "author":
            return [b for b in books_db if q in b.author.lower()]
        elif search_by == "publisher":
            return [b for b in books_db if q in b.publisher.lower()]
        elif search_by == "isbn":
            return [b for b in books_db if q in b.isbn.lower()]
    return books_db

@app.post("/books", response_model=Book)
def add_book(book: Book):
    if any(b.isbn == book.isbn for b in books_db):
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    books_db.append(book)
    return book

# UPDATE BOOK BY ISBN
@app.put("/books/{isbn}", response_model=Book)
def update_book(isbn: str, updated_book: Book):
    for index, book in enumerate(books_db):
        if book.isbn == isbn:
            books_db[index] = updated_book
            return updated_book
    raise HTTPException(status_code=404, detail="Book not found")

# DELETE BOOK BY ISBN
@app.delete("/books/{isbn}")
def delete_book(isbn: str):
    global books_db
    for index, book in enumerate(books_db):
        if book.isbn == isbn:
            deleted_book = books_db.pop(index)
            return {"message": f"Book '{deleted_book.title}' deleted successfully"}
    raise HTTPException(status_code=404, detail="Book not found")