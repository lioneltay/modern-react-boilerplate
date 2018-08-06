declare module "*.blog.md" {
  import { ComponentType } from "react"

  const something: ComponentType
  export default something
}

declare module "*.md" {
  const something: string
  export default something
}
