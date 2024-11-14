import React, { useState } from 'react';

const TeamLinks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const teamMembers = [
    { name: 'Justin Liao', url: 'https://www.linkedin.com/in/justinliao/' },
    { name: 'Chance French', url: 'https://www.linkedin.com/in/chance-french/' },
    { name: 'Andrew Riggan', url: 'https://www.linkedin.com/in/andrew-riggan-78335a24a/' },
    { name: 'Harrison Shoemaker', url: 'https://www.linkedin.com/in/harrison2204/' },
    { name: 'Grant McNatt', url: 'https://www.linkedin.com/in/grant-mcnatt/' },
  ];

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
      >
        #openforhire
      </button>
      {isOpen && (
        <div 
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 transform transition-all duration-200 ease-in-out opacity-100 scale-100"
        >
          {teamMembers.map((member) => (
            <a
              key={member.name}
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {member.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamLinks;