#编译
FROM node:10-alpine as build
LABEL maintainer="caozhiwu <caozhiwu@wctsoft.com>" description="process-builder-ui"
WORKDIR /app

COPY package.json .

RUN echo "https://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories && \
    echo "https://mirrors.aliyun.com/alpine/v3.9/community/" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add --no-cache bash && \
    apk add --no-cache git

RUN \
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ && \
npm config set registry https://registry.npm.taobao.org/ && \
npm rebuild node-sass && \
npm --unsafe-perm install

ENV REACT_APP_HOST_IP $REACT_APP_HOST_IP
COPY . .
RUN npm run build

#运行
FROM nginx:1.16.0-alpine
LABEL maintainer="caozhiwu <caozhiwu@wctsoft.com>" description="iot前端"
COPY --from=build app/build /web/app
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
