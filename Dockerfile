FROM node:17.7.1-alpine3.15

RUN apk add --no-cache libc6-compat

RUN npm i -g npm

ARG NEXT_PUBLIC_APP_NAME=Neon
ARG NEXT_PUBLIC_COPYRIGHT=&copy;\ 2022\ Grant\ Sommer
ENV MONGODB_URI=mongodb://1.1.1.1:27017/neon
ENV NEXTAUTH_URL=https://neon.demo.com
ENV NEXTAUTH_SECRET=

# github client id & client secret
ENV GITHUB_ID=
ENV GITHUB_SECRET=

# github account email for management
ENV GITHUB_USER_EMAIL=

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

WORKDIR /home/nextjs/app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY . .

RUN chown -R nextjs:nodejs /home/nextjs

USER nextjs

RUN npm install --no-optional
RUN npx browserslist@latest --update-db
RUN npx next telemetry disable

RUN npm run build

CMD [ "npm", "start" ]
