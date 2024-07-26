// src/components/PostList.js
"use client";  // Indica que este es un componente de cliente

import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import PostForm from './PostForm';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const sortedPosts = useMemo(() => {
    let sortablePosts = [...posts];
    if (sortConfig !== null) {
      sortablePosts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePosts;
  }, [posts, sortConfig]);

  const filteredPosts = useMemo(() => {
    return sortedPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedPosts, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

//LOGIN//
const fetchUsers = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    // Realiza una solicitud GET a la API y espera la respuesta

    return response.data;
    // Devuelve los datos obtenidos desde la API

  } catch (error) {
    console.error('Error fetching users:', error);
    // Si hay un error durante la solicitud, muestra un mensaje de error en la consola

    return [];
    // Devuelve un array vacío como valor predeterminado en caso de error
  }
};


  const handleLogin = async () => {
    const users = await fetchUsers();
    const authenticatedUser = users.find(user => user.username === username && user.username === password);

    if (authenticatedUser) {
      // Usuario autenticado, mostrar contenido protegido
      setIsLoggedIn(true);
      fetchPosts(); // Llamar a la función para obtener las publicaciones
    } else {
      
      setError('Usuario no identificado');
      
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <main className="flex-1 flex justify-center">
          <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Iniciar Sesión</h2>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button onClick={handleLogin} className="bg-blue-500 text-white py-2 px-4 rounded w-full">Login</button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mb-4">List CRUD</h2>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by title" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <PostForm post={editingPost} onSave={() => { setEditingPost(null); fetchPosts(); }} />
      <div className="bg-white p-6 rounded shadow">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-700 text-white cursor-pointer" onClick={() => requestSort('id')}>Id</th>
              <th className="px-4 py-2 bg-gray-700 text-white cursor-pointer" onClick={() => requestSort('title')}>Title</th>
              <th className="px-4 py-2 bg-gray-700 text-white cursor-pointer" onClick={() => requestSort('body')}>Body</th>
              <th className="px-4 py-2 bg-gray-700 text-white">Editar</th>
              <th className="px-4 py-2 bg-gray-700 text-white">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((post) => (
              <tr key={post.id}>
                <td className="border px-4 py-2">{post.id}</td>
                <td className="border px-4 py-2">{post.title}</td>
                <td className="border px-4 py-2">{post.body}</td>
                <td className="border px-4 py-2 text-blue-500 cursor-pointer" onClick={() => setEditingPost(post)}>Editar</td>
                <td className="border px-4 py-2 text-red-500 cursor-pointer" onClick={() => deletePost(post.id)}>Eliminar</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button 
              key={index} 
              onClick={() => handleClick(index + 1)}
              className={`px-3 py-1 mx-1 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
