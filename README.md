# Innovation Studio boilerplate app template

This boilerplate repo is still under initial development. We are exercising the
process of rapidly spinning up a reproducible application stack, see
docs/system-archictecture.png for the current architecture.

Goals:
- Minimize technical effort that isn't germane to the ideas we want to test
  - Select and develop tools we like as a team and commit to reusing them
  - All pods benefit from other pod contributions to the boilerplate
  - Re-use effort and learnings from Graceland’s stack
  - Quick to spin up for simple demos/prototypes
  - Encourage sharing dev effort and cross-contribution across pods with
    normalized conventions
- Serve also as a solid foundation for production MVPs and eventual GA releases
  - Moco-friendly stack: GCP-based, built on best practices with generic
    primitives, not reliant on third parties
  - Flexible, minimal, modular architecture that can replace or include new
    components as needed (alternate backends, cloud functions, A/B testing,
    CDNs, etc)
- Innovation Studio is the first customer, but this might provide value in Moz
  more broadly and/or as open source project.

