import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Image from 'next/image';

const TeamPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Grant McNatt',
      url: 'https://www.linkedin.com/in/grant-mcnatt/',
      role: 'Full Stack Developer',
      imageUrl: '/images/team/grant-pfp.jpg',
    },
    {
      name: 'Chance French',
      url: 'https://www.linkedin.com/in/chance-french/',
      role: 'ML Engineer',
      imageUrl: '/images/team/chance-pfp.jpg',
    },
    {
      name: 'Andrew Riggan',
      url: 'https://www.linkedin.com/in/andrew-riggan-78335a24a/',
      role: 'Backend Developer',
      imageUrl: '/images/team/andrew-pfp.jpg',
    },
    {
      name: 'Harrison Pham',
      url: 'https://www.linkedin.com/in/harrison2204/',
      role: 'Frontend Developer',
      imageUrl: '/images/team/harrison-pfp.jpg',
    },
    {
      name: 'Justin Liao',
      url: 'https://www.linkedin.com/in/justinliao/',
      role: 'UI/UX Designer',
      imageUrl: '/images/team/justin-pfp.jpg',
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Team - Vial Counting Platform</title>
        <meta name="description" content="Meet our team of developers" />
      </Head>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Our Team</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Click To Connect!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {teamMembers.map((member) => (
          <a
            key={member.name}
            href={member.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
          </a>
        ))}
      </div>
    </Layout>
  );
};

export default TeamPage;