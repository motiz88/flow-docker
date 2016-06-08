'use strict';
var https = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');

function getReleases(cb) {
    var releasesUrl = 'https://api.github.com/repos/facebook/flow/releases';
    try {
        var options = url.parse(releasesUrl);
        options.headers = {
            'User-Agent': 'motiz88/flow-docker/sync-releases.js'
        };
        https.get(options, function(res) {
            if (res.statusCode !== 200)
                return cb(new Error(res.statusMessage));
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                try {
                    var parsed = JSON.parse(data);
                    cb(null, parsed);
                } catch (e) {
                    cb(e);
                }
            });
            res.on('error', cb);
        });
    } catch (e) {
        cb(e);
    }
}

function isUsableRelease(release) {
    return !release.draft && release.tag_name !== '' && !release.prerelease;
}

function isUsableAsset(asset) {
    return asset.content_type === 'application/zip' && asset.name && asset.name.indexOf('linux64') !== -1 && asset.browser_download_url;
}

function getDockerfileSourceForAsset(asset) {
    return ['FROM buildpack-deps:jessie-curl',
        '',
        'RUN apt-get update \\',
        '	&& apt-get install -y unzip libelf1 \\',
        '	&& apt-get clean \\',
        '	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \\',
        '	&& curl -SL "' + asset.browser_download_url + '" -o "' + asset.name + '" \\',
        '	&& unzip "' + asset.name + '" -d /usr/local \\',
        '	&& rm "' + asset.name + '"',
        '',
        '',
        'ENV PATH /usr/local/flow:$PATH',
        '',
        'VOLUME /app',
        'WORKDIR /app',
        '',
        'CMD ["flow", "check"]'
    ].join('\n');
}

getReleases(function(err, releases) {
    if (err)
        throw err;
    releases.filter(isUsableRelease)
        .forEach(function(release) {
            var assets = release.assets.filter(isUsableAsset);
            if (assets.length > 1) {
                console.warn('Ambiguous assets for release', release.name);
                return;
            }
            if (assets.length < 1)
                return;
            var dockerfileSource = getDockerfileSourceForAsset(assets[0]);

            var outputDir = release.tag_name;
            try {
            	fs.mkdirSync(outputDir);
            }
            catch (e) {
            	if (e.code !== 'EEXIST')
            		throw e;
            }
            var outputDockerfilePath = path.join(outputDir, 'Dockerfile');
            fs.writeFileSync(outputDockerfilePath, dockerfileSource);
        });
});