import React from 'react'

function Splash(): React.JSX.Element {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-spinner"></div>
        <p className="splash-text">로딩 중...</p>
      </div>
    </div>
  )
}

export default Splash

