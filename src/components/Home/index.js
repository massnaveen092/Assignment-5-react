import {Link} from 'react-router-dom'
import Header from '../Header'

const Home = props => {
  console.log(props)
  const onClickFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <>
      <Header />
      <div>
        <h1>
          Find The Job That <br /> Fits Your Life
        </h1>
        <p>Millioms of peopls</p>
        <Link to="/jobs">
          <button onClick={onClickFindJobs} type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
