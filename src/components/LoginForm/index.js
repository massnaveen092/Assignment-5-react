import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errormsg: '',
    errorOccured: false,
  }

  onChangeUserName = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmmitSucess = jwttoken => {
    Cookies.set('jwt_token', jwttoken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFail = error => {
    this.setState({errormsg: error, errorOccured: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmmitSucess(data.jwt_token)
    } else {
      console.log(data)
      this.onSubmitFail(data.error_msg)
    }
  }

  render() {
    const {username, password, errormsg, errorOccured} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <form onSubmit={this.onSubmitForm}>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="username">USERNAME</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={this.onChangeUserName}
            placeholder="username"
            id="username"
          />
          <br />
          <input
            type="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="password"
            id="password"
          />
          <br />
          <button type="submit">Login</button>
          {errorOccured && <p>{errormsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
