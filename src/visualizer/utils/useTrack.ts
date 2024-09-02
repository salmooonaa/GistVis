import React, { useEffect, useRef, useState } from 'react';
const generateUniqueIdentifier = () => Math.random().toString(36).substr(2, 9);
const useTrackVisit = (id:string) => {
    const [visitCount, setVisitCount] = useState(0);
    const stayStartTimeRef = useRef<number | null>(null); 
    const [identifier, setID] = useState(id);
    const handleMouseEnter = () => {
      if (stayStartTimeRef.current === null) {
        setVisitCount((prevCount) => prevCount + 1);
        stayStartTimeRef.current = Date.now(); 
      }
    };
  
    const handleMouseLeave = () => {
      if (stayStartTimeRef.current !== null) {
        const stayTime = Date.now() - stayStartTimeRef.current; 
        const data = {
          identifier: identifier,
          visitCount: visitCount,
          stayTime: stayTime
        };
    
        fetch('http://localhost:5000/api/trackVisit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    
        stayStartTimeRef.current = null; 
      }
    };
  
    useEffect(() => {
      return () => {
        if (stayStartTimeRef.current !== null) {
          console.log('Component unmounted while hovering');
        }
      };
    }, []);
  
    return {
      visitCount,
      handleMouseEnter,
      handleMouseLeave,
      identifier
    };
  }
  
export default useTrackVisit;

