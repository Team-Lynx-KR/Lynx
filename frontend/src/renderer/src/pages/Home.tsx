import { useAuthStore } from '@renderer/store/AuthStore'

function Home(): React.JSX.Element {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    // 이것만 실행하면 isAuthenticated가 false로 바뀌고,
    // App.tsx가 알아서 로그인 화면으로 전환해줍니다.
    logout()
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
        </div>
      </div>
    </div>
  )
}

export default Home

