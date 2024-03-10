import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'

const JobCardItem = props => {
  const {item} = props
  const {
    companyLogoUrl,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = item
  return (
    <>
      <Link to={`/jobs/${id}`}>
        <li>
          <div>
            <div>
              <img src={companyLogoUrl} alt="company logo" />
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
              </div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </li>
      </Link>
    </>
  )
}

export default JobCardItem
