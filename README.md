# Neon
A project display webapp to display your projects (public & private)

![](https://grantsommer.com/imgs/neon.png)

## Features
- Display projects in an organized grid view
- Sort projects based on project age
- Filter projects by language used, technologies used and if the source code is available
- Projects have a markdown rendered description
- Projects are manageable within the website based on a GitHub account
- Projects can have a timeline attached to them

## Issues
Please create an issue in the GitHub issue tracker above

## Building
1. Copy `.env` to `.env.local`
2. Put configuration options inside `.env.local`
   - `NEXT_PUBLIC_APP_NAME` is the top left text
   - `NEXT_PUBLIC_COPYRIGHT` is the bottom left text before the GitHub button
   - `MONGODB_URI` full mongodb uri including database (`mongodb://127.0.0.1:27017/neon`)
   - `NEXTAUTH_URL` hostname of the app (`https://neon.demo.com`)
   - `GITHUB_ID`, `GITHUB_SECRET` client id & client secret of a GitHub application (https://github.com/settings/applications/new)
   - `GITHUB_USER_EMAIL` email address of the github account that will become the one and only administrator
3. Run `npm run docker-build` to build the `neon:latest` docker image

## Get in contact
Send me an email at `contact [at] grantsommer [dot] com`
