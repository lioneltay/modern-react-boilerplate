
# Blog

- [ ] blog list (like https://rust.facepunch.com/blog/)
- [ ] giving blogs dates
- [ ] Need to be able to get all blog posts and sort them by date and render
  - [ ] Manually create a mapping file
    ```typescript
    const blogs = [
      {
        publishDate: "5/5/2018",
        component: asyncComponent({ loader: () => import('the post')})
      }
    ]
    ```
    - no need for a database (comments later)
    - blogs may take a while to make, the publish date should be when it's added to the ui, at that point you can add the publish date manually


# Other
- [ ] prettier configuration

- [x] html headers (react-helmet)

- [x] webpack loader for md blog files that turns them straight into a react component
- [ ] Code splitting example
- [ ] Card style
- [ ] add custom styles to markdown
- [x] React-router link that isnt an anchor tag (Just use route and render prop)

- [ ] drag and drop

- [ ] some small games

- [ ] List repositories