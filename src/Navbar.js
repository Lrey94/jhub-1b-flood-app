import React from "react";

export default function Navbar() {
  return (
    <nav className="nav-bar">
      <Logo />
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🌊</span>
      <h1>Flood</h1>
      <span role="img">💦</span>
    </div>
  );
}
