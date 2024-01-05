# syntax=docker/dockerfile:1

ARG DOTNET_VERSION=8.0
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION}-alpine AS build
ARG TARGETPLATFORM
ARG TARGETARCH
ARG TARGETOS
WORKDIR /source
COPY . .
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish src/IdentityProvider.Api/ \
    -c Release \
    -o /app \
    -a ${TARGETARCH/amd64/x64} \
    --os $TARGETOS

FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}-alpine AS final
WORKDIR /app
COPY --from=build /app/ .
RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENTRYPOINT ["dotnet", "IdentityProvider.Api.dll"]