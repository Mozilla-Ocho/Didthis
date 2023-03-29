
for now, each environment (prod, nonprod, etc) gets a workflow file that
has 99.9% the same complex content.

someday figure out how to do this with reusable workflows.

the problem i found is that i could not get environment variables, like
`var.TF_BACKEND_STATE_BUCKET` and so on, available to the reusable workflow.

things i tried:
- having the reusable workflow accept inputs, and caller workflow define
  `environment` in its spec and then pass `var.XYZ` to the values of those
  inputs per
  https://docs.github.com/en/actions/using-workflows/reusing-workflows but this
  failed, github complained the caller workflow can't specify an `environment`
  after it specifies a `uses`
- having the caller tell the reusable workflow what enviroment to use in the
  form of an input argument, and saying `environment: ${{
  input.use_this_environment }}"` in the reusable workflow spec. that didn't
  work either, the environment spec doesn't appear to work dynamically like
  that at least not the way i tried it. there is no clear example or doc for
  how to do this.

people in this thread - https://github.com/orgs/community/discussions/26671 -
are doing all sorts of weird things to make this work, including setting up a
runner machine JUST so it can output vars that reusable calls can be fed as
inputs. which takes extra time, costs 1m of compute time, etc.

this seems like a design flaw with environment vars and reusable workflows.

how are we supposed to define a single deployment workflow that can be run in N
environments, using each environment's variables as inputs??

