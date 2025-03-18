FROM sail-8.3/app

COPY scheduler.sh /usr/local/bin/scheduler
RUN chmod +x /usr/local/bin/scheduler

ENV WWWUSER=${WWWUSER:-1000}
ENV WWWGROUP=${WWWGROUP:-1000}

USER ${WWWUSER}:${WWWGROUP}

ENTRYPOINT ["/usr/local/bin/scheduler"]
