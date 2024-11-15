# Didthis (archived)

Didthis was an experimental project of the Mozilla Innovation Studio. Its aim
was to provide a useful hobby project journaling and sharing tool, and a social
platform for hobbyists to share and celebrate their works in progress, as well
as their knowledge and resources.

This repository has been made open source as part of sunsetting Didthis, which
was announced on Oct 15th, 2024 and took place on Nov 15th 2024. Read more
[here](https://future.mozilla.org/didthis-has-shut-down/).

It contains the code for the Didthis web application. The iOS mobile
application is also included in the `integrations/mobile-app` folder, and
principally is a webview around this web application using Expo and React
Native.

This code is provided as-is for posterity and good will, and is not actively
maintained.

What follows is a brief overview of the application architecture for anyone
interested in this codebase.

## Application architecture

Didthis was a React.js (client side) and Next.js (server side) web application,
written in Typescript, running on GCP infrastructure. It used Firebase and
Apple Sign In for authentication, and Postgres for the database (using knex.js
for migrations and queries). It was deployed principally via Google Cloud Run
in Docker containers, using Github actions and Terraform (infrastructure as
code).

In addition to the client and application server are a Discord bot, which
integrated Didthis to our Discord and allowed users to post content there
automatically, and an exports job system, and the iOS app.

Didthis communicated with third party services for the following purposes:
* Firebase, for authentication
* Apple Sign In, for authentication
* Discord, for the Discord bot
* Amplitude, for product analytics
* Zyte, for fetching link previews

## The "boilerplate" infrastructure

The GCP infratructure was largely managed using a project we refer to
internally as the "boilerplate", which is a separate template that provides the
Terraform for GCP infrastructure, and most of the Github action workflows. You
may see references to this "boilerplate" and this repository generally includes
most of that content.

However, the boilerplate did rely on separate repositories which are not
included, especially for VPC setup and DNS configurations. This repository
instead contains dangling references to those resources.

Furthermore, the Github actions expect a setup that is no longer complete and
depended on an environment, including variables and secrets, that are no longer
present. For example, Firebase credentials, GCP provisioning credentials, a
prod and nonprod GCP project pair, repository contributor permissions, Github
issues for deployment approval workflows, the VPC and DNS per above, and so on.

You will see history referring to branches named releases/prod and
releases/nonprod, which were the branches that triggered these deployment
workflows.

## License

Didthis is provided under the Mozilla Public License 2.0. You can find the full
text of the license in the LICENSE file in this repository.

## Authors

Didthis was developed by the Mozilla Innovation Studio with principal
contributions from a number of individuals:

* Stephen Hood, product manager
* Josh Whiting, engineer
* Les Orchard, engineer
* Amy Chiu, designer
* Kate Taylor, designer and engineer
