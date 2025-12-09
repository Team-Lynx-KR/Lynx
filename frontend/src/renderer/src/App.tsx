import { HashRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/AuthStore' // Zustand 스토어 임포트
import Login from './pages/Login'
import Home from './pages/Home'

function App(): React.JSX.Element {
  // Zustand에서 '로그인 여부' 상태만 구독 (useEffect 필요 없음)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    // Electron에서는 BrowserRouter보다 HashRouter가 안전합니다 (새로고침 이슈 방지)
    <HashRouter>
      <Routes>
        <Route path="*" element={isAuthenticated ? <Home /> : <Login />} />
      </Routes>
    </HashRouter>
  )
}

export default App