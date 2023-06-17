const Timestamp = ({ millis }: { millis: number }) => {
  const date = new Date(millis)
  return <span>{date.toISOString()}</span>
}

export default Timestamp
