# Map-A-Test

![Logo](assets/images/test-map-logo.png)

## Table of Contents:

* [Description](#description)
* [Link to the Map-A-Test Site](#live-site)
* [Demo](#demo)
* [Technology Stack](#technology-stack)
* [Authors](#authors)

## Description

As of January 2022, the US is seeing the highest Covid levels on record and tests are in demand now more than ever. We wanted to give users a place to quickly and easily find Covid testing sites in their area. It was our goal to make the website interface simple, clutter-free and easy to use. 
Our app currently works within the United States. It uses the Google Maps API to retrieve the users location and communicates that to the Here Developer API which provides detailed information about the testing sites.  
Once the users location is determined, they will be able to view test site information either on the map directly or on the side panel that will appear. Both options will have the name of the test site, as well as an approximate location and phone number.


## Live Site

* [Map-A-Test: Find a Covid Testing Site Near You](https://laurendarrimon.github.io/find-covid-testing/)
![Image of Deployed Site](assets/images/deployedsite-image.png)


## Technology Stack

* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [jQuery](https://jquery.com/)
* [Foundation](https://get.foundation/sites/docs/index.html)
* [Parsley](https://parsleyjs.org/doc/index.html)
* [Google Maps Api](https://developers.google.com/maps/documentation/javascript/overview)
* [Finding COVID-19 Testing Sites API](https://developer.here.com/blog/finding-covid-19-testing-sites)


## Demo
* The site will fetch the users location automatically.
![Fetch Location Gif](/assets/images/READMEgifs/fetchlocation.gif)
![code](/assets/images/READMEgifs/1.searchcurrentlocation.png)

* The map will display markers for each test site near the user. Each marker will display information on the test site. There will also be a side panel that will display the 10 closest test sites and their information.
![Markers & test sites Gif](/assets/images/READMEgifs/markersandsidepanel.gif)
![code](/assets/images/READMEgifs/animatedmapmarkers.png)

* The user can view a list of past locations they have searched, which persists after reload
![Local Storage Gif](/assets/images/READMEgifs/localstg-ogsize.gif)
![code](/assets/images/READMEgifs/pastlocations.png)

* The site will be mobile responsive.
![Mobile Responsiveness](/assets/images/READMEgifs/mobilegif.gif)
![code](/assets/images/READMEgifs/mobileresponsive.png)


## Authors

**Lauren Darrimon**

* [Lauren's GitHub](https://github.com/LaurenDarrimon)
* [Lauren's LinkedIn](https://www.linkedin.com/in/lauren-lalita-duker-9537b1201/)

**Iman Mansour**

* [Iman's GitHub](https://github.com/imanmansour86)
* [Iman's LinkedIn](https://www.linkedin.com/in/iman-mansour-51391515/)

**Leslie Patino**

* [Leslie's GitHub](https://github.com/lesliejpatino)
* [Leslie's LinkedIn](https://www.linkedin.com/in/lesliejpatino/)

## License
[MIT Open Source Software](https://choosealicense.com/licenses/mit/)