# 10 years of Shannon Airport Weather Data

https://jessdevine.github.io/interactive-frontend-project/

For my Interactive Frontend Development project I've created a beautifully interactive data dashboard
that uses real life data provided by data.gov.ie. Out of personal interest, I based this project
on the historical weather data of Shannon airport which is my preferred and closest airport to me.


### UX
---

This website is for travel enthusiasts, aviation specialists and climate scientist who are 
curious about different airports around the world, Shannon Airport being the destination this time.

As a traveler, I want to find weather information such as rainfall, sunlight and average temperate.
I want to be able to filter between years and months in order to be able to make the best possible decision
when deciding which airport to travel to. 

As an aviation specialist, I may have been assigned a new route and interested in the location
and it's data. As weather plays a huge factor in aviation I want to learn more about this location
and how it might affect my work. I want to review historical data to see what to expect but to also
review times when things were not as usual.

As a climate scientist I want to be able to review data in a more digestible form rather than
reading plain data. I need to see historical data in order to research the changing climate. I
want to see everything as a whole, but also filter to get specific on certain data types and times
to create correlations with other parts of their research into the climate.


### Features
---

##### Existing Features
— The navigation bar is responsive even though this is a single page site. Using a **scroll spy** it
separates each graph and moves the user to each section and when scrolling the section block will darken in the navigation bar option. 

— A **reset button** resides in the sticky navigation bar allowing users to easily reset charts. 

— **Google Maps API** for Shannon Airport has been included just below the nav bar due to its relevancy
to the overall site and the users that will be visiting will likely use it while navigating the site.

— After the description a **filter button that toggles between months** is above two bar charts
which makes for easy data digestion. 

— Below the button are **two Bar Charts which showcase total rainfall and total sunlight hours**
over a 10-year period.

— Following that is another **filter button**, this time for year. 

— The graph right of that displays a **scatter plot** showcasing a highest gusts of wind recorded every month 
for each year. Using multicolor it helps difference between the data and by hovering over a dot you can
see the year.

— Next up is a **graph of the average air temperate**. Using a **custom reducer in the js** it displays
the average air temperate for each month. 

— To the left of the graph another year selector is in place to help the user toggle between the years.

— Last is a footer with a link to my github.


### Technologies Used
---

[DC.js](https://dc-js.github.io/dc.js/): A javascript charting library with native cross filter support.

[D3.js](https://d3js.org/): A JavaScript library for creating dynamic, interactive data visualizations 
in web browsers. It makes use of the widely implemented SVG, HTML5, and CSS standards.

[Crossfilter.js](http://square.github.io/crossfilter/): Cross filter is a JavaScript library for exploring large multivariate 
data sets in the browser. 

[Google Maps API](https://developers.google.com/maps/documentation/): Google APIs is a set of application programming interfaces developed by Google which allow communication with Google Services and their 
integration to other services. Some of these include Search, Gmail, Translate or Google Maps.

[BootStrap V 3.3.7](https://getbootstrap.com/docs/3.3/): Bootstrap is a free and open-source front-end web framework. It contains HTML and CSS-based design templates for typography, forms, buttons,
navigation and other interface components, as well as optional JavaScript extensions.

[CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3): CSS3 is the latest evolution of the Cascading Style Sheets language.

[HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5): HTML 5 is a software solution stack that defines the properties and behaviors of web page content 
by implementing a markup based pattern to it.


### Testing
---

Due to the nature of DC.js & D3.js I opted for manual testing. 

##### Month Selector & Bar Charts (Rainfall & Sunlight):

— Go to "Filter Month":

— Drop down to select Month and Selects a specific month 

— The following two graphs change and display data per the month selected

- Note: On the month and year selectors/filters, there is an `:11` and `:12` added to end of the options. After lots of troubleshooting
 and researching it appears that this is happening due to something with DC/D3. Couldn't find an answer online
and the same thing happened in the course content without a way to fix it. Would like to implement this in
the future.
- Note 2: Bar Charts: adding in a `value assessor` to set a 2 decimal point would cause the 
bars to get cut off when filtering between years and months. After testing found this is related to the
`elastic y` set on the Y axis. I decided to keep the `elastic y` for visual reasons. Would like to add
the value assessor at some point. 


##### Reset Button 

— Following Filter Month selector

— Navigate to Nav Bar and select "Reset All Charts"

— All charts and graphs on the page reset to default values


##### Scatter Plot & Year Selector 

— Navigates to " the Highest Gust Every Month for 10 Years"

— Resets Chart per the visible sticky Nav Bar Button "Reset All Charts"

— Hovers over each colored dot on the graph to reveal the year associated 

— Moves to "Filter Year:" and selects a year

— Scatter Plot to the right changes to display dater per year selected

- Note: On the X axis of charts using a month format parsed in (as an object), for a reason I can't see why
it adds 1901 to the start of the X axis instead of a January. Would prefer to change this in the future. 



##### Average Air Temperature & Month Selector

— Resets Chart per the visible sticky Nav Bar Button "Reset All Charts"

— Data Resets to default displaying bar chart in full

— Moves to "Filter Year:" and selects a year

— Bar Chart changes to display average data for that year 

- Note: While developing and testing is when I experienced the bars in their lose their entire width 
 after implementing a custom reducer to graph.js to calculate averages. Was able to solve
with CSS to set the bar width.


##### Nav Bar

— While navigating the site, the nav bar stays stuck to the top of the viewport 

— When scrolling each portion of the site the nav bar darkens 

— Can click each section and be brought directly to the chosen to graph


##### Responsive

— The site is responsive when testing in:

- Desktop 

-  Mobile: Collapses all rows to take up one column 

- Tablet: Collapses all rows to take up one column 


### Deployment
---

##### GitHub Pages:

— Using my existing GitHub repo for my project I cloned it to new repository called: 
https://github.com/username/jessdevine.github.io

— Entered the project folder and added an index.html file that reads "Hello World"

— Added https://github.com/username/jessdevine.github.io to my.git ignore

— Added, committed, and pushed my changes to my GitHub repository: 
https://github.com/jessdevine/interactive-frontend-project

— Went to my browser and visited https://jessdevine.github.io/interactive-frontend-project/


### Credits

Airport Weather CSV: https://data.gov.ie/dataset/shannon-airport-monthly-weather-station-data

Intro: https://www.ittn.ie/news/top-10-facts-about-shannon-airport/

How Does Wind Affect Flights: https://www.flightdeckfriend.com/ask-a-captain/aircraft-maximum-wind-limits/

Storm Darwin: https://www.met.ie/cms/assets/uploads/2017/08/2014StormDarwin-1.pdf

Air Temperature: https://theconversation.com/how-hot-weather-and-climate-change-affect-airline-flights-80795

Extended Air Temp: https://www.thejournal.ie/rising-temperatures-planes-3494109-Jul2017/