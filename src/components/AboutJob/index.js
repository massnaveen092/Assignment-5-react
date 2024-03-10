import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJob extends Component {
  state = {
    jobDataDeteails: [],
    similarJobData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDta()
  }

  getJobDta = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const newData = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        lifeAtcompany: {
          description: each.life_at_company.description,
          image_url: each.life_at_company.image_url,
        },
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        skills: each.skills.map(eachSkill => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        title: each.title,
      }))

      const newSimilarJobsData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDataDeteails: newData,
        similarJobData: newSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobSucessView = () => {
    const {jobDataDeteails, similarJobData} = this.state
    if (jobDataDeteails.length > 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        lifeAtcompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDataDeteails[0]
      return (
        <>
          <div>
            <div>
              <img src={companyLogoUrl} alt="job Details Company Logo" />
              <div>
                <h1>{title}</h1>
                <div>
                  <AiFillStar />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <MdLocationOn />
                  <p>{location}</p>
                </div>
                <p>{employmentType}</p>
              </div>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr />
            <div>
              <div>
                <h1>Description</h1>
                <a href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p>{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul>
              {skills.map(each => (
                <li key={each.name}>
                  <img src={each.imageUrl} alt={each.name} />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <div>
                <h1>Life At Company</h1>
                <p>{lifeAtcompany.description}</p>
              </div>
              <img src={lifeAtcompany.imageUrl} alt="Life At Company" />
            </div>
            <h1>Similar Jobs</h1>
            <ul>
              {similarJobData.map(each => (
                <SimilarJobs
                  key={each.id}
                  similarJobsData={each}
                  employmentType={employmentType}
                />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  onRetryJobDetailsAgain = () => {
    this.getJobDta()
  }

  renderJobFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot fetch the data</p>
      <div>
        <button type="button" onClick={this.onRetryJobDetailsAgain}>
          retry
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="Loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobSucessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default AboutJob
