import React from 'react';

interface PropTypes {
  text: string;
}

const Heading: React.FC<PropTypes> = ({ text }) => {
  return <h1 className="text-3xl sm:text-2xl font-bold text-gray-600 mb-14 self-start block dark:text-white transition-colors">{text}</h1>;
};

export default Heading;