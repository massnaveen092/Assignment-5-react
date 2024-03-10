import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import JobCardItem from '../JobCardItem'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    profileData: {},
    jobsData: [],
    apiJobStatus: apiStatusConstants.initial,
    activeCheckBoxList: [],
    activeSalaryRangeList: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsDta()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtoken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtoken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const profile = data.profile_details
      const newProfileData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      console.log(newProfileData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        profileData: newProfileData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsDta = async () => {
    this.setState({apiJobStatus: apiStatusConstants.initial})
    const {activeCheckBoxList, activeSalaryRangeList, searchInput} = this.state
    const type = activeCheckBoxList.join(',')
    const jwttoken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeList}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }
    const response = await fetch(url, jwttoken)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const filterJobList = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(filterJobList)

      this.setState({
        apiJobStatus: apiStatusConstants.success,
        jobsData: filterJobList,
      })
    } else {
      this.setState({
        apiJobStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = e => {
    this.setState({
      searchInput: e.target.value,
    })
  }

  onEneterSearchInput = e => {
    if (e.key === 'Enter') {
      this.getJobsDta()
    }
  }

  onSubmitSearchInput = () => {
    this.getJobsDta()
  }

  onSelectSalaryRange = e => {
    this.setState(
      {
        salaryRangesList: e.target.value,
      },
      this.getJobsDta,
    )
  }

  onClickCheckBox = e => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(e.target.id)) {
      const newList = activeCheckBoxList.filter(each => each !== e.target.id)
      this.setState({activeCheckBoxList: newList}, this.getJobsDta)
    } else {
      this.setState(
        prevstate => ({
          activeCheckBoxList: [...prevstate.activeCheckBoxList, e.target.id],
        }),
        this.getJobsDta,
      )
    }
  }

  onSuccessProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div>
        <img src={profileImageUrl} alt={name} />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onSucessJobView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length > 0
    return noOfJobs ? (
      <>
        <ul>
          {jobsData.map(each => (
            <JobCardItem key={each.id} item={each} />
          ))}
        </ul>
      </>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found!</h1>
        <p>We could Provide As far As we Provide</p>
      </div>
    )
  }

  onRetryProfile = () => this.getProfileData()

  onRetryJobs = () => this.getJobsDta()

  onFailureProfileView = () => (
    <>
      <h1>Profile Fail</h1>
      <button onClick={this.onRetryProfile} type="button">
        Retry
      </button>
    </>
  )

  onFailureJobsView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! something Went Wrong!</h1>
        <p>We Cannot Fetch the Data</p>
        <div>
          <button type="button" onClick={this.onRetryJobs}>
            Retry
          </button>
        </div>
      </div>
    </>
  )

  onLoading = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onGetCheckBoxView = () => (
    <ul>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            id={each.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckBox}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId}>
          <input
            id={each.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onSelectSalaryRange}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  onRenderProfileData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccessProfileView()
      case apiStatusConstants.failure:
        return this.onFailureProfileView()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  onRenderJobsdata = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.onSucessJobView()
      case apiStatusConstants.failure:
        return this.onFailureJobsView()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEneterSearchInput}
          value={searchInput}
          placeholder="Search"
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch />
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div>
          <div>{this.renderSearchInput()}</div>
          <div>{this.onRenderProfileData()}</div>
          <hr />
          <h1>Type Of Employement</h1>
          <div>{this.onGetCheckBoxView()}</div>
          <hr />
          <h1>Salary Range</h1>
          <div>{this.onGetRadioButtonView()}</div>
          <hr />
        </div>
        <div>
          <div>{this.renderSearchInput()}</div>
          {this.onRenderJobsdata()}
        </div>
      </>
    )
  }
}

export default AllJobs
