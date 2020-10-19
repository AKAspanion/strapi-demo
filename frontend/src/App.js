import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <ul>
          <li>
            <Link to="/">Travel Articles</Link>
          </li>
          <li>
            <Link to="/create">Create Article</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/create">
            <CreateArticle />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:1337/travel-blogs");

        const data = await response.json();
        console.log(data);

        if (!data.statusCode) {
          setBlogs(data);
        }
      } catch (err) {
        setBlogs([]);
      }
    })();
  }, []);

  const getUrl = (thumbnail) =>
    thumbnail && thumbnail[0] ? thumbnail[0].url : null;

  return (
    <div>
      <h2>Travel Articles</h2>
      {(blogs || []).map(({ slug, title, content, thumbnail }) => (
        <div key={slug} style={{ padding: 24 }}>
          <h3>{title}</h3>
          <p>{content}</p>
          <img
            width="200"
            alt={title}
            src={`http://localhost:1337${getUrl(thumbnail)}`}
          />
        </div>
      ))}
    </div>
  );
}

function CreateArticle() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title,
        content,
      })
    );
    formData.append("files.thumbnail", file);

    const response = await fetch("http://localhost:1337/travel-blogs", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  };
  return (
    <div>
      <h2>Create Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            value={content}
            placeholder="Content"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <input
            type="file"
            placeholder="GiveÍß a thumbnail"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
