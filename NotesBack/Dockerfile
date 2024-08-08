FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build 
ARG BUILD_CONFIGURATION=Development
WORKDIR /app 

COPY NotesBack/NotesBack/*.csproj ./ 
RUN dotnet restore 

COPY NotesBack/. . 

RUN dotnet publish -c Release -o out 

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime 
WORKDIR /app 
COPY --from=build /app/out ./ 

EXPOSE 8080 

ENTRYPOINT [ "dotnet" , "NotesBack.dll" ]