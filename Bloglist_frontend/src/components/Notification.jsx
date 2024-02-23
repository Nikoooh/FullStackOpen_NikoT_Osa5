import '../index.css'

const Notification = ({message}) => {
    return (
        (message) 
        ?   
            <div className={message.type}>
                {message.message}
            </div>
        : null
    )
}

export default Notification