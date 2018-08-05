# The Modern React Boilerplate

This project attempts to create a moden react boilerplate for react applications requiring server-side-rendering (SSR) along with other essential features that become much more difficult to implement when trying to do SSR such as:

- Hot module reloading (HMR)
- Code splitting
- prefetching data on the server and rehydrating that data on the client

## Why another boilerplate project?

Many guides and boiler plates will only implement a few of these essential features which is quite frustrating as none of them are really optional features at all for any serious project. In fact, none of these features are actually difficult to implement themselves, it is implementing these features together that poses the real challenge. This is what this project aims to solve.

## What is the purpose of feature X

### Server Side Rendering

Server side rendering is just the process of sending a complete HTML document to the user. Single page applications (SPA) applications traditionally send a basic skeleton HTML file with little more than a script to populate the HTML on the client. But there are many downsides to this approach.

**Search Engine Optimisation (SEO)**

Search engines will crawl the HTML of your webpage and index the contents for search purposes later. But with SPAs there simply is no content and thus nothing to index or search for. This severely hurts the discoverability of your web application. Some search engines such as Google are beginning to crawl javascript but the extent of such crawling is still unclear and other search engines are taking their time to catch up.

To avoid this problem we have the render our webpage on the server and send a full HTML response along with the script that would control the app on the client.

There is a cost to this however, with SSR, we don't get the benefit of shifting the work of rendering a webpage to the client.

The time to interactivity when the page is fully rendered and scripts are parsed and run will also be longer. But the time to taken to be able to view the page will be much shorter as the HTML will begin rendering immediately.

### Code Splitting

Code splitting is the process of only sending the assets required for the particular page being requested. React defines a very dynamic tree structure for the application, the rendered tree can vary greatly depending on the current state of the app. Because of this it can be difficult to know which components are going to render in advance.

Solutions in the past have involved creating an external routing configuration which allow you to determine which major 'page' components will render for a given router. This approach feels hacky and not like idomatic react. It also has the disadvantage of splitting code on the route level which may not be fined grained enough. Perhaps you want to render a highly interactive UI with many components on a particular route. The key being that it is really the components or modules that we should be splitting our code on.

Instead, what we could do is mark components with some logic that will run when the component is 'used' during the render step. This may be when they are rendered or their constructor is called for example. From this we could collect a list of all the components, and thus modules that have been used, and only send the scripts that contain these to the client.

The major steps:

- Giving the components the ability to mark themselves as being 'used' in the particular render.
  - A unique identifier for the module could be its source path which can be added during the transpilation step through a babel plugin.
- Figuring out which chunks to send given a list of used modules
  - This can be done by having access to both the modules list and the webpack stats
- Preloading the used chunks on the client
  - All chunks should be loaded before attempting to render/hydrate the component tree on the client.
- Preloading the chunks on the server so they can be used synchronously
  - The server already has all the source code, but dynamic imports result in promises which resolve asynchronously

This is the approach taken by solutions like `react-loadable` and `universal-react-component`.

### Hot Module Reloading

Hot module reloading is an essential developerment feature for every project. It allows updates to the source code to appear in development without having to refresh and lose the current state of the app.

When server side rendering, in addition to having HMR on working once the source reaches the browser, we also want the server source to update so that if we do a full refresh, the new source is used.

The concept here isn't much more complicated than without SSR, it's just the implementation details that become a bit more difficult. For example, we can't just simply use some simple configuration options `webpack-dev-server` and call it a day.

### Data fetching on the server

When rendering a React app you'll probably run into points where you fetch data. On the client, it is okay to say, set a loading flag when data is loading and render the full tree when the data arrives. On the server however, rendering is synchronous. This will result in our initial HTML response containing loaders rather than the data we really want to show.

A solution to this is to load all the data we will need in advance before attempting to render the component tree. But how...

This is actually implemented in many different ways. With a static route configuration we can attach data loaders to particular routes that should run if that route is going to be used. But again, this is not fine grained enough what if the components within the route also need to load data (granted you don't want to load data at too many levels or you may be waiting too long)?

The general idea for a solution that does not use a static route configuration is that the React tree will be walked once to find data requirements, mimicing rendering on the client where we 'pause' (it's still synchronous, but we can render multiple times) while waiting for data to load. Once we go through this tree walking step we have all the data we need and can now render the tree sychronously. The problem however is that there isn't a well maintained generic solution for specifying data requirements. `react-apollo` for example has an implementation of this, but it only looks out for the data requirements of their `Query` components and doesn't expose a simple interface for other libraries.

In the future with react suspense this may be a much simpler problem to solve.

The next step is to take the fetched data, serialize it, and send it to the client which will deserialize it and use it to initialize the app state so that the data does not need to be fetched again, and the fully render HTML tree is not immediately replace by loaders.
