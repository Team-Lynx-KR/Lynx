import { useAuthStore } from '@renderer/store/AuthStore'
import { client } from '@renderer/api/client'
import { useState } from 'react'

function Home(): React.JSX.Element {
  const logout = useAuthStore((state) => state.logout)
  const [profileResult, setProfileResult] = useState<string>('')

  const handleLogout = () => {
    logout()
  }

  const handleGetProfile = async () => {
    try {
      const response = await client.get('/api/auth/profile')
      setProfileResult(JSON.stringify(response.data, null, 2))
    } catch (error: any) {
      setProfileResult(`에러: ${error.response?.data?.message || error.message}`)
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">홈</h1>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>

        <div className="home-card">
          <p className="home-welcome">환영합니다!</p>
          <button onClick={handleGetProfile} style={{ marginTop: '20px', padding: '10px 20px' }}>
            프로필 조회
          </button>
          {profileResult && (
            <pre style={{ marginTop: '20px', padding: '10px', background: 'black', color: 'white', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
              {profileResult}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

