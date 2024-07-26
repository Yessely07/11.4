// src/components/PostForm.js
import React, { useState } from 'react';
import axios from 'axios';

export default function PostForm({ post = {}, onSave }) {
  const initialTitle = post && post.title ? post.title : '';
  const initialBody = post && post.body ? post.body : '';

  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { title, body };

    try {
      if (post.id) {
        await axios.put(`/api/posts/${post.id}`, newPost);
      } else {
        await axios.post('/api/posts', newPost);
      }
      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-200 p-6 rounded mb-4">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700">Title</label>
        <input 
          id="title"
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="body" className="block text-gray-700">Body</label>
        <textarea 
          id="body"
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
    </form>
  );
}
