import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'

const SimilarJobs = props => {
  const {similarJobData} = props
  const {
    companyLogoUrl,
    jobDescription,
    location,
    employementType,
    rating,
    title,
  } = similarJobData

  console.log(similarJobData)

  return (
    <li>
      <div>
        <img src={companyLogoUrl} alt="similar job company logo" />
        <div>
          <h1>{title}</h1>
          <div>
            <AiFillStar />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <div>
          <div>
            <MdLocationOn />
            <p>{location}</p>
          </div>
          <p>{employementType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
