FROM mariadb:latest AS mariadb

ARG USER_ID
ARG GROUP_ID

RUN chown -R ${USER_ID}:${GROUP_ID} /var/lib/mysql/ && \
  chmod -R 770 /var/lib/mysql/ && \
  chown -R ${USER_ID}:${GROUP_ID} /run/mysqld && \
  chmod -R 770 /run/mysqld

COPY ./init.sql /docker-entrypoint-initdb.d/init.sql
RUN chown -R ${USER_ID}:${GROUP_ID} /docker-entrypoint-initdb.d/init.sql

EXPOSE 3306