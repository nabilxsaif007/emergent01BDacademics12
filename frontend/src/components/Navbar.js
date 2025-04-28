import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 w-full absolute top-0 z-10">
      <div className="text-white font-bold text-2xl">collide</div>
      <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
        Login
      </button>
    </nav>
  );
};

export default Navbar;
