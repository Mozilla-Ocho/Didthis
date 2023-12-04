// this list serves to fuel the type definition as well as provide a runtime
// iterable
const channelNames = [
  'warn',
  'error',
  'auth',
  'readiness',
  'api',
  'unfurl',
  'location',
  'sql',
  'tracking',
  'serverApi',
  'debug',
] as const

//type Channel = typeof channelNames[number];
type ChannelName =
  | 'warn'
  | 'error'
  | 'auth'
  | 'readiness'
  | 'api'
  | 'unfurl'
  | 'location'
  | 'sql'
  | 'tracking'
  | 'serverApi'
  | 'debug'

type LoggingEnv = 'default' | 'test' | 'inProdBrowser' | 'ssr'

type EnvToggles = {
  // for each env, is a channel active or not
  [key in LoggingEnv]: boolean
}

type ChannelConfig = {
  // for each channel, what it's EnvToggles
  [key in ChannelName]: EnvToggles
}

type Logger = {
  // the main interface, a dict of channel name -> logging function
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  [key in ChannelName]: Function
}

// initialize log object to a map of channel names to dummy functions
/* eslint-disable-next-line @typescript-eslint/no-empty-function */
const log: Logger = Object.fromEntries([channelNames.map(c => [c, () => {}])])

let env: LoggingEnv = 'default'

if (typeof window === 'undefined') {
  env = 'ssr'
}
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  // in production browser context we use a more limited set of active logging
  // channels
  env = 'inProdBrowser'
}

const channelConfig: ChannelConfig = {
  warn: {
    default: true,
    test: true,
    inProdBrowser: true,
    ssr: true,
  },
  error: {
    default: true,
    test: true,
    inProdBrowser: true,
    ssr: true,
  },
  auth: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: false,
  },
  readiness: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: false,
  },
  api: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: false,
  },
  unfurl: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: true,
  },
  location: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: false,
  },
  sql: {
    default: true,
    test: false,
    inProdBrowser: false,
    ssr: true,
  },
  tracking: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: false,
  },
  serverApi: {
    default: true,
    test: false,
    inProdBrowser: false,
    ssr: true,
  },
  debug: {
    default: true,
    test: false,
    inProdBrowser: true,
    ssr: false,
  },
}

function setConfig(x: LoggingEnv) {
  env = x
  assign()
}

function assign() {
  for (const channel of channelNames) {
    if (channelConfig[channel][env]) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      log[channel] = (...args: any) => console.log(channel, ':', ...args)
    } else {
      log[channel] = () => false
    }
  }
}

function setTestMode() {
  setConfig('test')
}

assign()

export default log

export { setTestMode }
