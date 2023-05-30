# Develop a Node.JS API that allows a client app to:

## TODO

- [ ] Add the file permissions/attribute information to the results.

## Features Needed

- Obtain the full directory listing of a given directory path on the local filesystem of the host machine where the API is running.
- Include the filename, full path, file size, extension/file type and created date in the result and cater for a large directory size ( at least 100 000).

  - [ ] Pagination?
  - [ ] Caching?

- Add the file permissions/attribute information to the results.

- Differentiate between a directory and a file in the results.

- A directory should be selectable and update the results with the newly selected directory path.

- Make sure the application is containerized and can run on any system. REST or GraphQL can be used. We are a GraphQL company, but if you are unfamiliar with the subject matter, it is advisable that you use what you know best.

Model

```ts
name: string;
path: string;
size: number;
extension: string;
createdAt: string;
permissions: string;
```

## Questions

- [ ] Should the API give all the contents? Or incremental?
  - i.e. Should it render the entire directory

## GraphQL

- [ ] If time is available, use GraphQL

## Issues

- [x] root node createdAt always changes?
- [x] Crashes if the directory is `/`

## Developement Run

```
npm run watch && npm run dev
```

## Deploy

```
docker build . -t peterwest86/jobjack-server
```

## Run

```
docker run -p 3000:3000 -d peterwest86/jobjack-server:latest
```
