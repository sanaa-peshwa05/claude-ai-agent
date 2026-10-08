import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ isbn: '', title: '', author: '', publisher: '', cost: '' });
  const [editingIsbn, setEditingIsbn] = useState(null);
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = 'https://psychic-guacamole-6v5x7qr4pjrqcgrg-8000.app.github.dev';

  const fetchBooks = async (query = '', field = 'title') => {
    let url = `${API_URL}/books`;
    if (query) url += `?search_by=${field}&query=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.isbn || !form.title || !form.author || !form.publisher || !form.cost) {
      alert('Please fill out all fields.');
      return;
    }

    if (editingIsbn) {
      // Update existing book
      try {
        const res = await fetch(`${API_URL}/books/${editingIsbn}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, cost: parseFloat(form.cost) }),
        });
        if (res.ok) {
          alert('✨ Book updated successfully!');
          setEditingIsbn(null);
          setForm({ isbn: '', title: '', author: '', publisher: '', cost: '' });
          fetchBooks();
        } else {
          const errData = await res.json();
          alert(`Error: ${errData.detail}`);
        }
      } catch (err) {
        alert('Failed to update book.');
      }
    } else {
      // Add new book
      try {
        const res = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, cost: parseFloat(form.cost) }),
        });
        if (res.ok) {
          alert('📚 Book added successfully!');
          setForm({ isbn: '', title: '', author: '', publisher: '', cost: '' });
          fetchBooks();
        } else {
          const errData = await res.json();
          alert(`Error: ${errData.detail}`);
        }
      } catch (err) {
        alert('Failed to add book.');
      }
    }
  };

  const handleEditClick = (book) => {
    setEditingIsbn(book.isbn);
    setForm({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      cost: book.cost.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditingIsbn(null);
    setForm({ isbn: '', title: '', author: '', publisher: '', cost: '' });
  };

  const handleDelete = async (isbn) => {
    if (!window.confirm(`Are you sure you want to delete the book with ISBN: ${isbn}?`)) return;
    try {
      const res = await fetch(`${API_URL}/books/${isbn}`, { method: 'DELETE' });
      if (res.ok) {
        alert('🗑️ Book deleted!');
        fetchBooks();
      } else {
        alert('Failed to delete book.');
      }
    } catch (err) {
      alert('Error deleting book.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchQuery, searchBy);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    fetchBooks();
  };

  const getMinMaxCostBooks = () => {
    if (books.length === 0) return { highest: null, lowest: null };
    let highest = books[0];
    let lowest = books[0];
    books.forEach((b) => {
      if (b.cost > highest.cost) highest = b;
      if (b.cost < lowest.cost) lowest = b;
    });
    return { highest, lowest };
  };

  const { highest, lowest } = getMinMaxCostBooks();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      maxWidth: '900px',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      padding: '35px 40px'
    },
    title: {
      textAlign: 'center',
      color: '#2d3748',
      fontSize: '2.2rem',
      marginBottom: '25px',
      fontWeight: '700'
    },
    formBox: {
      background: editingIsbn ? '#fffaf0' : '#f0f9ff',
      border: editingIsbn ? '2px solid #f6ad55' : '2px solid #63b3ed',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '25px'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginBottom: '15px'
    },
    input: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #cbd5e0',
      fontSize: '14px',
      outline: 'none'
    },
    btnPrimary: {
      background: editingIsbn ? '#ed8936' : '#4299e1',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    btnCancel: {
      background: '#a0aec0',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      marginLeft: '10px'
    },
    statsBox: {
      background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
      borderLeft: '5px solid #319795',
      padding: '15px 20px',
      borderRadius: '10px',
      marginBottom: '25px',
      color: '#234e52'
    },
    searchBox: {
      display: 'flex',
      gap: '10px',
      marginBottom: '25px'
    },
    select: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #cbd5e0',
      background: '#fff'
    },
    btnSearch: {
      background: '#38a169',
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    btnReset: {
      background: '#718096',
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      background: '#4a5568',
      color: '#ffffff',
      padding: '12px',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e2e8f0',
      color: '#2d3748'
    },
    btnEdit: {
      background: '#ecc94b',
      color: '#744210',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '6px'
    },
    btnDelete: {
      background: '#e53e3e',
      color: '#fff',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📖 Smart Library System</h1>

        {/* Add / Edit Form Box */}
        <div style={styles.formBox}>
          <h3 style={{ marginTop: 0, color: editingIsbn ? '#c05621' : '#2b6cb0' }}>
            {editingIsbn ? '✏️ Edit Book Details' : '➕ Add New Book'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGrid}>
              <input
                style={styles.input}
                name="isbn"
                placeholder="ISBN Code"
                value={form.isbn}
                onChange={handleChange}
                disabled={editingIsbn !== null}
              />
              <input
                style={styles.input}
                name="title"
                placeholder="Book Title"
                value={form.title}
                onChange={handleChange}
              />
              <input
                style={styles.input}
                name="author"
                placeholder="Author Name"
                value={form.author}
                onChange={handleChange}
              />
              <input
                style={styles.input}
                name="publisher"
                placeholder="Publisher"
                value={form.publisher}
                onChange={handleChange}
              />
              <input
                style={styles.input}
                name="cost"
                type="number"
                placeholder="Cost ($)"
                value={form.cost}
                onChange={handleChange}
              />
            </div>
            <div>
              <button type="submit" style={styles.btnPrimary}>
                {editingIsbn ? 'Update Book' : 'Add Book'}
              </button>
              {editingIsbn && (
                <button type="button" onClick={handleCancelEdit} style={styles.btnCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* High / Low Cost Summary */}
        {books.length > 0 && (
          <div style={styles.statsBox}>
            <p style={{ margin: '4px 0' }}>
              💎 <strong>Highest Cost Book:</strong> {highest?.title} (${highest?.cost})
            </p>
            <p style={{ margin: '4px 0' }}>
              🏷️ <strong>Lowest Cost Book:</strong> {lowest?.title} (${lowest?.cost})
            </p>
          </div>
        )}

        {/* Search Bar */}
<form onSubmit={handleSearch} style={styles.searchBox}>
  <select style={styles.select} value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
    <option value="title">Search by Title</option>
    <option value="author">Search by Author</option>
    <option value="publisher">Search by Publisher</option>
    <option value="isbn">Search by ISBN</option>
  </select>
  <input
    style={{ ...styles.input, flex: 1 }}
    placeholder="Type keyword to search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <button type="submit" style={styles.btnSearch}>Search</button>
  <button type="button" onClick={handleResetSearch} style={styles.btnReset}>Reset</button>
</form>

        {/* Books Table */}
        <h3 style={{ color: '#1e1e1f' }}>📚 Book Records ({books.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ISBN</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Author</th>
              <th style={styles.th}>Publisher</th>
              <th style={styles.th}>Cost ($)</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '20px' }}>
                  No books found in records.
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.isbn}>
                  <td style={styles.td}>{b.isbn}</td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{b.title}</td>
                  <td style={styles.td}>{b.author}</td>
                  <td style={styles.td}>{b.publisher}</td>
                  <td style={{ ...styles.td, color: '#2b6cb0', fontWeight: 'bold' }}>${b.cost}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEditClick(b)} style={styles.btnEdit}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b.isbn)} style={styles.btnDelete}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
