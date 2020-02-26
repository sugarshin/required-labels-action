# required-labels-action

![GitHub release (latest by date)](https://img.shields.io/github/v/release/sugarshin/required-labels-action?include_prereleases)

A GitHub Actions that automated label checking for pull requests.

## Usage

### Inputs

|Parameter|Required|Description|
|:--:|:--:|:--|
|github_token|true|GitHub access token to use GitHub API|
|required_any|false|At least one of these comma separated labels should be present on all Pull requests|
|required_all|false|All of these comma separated labels must be present on all Pull requests|
|required_oneof|false|At only one of these comma separated labels should be present on all Pull requests|
|banned|false|None of these comma separated labels can be present on all Pull requests|

### Outputs

TBD

## Example Workflow

```yaml
name: Check labels

on:
  pull_request:
    types: [opened, labeled, unlabeled, reopened]

jobs:
  check-label:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: sugarshin/required-labels-action@v0.1.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          required_all: 'approved'
          required_oneof: 'patch,minor,major'
```
