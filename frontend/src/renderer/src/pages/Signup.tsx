import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../api/client'
import Modal from '../components/Modal'

function Signup(): React.JSX.Element {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await client.post('/api/auth/register', { username, email, password })
      
      if (response.data) {
        setShowSuccessModal(true)
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError('회원가입 중 오류가 발생했습니다')
      } else {
        setError('회원가입 중 오류가 발생했습니다')
      }
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/login')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">회원가입</h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              사용자명
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              placeholder="사용자명을 입력하세요"
            />
          </div>

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
            회원가입
          </button>
        </form>

        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="회원가입 성공"
        message="회원가입이 완료되었습니다. 로그인 페이지로 이동합니다."
      />
    </div>
  )
}

export default Signup

