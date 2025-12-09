import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // 회원가입 이동용으로만 남겨둠
import { useAuthStore } from '../store/AuthStore' // ✅ Zustand 스토어 임포트
import { client } from '../api/client'

function Login(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate() // 회원가입 페이지 이동할 때만 씀
  const login = useAuthStore((state) => state.login) // ✅ 스토어에서 로그인 함수 가져오기

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await client.post('/api/auth/login', { email, password });
      
      // 액세스 토큰과 리프레시 토큰 받아서 저장
      const { accessToken, refreshToken } = response.data;
      
      if (accessToken && refreshToken) {
        login(accessToken, refreshToken);
        // App.tsx가 isAuthenticated: true를 감지하고 즉시 <Home />으로 화면을 교체함
      } else {
        setError('토큰을 받지 못했습니다');
      }
    } catch (err: any) {
      // 에러 처리
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다');
      } else {
        setError('로그인 중 오류가 발생했습니다');
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        {/* 회원가입 버튼 추가 */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/signup')} 
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
          >
            계정이 없으신가요? 회원가입
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login