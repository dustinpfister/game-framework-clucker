# todo list for server-demo script

## ( done 09/07/2021 ) - createIndexHTML helper
* (done) start a createIndexHTML helper that will create and return an index of links for a given uri

## ( done 09/06/2021 ) - get lists for dirs
* (done) if the uri is a full path to a resource:
    * (done) get and set the pInfo.state prop
    * (done) set pInfo.mime, pInfo.ext, and pInfo.encoding
* (done) if the uri is a dir
    * (done) check for an index.html
    * (done) if html file, update pInfo.uri, and other props for that full path
    * (done) if no html file read dir, and gen html creating a pInfo.html prop

## ( done 09/06/2021 ) - createPathInfoObject helper
* (done) have a createPathInfoObject helper that will return a custom path object
* (done) the custom path object will contain the origional req.url property as pInfo.url
* (done) the pInfo.uri will then be the location to actually use to send a resource

## ( done 09/06/2021 ) - use promises
* (done) use promises for fs methods