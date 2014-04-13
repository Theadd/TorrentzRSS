TorrentzRSS!
===========
### [Website](http://theadd.github.io/TorrentzRSS/) &nbsp; [Structure](#structure) &nbsp; [Advanced Rules](#advanced-rules) &nbsp; [Installation](#installation) &nbsp; [License](#license)

**TorrentzRSS** processes [torrentz.eu](http://www.torrentz.eu) RSS results from your search queries and provides a set of advanced rules to merge multiple queries, sort them and exclude unwanted torrents from your search results in several ways. The output can be retrieved by **XML** (**RSS**), **JSON** or using the **web** interface.

**Demo** available in [project's page](http://Theadd.github.io/TorrentzRSS/).

## Structure
Front and back ends are independent so you can separate the API (back end) from the web interface (front end) and call the API from your application.

The back end (API) is only composed by a single *process.php* and optionally, the *.htacces* file for url rewriting.

## Advanced Rules
*The execution order of advanced rules and the weight of its parameters is* **fully customizable**.
* Limit number of results
* Merge results from another TorrentzRSS query ID
* Sort results in several ways
* Exclude duplicates from searches containing movies or TV shows
* Exclude by patterns on title or category field (Using REGEX or string literals)
* Evaluate conditionals, e.g. seeds > 100

*Do you think of another rule that might be necessary? Create a new issue.*

## Installation
### Installation: API Only
TorrentzRSS back end (process.php) needs PHP5 + PEAR with the following dependencies:
* `pear install XML_RSS`
* `pear install XML_Serializer-0.20.2`

> Only if you are unable to install these dependencies or you don't know what I'm talking about, extract the contents of [this](http://37.187.9.5/public/dependencies.zip) archive in the same directory of `process.php` while following the instructions below.

*It also requires [cURL](http://curl.haxx.se/download.html) but probably you already have it.*

**Instructions:**
* Copy `process.php` and `data` folder (*which is empty*) anywhere accessible by your web server.
* Optionally, copy `.htaccess` in the same directory to enable url rewriting.
* Set write permissions to `data` folder, `chmod 0777 data` will do the job.
* Open your browser and navigate to `http://YOURSERVER/process.php?f=rss&p=feed-1&q=example` and make sure it works properly.

## License
TorrentzRSS is licensed under [GPL v2](https://github.com/Theadd/TorrentzRSS/blob/master/LICENSE).
