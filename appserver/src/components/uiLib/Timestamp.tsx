import { useEffect, useState } from 'react'

const absDate = (date: Date) =>
  date
    .toLocaleString()
    // replace 6/10/2023 with just 6/10/23
    .replace(/(\d+\/\d+\/)20(\d\d)/, '$1$2')
    // replace 4:15:32 PM with 4:15 PM
    .replace(/(\d+:\d+):\d+/, '$1')
    .toLowerCase()

const handlePlural = (s: string, n: number) =>
  n === 1 ? s.replace('S', '') : s.replace('S', 's')

const humanize = (millis: number) => {
  const date = new Date(millis)
  const diffSec = Math.floor((new Date().getTime() - millis) / 1000)
  if (diffSec < 0) return absDate(date)
  if (diffSec < 10) return 'just now'
  if (diffSec < 60) return diffSec + handlePlural(' secondS ago', diffSec)
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return diffMin + handlePlural(' minuteS ago', diffMin)
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return diffHr + handlePlural(' hourS ago', diffHr)
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return diffDay + handlePlural(' dayS ago', diffDay)
  return absDate(date)
}

const Timestamp = ({ millis }: { millis: number }) => {
  // timestamps are client-side. render empty on SSR
  // TODO: do this better so that SSR fetches actually have the content. the
  // issue is that time zones can vary and the toLocaleString() isn't
  // guaranteed to be the same client/server. maybe i could render them
  // using a fixed timezone and locale first, then re-render client side?
  const [rendered, setRendered] = useState(false)
  useEffect(() => {
    setRendered(true)
  }, [setRendered])
  if (rendered) {
    return <span>{humanize(millis)}</span>
  } else {
    return <span>&nbsp;</span>
  }
}

export default Timestamp
