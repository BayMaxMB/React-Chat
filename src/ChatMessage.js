import React from 'react'

export default ({ name, message, time }) => {
return (
  <p>
    <strong>{name}</strong> <em>{message}</em> <i>{time}</i>
  </p>
)
}
  