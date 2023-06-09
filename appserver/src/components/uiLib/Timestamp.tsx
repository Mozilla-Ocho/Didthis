const Timestamp = ({seconds}:{seconds:number}) => {
  const date = new Date(seconds * 1000)
  return <span>{date.toISOString()}</span>
}

export default Timestamp
