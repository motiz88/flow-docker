# flow-docker
Dockerfiles for Facebook's [Flow](http://flowtype.org) type checker.

While we all wait for [official Windows binaries](https://github.com/facebook/flow/issues/6), I have been happily running the latest Flow (0.11.0) on Windows using this [Docker](http://docker.io) image.

## Basic usage
The image has Flow preinstalled and in the PATH, so just mount your JavaScript at `/app` on a fresh container, start a Bash session inside it, and `flow init`, `flow start`, `flow check` should etc work normally:

```sh
$> docker run --rm -it -v /home/moti/projects/myapp:/app motiz88/flow bash
```

If you'd rather not keep a dedicated Bash window open, it should also be possible to, say, run the container in the background and `docker exec <container_id> flow` into it as needed.

## More information
This GitHub repo is built automatically as [motiz88/flow](https://registry.hub.docker.com/u/motiz88/flow) on Docker Hub. More instructions for use are available there.
