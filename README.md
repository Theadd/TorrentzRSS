TorrentzRSS!
===========
### [Website](http://theadd.github.io/TorrentzRSS/) &nbsp; [Structure](#structure) &nbsp; [Advanced Rules](#advanced-rules) &nbsp; [Installation](#installation) &nbsp; [Configuration](#configuration)

**TorrentzRSS** processes [torrentz.eu](http://www.torrentz.eu) RSS results from your search queries and provides a set of advanced rules to merge multiple queries, sort them and exclude unwanted torrents from your search results in several ways. The output can be retrieved by **XML** (**RSS**), **JSON** or using the **web** interface.

## Structure
Front and back ends are independent so you can separate the API (back end) from the web interface (front end) and call the API from your application.

The back end (API) is only composed by a single *process.php* and an empty *data* folder with write permissions.

## Advanced Rules
*The execution order of advanced rules and the weight of its parameters is* **fully customizable**.
* Limit number of results
* Merge results from another TorrentzRSS query ID *(Useful when your search query is too long)*
* Intersect results from another TorrentzRSS query ID *(Useful to avoid duplicates over time)*
* Sort results in several ways
* Exclude duplicates from searches containing movies or TV shows
* Exclude by patterns on title or category field (Using REGEX or string literals)
* Evaluate conditionals, e.g. seeds > 100

*Do you think of another rule that might be necessary? Create a new issue.*

## Installation
### Installation: Full
* You can do it the hard way by uploading all files to your server and giving write permissions to data folder or simply: `git clone https://github.com/Theadd/TorrentzRSS.git ; chmod 0777 TorrentzRSS/data`
* Also install the dependencies from the next section to host your API (Or [link](#configuration) to a third party process.php instead).

### Installation: API Only
TorrentzRSS back end (process.php) needs PHP5+ with the following **dependencies**:
* `pear install XML_RSS`
* `pear install XML_Serializer-0.20.2`

> Only if you are unable to install these **dependencies** or you don't know what I'm talking about, extract the contents of [this](http://37.187.9.5/public/dependencies.zip) archive in the same directory of `process.php` while following the instructions below.

*It also requires [cURL](http://curl.haxx.se/download.html) but probably you already have it.*

**Instructions:**
* Copy `process.php` and `data` folder (*which is empty*) anywhere accessible by your web server.
* Set write permissions to `data` folder, `chmod 0777 data` will do the job.
* Open your browser and navigate to `http://YOURSERVER/process.php?f=rss&p=feed-1&q=example` and make sure it works properly.

## Configuration
* **API**: In most cases you won't need to configure anything but if you feel curious or you need to configure a proxy to access torrentz.eu you can find the available parameters within the first lines of `process.php`:
```
define("RSSZ_DEBUG_MODE", true);
define("RSSZ_USE_PROXY", false);
define("RSSZ_PROXY", 'localhost:8118');
/** Allow web browsers to get content from this node when the requesting web page is located in another domain. */
define("RSSZ_ALLOW_CROSS_DOMAIN", true);
define("RSSZ_SITE_NAME", "TorrentzRSS!");
define("RSSZ_SITE_URL", "http://Theadd.github.io/TorrentzRSS/");
/** Time in minutes for torrent applications to wait between requests. */
define("RSSZ_MIN_TTL", 15);
/** Timeout in seconds per page requests from this node to torrentz.eu. */
define("RSSZ_TIMEOUT_PER_PAGE", 3);
/** Does this server/node act as master, delegating (some or all) requests to other API nodes?
 * NOTE: This only delegates cURL http requests to torrentz.eu, all data processing is still being done in this node. */
define("RSSZ_MULTIPLE_NODES", false);
    //EDIT ONLY IF RSSZ_MULTIPLE_NODES IS SET TO TRUE:
    /** Ratio of this node (e.g.: 0.2 = 20% of requests will be handled by this node). */
    define("RSSZ_RATIO", 0.5);
    /** $_NODES contains an array of nodes within "your" network of API nodes. */
    $_NODES = array(    //This are valid nodes provided as example
        array(
            "http://rssz.netau.net/process.php",    //{string} Remote node url to process.php
            0.1,    //{float} Ratio. (e.g.: 0.2 = 20% of requests will be handled by this node)
            1     //timeout per page request
        ),
        array(
            "http://mation.byethost15.com/process.php",
            0.15,
            0.75
        ),
        array(
            "http://rssz.esy.es/process.php",
            0.25,
            0.75
        )
    );
    //NOTE: The sum of all ratios should be 1.0 (RSSZ_RATIO + $_NODES[0][2] + ... + $_NODES[n-1][2]).
    //      Requests with random (from 0.01 to 1) bigger than sum of ratios will be requested by this node.
```
* **Website**: Currently there is only one parameter available which points to the address of the API. Don't change it if you did a full installation. You can find it at the first line of `js/rssz-query.js`.

## Screens
<img src="http://37.187.9.5/public/TorrentzRSS_home.png" title="Home"/>
<img src="http://37.187.9.5/public/TorrentzRSS_results.png" title="results"/>

## License
TorrentzRSS is licensed under [GPL v2](https://github.com/Theadd/TorrentzRSS/blob/master/LICENSE).
