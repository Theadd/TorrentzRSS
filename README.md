TorrentzRSS!
===========

**TorrentzRSS** process [torrentz.eu](http://www.torrentz.eu) RSS results from your search queries and provides a set of advanced rules to merge multiple queries, sort them and exclude unwanted torrents from your search results in several ways. Those results can be retrieved by **XML** (**RSS**), **JSON** or using the **web** interface. 

**Demo** available in [project's page](http://Theadd.github.io/TorrentzRSS/).

## Structure
Front and back ends are independent so you can separate the API (back end) from the web interface (front end) and call the API from your application.

The back end (API) is only composed by a single *process.php* and optionally, the *.htacces* file for url rewritting.

## Advanced Rules
*The execution order of advanced rules and the weight of its parameters is* **fully customizable**.
* Limit number of results
* Merge results from another TorrentzRSS query ID
* Sort results in several ways
* Exclude duplicates from searches containing movies or TV shows

*Not yet implemented:*
* Exclude by patterns on title or category field (Using REGEX or string literals)
* Exclude by evaluating variable based expressions
* *More...*

## License
TorrentzRSS is licensed under [GPL v2](https://github.com/Theadd/TorrentzRSS/blob/master/LICENSE).
