import React from 'react';


const styles = `
.tags-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  font-family: 'Press Start 2P', monospace; /* Fuente pixelada */
  font-size: 0.7rem; /* Ajusta según tus otros textos pixelados */
}

.tags-bar button {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: #eee;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-family: inherit; /* Hereda la fuente del contenedor */
}

.tags-bar button.active {
  background-color: #b84387;
  color: white;
}

.tags-bar button:hover {
  background-color: #d98fb2;
}

`;

export default function TagsBar({ tags, selectedTag, onSelectTag }) {
  return (
    <>
      <style>{styles}</style>
      <div className="tags-bar">
        {tags.map(tag => (
          <button
            key={tag}
            className={tag === selectedTag ? "active" : ""}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </>
  );
}
