import React from 'react';

export function TestAnalytics() {
  return (
    <div style={{ border: '4px solid red', padding: '20px', margin: '20px' }}>
      <h1 style={{ color: 'red', fontSize: '24px', marginBottom: '20px' }}>
        Test Analytics Page
      </h1>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        border: '2px dashed blue',
        padding: '20px' 
      }}>
        <div style={{ 
          backgroundColor: 'yellow', 
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h2>Section 1</h2>
          <p>This is a test section</p>
        </div>

        <div style={{ 
          backgroundColor: 'lightgreen', 
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h2>Section 2</h2>
          <p>This is another test section</p>
        </div>

        <div style={{ 
          backgroundColor: 'lightblue', 
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h2>Section 3</h2>
          <p>This is a third test section</p>
        </div>
      </div>
    </div>
  );
} 