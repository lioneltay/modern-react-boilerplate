import { ComponentType } from "react"
import { asyncComponent, ComponentLoader } from "lib/async-component"

interface Blog {
  route: string
  label: string
  date: Date
  component: ComponentType
}

export const blogs: Blog[] = [
  {
    route: "mapped-types",
    label: "Typescript: Mapped Types",
    date: new Date(2018, 7, 2),
    component: asyncComponent({
      loader: () => import("./mapped-types.blog.md"),
    }),
  },
  {
    route: "typescript-extends",
    label: "Typescript: Extends",
    date: new Date(2018, 7, 3),
    component: asyncComponent({
      loader: () => import("./typescript-extends.blog.md"),
    }),
  },
].map(blog => ({
  ...blog,
  route: `/blog/${blog.route}`,
}))
