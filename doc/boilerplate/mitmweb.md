To aid in development and debugging, there is a proxy server container running
in development (mitmproxy) which runs two processes:

1. a reverse proxy, listening on 8080, that forwards to the appserver but logs
all traffic. if you use the application locally via 8080 instead of 3000, you
can have your traffic loggable and inspectable

2. a web UI, listening on 8081, that allows inspection of the traffic seen on 8080

there is a minimal custom docker image to wrap the proxy processes in
`dumb-init`, so that it can better handle signals from docker compose, for
faster stop times. this container uses the env var `UPSTREAM` to define the
endpoint for reverse proxying, which defaults to the appserver.
