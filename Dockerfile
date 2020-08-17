FROM nginx:stable

MAINTAINER Jiashiwen "jiashiwen@jd.com"

COPY conf.d/dashboard.conf /etc/nginx/conf.d
COPY dist /dist
