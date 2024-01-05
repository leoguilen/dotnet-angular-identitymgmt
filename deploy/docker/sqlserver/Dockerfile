FROM mcr.microsoft.com/mssql/server

COPY . .

ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]
CMD [ "/opt/mssql/bin/sqlservr" ]