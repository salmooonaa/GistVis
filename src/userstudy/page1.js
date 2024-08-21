import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
const width = window.innerHeight 
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '50px', height:width }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {['Unprocessed article 1', 'Unprocessed article 2', 'Unprocessed article 3'].map((article, index) => (
                <Link key={index} to={`/interactive/${index + 1}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <button style={{ padding: '10px 20px', fontSize: '16px', margin: '5px', width: '100%' }}>
                    {article}
                    </button>
                </Link>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '20px' }}>
                {['Processed article 1', 'Processed article 2', 'Processed article 3'].map((article, index) => (
                <Link key={index + 3} to={`/interactive/${index + 4}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <button style={{ padding: '10px 20px', fontSize: '16px', margin: '5px', width: '100%' }}>
                    {article}
                    </button>
                </Link>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HomePage;