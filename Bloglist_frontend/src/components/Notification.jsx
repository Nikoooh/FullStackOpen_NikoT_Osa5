import '../index.css'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  return (
    (message.type) 
      ?   
      <div className={message.type}>
        {message.message}
      </div>
      : 
      null
  )
}

Notification.propTypes = {
  message: PropTypes.object.isRequired
}

export default Notification