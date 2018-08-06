import styled, { injectGlobal } from "styled-components"

/**
 * When editing global styles, all previous versions will persist until restarting the development server.
 * Seems that styled-components is not flushing the 'injectGlobal' styles when creating new instances of ServerStyleSheet.
 * This is not an issue in production.
 */

// Switch to 'styled.div' to get intellisense
// styled.div`
injectGlobal`
  * {
    /* margin: 0;
    padding: 0; */
    box-sizing: border-box;
  }

  body {
    font-family: "Helvetica Neue", Arial;
    font-size: 18px;
  }

  p {
    line-height: 140%;
  }

  h1,
  h2,
  h3 {
    font-weight: 100;
  }

  a {
    color: hsl(200, 50%, 50%);
    text-decoration: none;
  }

  a.active {
    color: hsl(20, 50%, 50%);
  }

  a:hover {
    text-decoration: underline;
  }

  ul {
    list-style: none;
  }

  .sidebar,
  .content {
    float: left;
    margin: 0;
  }

  .sidebar {
    background: #eee;
    padding: 10px;
    margin: 0 20px 0 0;
  }

  .sidebar li {
    padding: 5px;
  }

  .content {
    max-width: 700px;
  }

  .content :first-child {
    margin-top: 0;
  }

  code {
    background: #eee;
    padding: 0 5px;
  }

  pre code {
    display: block;
  }

  .image-wrapper {
    position: relative;
    display: inline-block;
    width: 340px;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  .image-wrapper .description {
    position: absolute;
    bottom: 5px;
    right: 0;
    left: 0;
    text-align: right;
    padding: 5px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    z-index: 10;
  }

  .image-example ul,
  .image-example li {
    margin: 0;
    padding: 0;
  }
`
