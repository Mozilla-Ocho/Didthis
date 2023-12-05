# Setting up very basic monitoring + alerting

Currently, monitoring and alerting are not provisioned automatically through
terraform, which is a TODO.  For now, they are easy to setup via the gcp admin
gui.

## Define a notification channel

First you need a "notification channel" which is a place to send alerts, e.g.
your cell phone.

In the cloud admin web console, search "notification channels" and select the
subpage from the monitoring parent page. Under "SMS" (you can do others, SMS is
a good start), "add new" and add your cell phone and call it something like
"jwhiting sms" so it's clear when picking it as a notification channel for
subsequent alerts.

## Create an uptime check

An uptime check is used to assert the application responds from external
networks in various parts of the world, with a specific response code and page
substring.

In cloud admin gui, go to "uptime checks" and choose "create uptime check". Set
protocol to HTTPS, URL resource type, and point it to your appserver homepage
(or a dedicated health check page if desired, if the homepage is cached and
isn't a good proxy for health, etc.)

It's recommended to also include response validation, asserting a 200 response
code and a specific, expected substring in the response body, for example the
expected page title.

Then assign an alert and associate the notification channel of choice.

In the final step you'll set a name for the uptime check e.g. "appname uptime
check" or similar.

If your app goes down, or you SSL certificate expires, etc, you'll get an SMS.

## Getting alerts for 5xx errors in the appserver

Navigate to the "alerting" subpage of the monitoring section, you can create a
new policy. 

Let's get alerted on any non-zero quanity of 5xx responses on the appserver,
since we should be getting none of those, in theory, and should investigate and
resolve any of them.

For the metric, select "cloud run revision" > "request count". Then apply a
filter of type "response code class" and set it equal to "5xx".

In the "transform data", you want to set the window function to "count" and go
to the next step.

Choose "threshold" condition and set the threshold to 0.

Name the condition something like "appname nonzero 5xx"

Lastly setup the alert and notification channel and finish the creation.

## Lots more is possible

This is a very basic way to get started, but the whole range of GCP monitoring
and alerting tooling is available.


