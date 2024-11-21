import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Image from 'next/image';

const TeamPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Grant McNatt',
      url: 'https://www.linkedin.com/in/grant-mcnatt/',
      role: 'Lead Developer',
      imageUrl: '/images/team/grant-pfp.jpg',
    },
    {
      name: 'Chance French',
      url: 'https://www.linkedin.com/in/chance-french/',
      role: 'Project Manager',
      imageUrl: '/images/team/chance-pfp.jpg',
    },
    {
      name: 'Andrew Riggan',
      url: 'https://www.linkedin.com/in/andrew-riggan-78335a24a/',
      role: 'QA Engineer',
      imageUrl: '/images/team/andrew-pfp.jpg',
    },
    {
      name: 'Harrison Pham',
      url: 'https://www.linkedin.com/in/harrison2204/',
      role: 'Data Analyst',
      imageUrl: '/images/team/harrison-pfp.jpg',
    },
    {
      name: 'Justin Liao',
      url: 'https://www.linkedin.com/in/justinliao/',
      role: 'Regulatory Affairs Specialist',
      imageUrl: '/images/team/justin-pfp.jpg',
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Team - Vial Counting Platform</title>
        <meta name="description" content="Meet our team of developers" />
      </Head>

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8">
            Connect with our talented team members
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member) => (
            <a
              key={member.name}
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md 
                       hover:shadow-lg transition-all duration-200 hover:scale-102 hover:bg-gray-50 
                       dark:hover:bg-gray-700"
            >
              {/* Profile Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 rounded-full overflow-hidden 
                          group-hover:ring-4 ring-blue-500 ring-opacity-50 transition-all duration-200">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 128px"
                />
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-600 
                           dark:group-hover:text-blue-400 transition-colors duration-200">
                  {member.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {member.role}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;